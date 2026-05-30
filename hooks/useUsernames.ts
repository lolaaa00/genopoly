"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { truncateAddress } from "@/lib/utils";

// In-memory cache shared across hook instances within a tab.
const cache = new Map<string, string>();
const subscribers = new Set<() => void>();

function notifyAll() {
  for (const fn of subscribers) fn();
}

function normalize(w: string | null | undefined): string {
  return (w ?? "").toLowerCase();
}

/** Returns a display name for a wallet — username if known, else 0xABCD...EF12. */
export function displayName(wallet: string | null | undefined, chars = 4): string {
  if (!wallet) return "";
  const cached = cache.get(normalize(wallet));
  if (cached && cached.trim().length > 0) return cached;
  return truncateAddress(wallet, chars);
}

/** Subscribe to username changes; returns a stable display-name resolver. */
export function useUsernames(wallets: (string | null | undefined)[]) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const sub = () => setTick((n) => n + 1);
    subscribers.add(sub);
    return () => {
      subscribers.delete(sub);
    };
  }, []);

  useEffect(() => {
    const need = wallets.map(normalize).filter((w) => w && !cache.has(w));
    if (need.length === 0) return;
    const supabase = getSupabaseClient() as any;
    supabase
      .from("profiles")
      .select("wallet, username")
      .in("wallet", need)
      .then(({ data }: { data: { wallet: string; username: string | null }[] | null }) => {
        let changed = false;
        if (data) {
          for (const row of data) {
            const w = normalize(row.wallet);
            const name = row.username ?? "";
            if (cache.get(w) !== name) {
              cache.set(w, name);
              changed = true;
            }
          }
        }
        // Mark any still-missing wallets as known-empty so we don't refetch
        for (const w of need) {
          if (!cache.has(w)) cache.set(w, "");
        }
        if (changed) notifyAll();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets.join(",")]);

  return useCallback((w: string | null | undefined, chars = 4) => displayName(w, chars), []);
}

/** Save the current wallet's username to Supabase. Updates the cache locally. */
export async function setMyUsername(
  wallet: string,
  username: string
): Promise<{ error?: string }> {
  const w = normalize(wallet);
  const name = username.trim().slice(0, 24);
  if (!w) return { error: "Wallet required" };
  if (name.length < 2) return { error: "Username must be at least 2 characters" };
  const supabase = getSupabaseClient() as any;
  const { error } = await supabase
    .from("profiles")
    .upsert(
      { wallet: w, username: name, updated_at: new Date().toISOString() },
      { onConflict: "wallet" }
    );
  if (error) return { error: error.message as string };
  cache.set(w, name);
  notifyAll();
  return {};
}

/** Read the current wallet's username. Fetches from Supabase if not cached. */
export async function fetchMyUsername(wallet: string): Promise<string> {
  const w = normalize(wallet);
  if (!w) return "";
  if (cache.has(w)) return cache.get(w) ?? "";
  const supabase = getSupabaseClient() as any;
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("wallet", w)
    .maybeSingle();
  const name = (data?.username as string | null) ?? "";
  cache.set(w, name);
  notifyAll();
  return name;
}
