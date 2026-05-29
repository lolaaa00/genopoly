"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGameState } from "@/lib/genlayer/actions";
import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";

export function useGameState(gameId: string | null) {
  const setGameState = useGameStore((s) => s.setGameState);

  const query = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameState(gameId!),
    enabled: !!gameId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (query.data) setGameState(query.data);
  }, [query.data, setGameState]);

  return query;
}
