"use client";

import { useEffect, useRef } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useSupabaseChannel(
  channelName: string,
  onEvent: (event: string, payload: unknown) => void,
  enabled = true
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const supabase = getSupabaseClient();
    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "*" }, (payload) => {
        onEvent(payload.event, payload.payload);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, enabled]);

  return channelRef;
}
