"use client";

import * as contract from "./contract";
import type { GameState } from "@/types";

// Convert snake_case keys (from the GenLayer contract) to camelCase
// throughout an object tree. Arrays are walked element-wise.
function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelize);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[snakeToCamel(k)] = camelize(v);
    }
    return out;
  }
  return value;
}

function parseAndCamelize<T = unknown>(raw: unknown): T | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed === null || parsed === undefined) return null;
    return camelize(parsed) as T;
  } catch {
    return null;
  }
}

export async function fetchGameState(gameId: string): Promise<GameState | null> {
  try {
    const raw = await contract.getGame(gameId);
    const parsed = parseAndCamelize<GameState>(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as GameState).players)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function fetchOpenGames(): Promise<unknown[]> {
  try {
    const raw = await contract.getOpenGames();
    const parsed = parseAndCamelize<unknown[]>(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function fetchLeaderboard(): Promise<unknown[]> {
  try {
    const raw = await contract.getLeaderboard();
    const parsed = parseAndCamelize<unknown[]>(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
