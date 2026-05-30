"use client";

import { useEffect, useState, useCallback } from "react";
import {
  summary,
  subscribeWallet,
  type EmbeddedSummary,
} from "@/lib/wallet/embedded";

export function useEmbeddedWallet() {
  const [state, setState] = useState<EmbeddedSummary>({
    exists: false,
    unlocked: false,
    address: null,
    createdAt: null,
  });
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const s = await summary();
    setState(s);
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribeWallet(refresh);
    return unsub;
  }, [refresh]);

  return { ...state, hydrated, refresh };
}
