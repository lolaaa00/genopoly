"use client";

import * as contract from "./contract";
import type { GameState } from "@/types";

export async function fetchGameState(gameId: string): Promise<GameState | null> {
  try {
    const raw = await contract.getGame(gameId);
    if (!raw) return null;
    if (typeof raw === "string") return JSON.parse(raw) as GameState;
    return raw as GameState;
  } catch {
    return null;
  }
}

export async function fetchOpenGames(): Promise<unknown[]> {
  try {
    const raw = await contract.getOpenGames();
    if (!raw) return [];
    if (typeof raw === "string") return JSON.parse(raw) as unknown[];
    return raw as unknown[];
  } catch {
    return [];
  }
}

export async function fetchLeaderboard(): Promise<unknown[]> {
  try {
    const raw = await contract.getLeaderboard();
    if (!raw) return [];
    if (typeof raw === "string") return JSON.parse(raw) as unknown[];
    return raw as unknown[];
  } catch {
    return [];
  }
}
