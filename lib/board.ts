import { BOARD_SPACES, DISTRICTS } from "./constants";
import type { BoardSpace, DistrictName } from "@/types";

export function getSpace(id: number): BoardSpace {
  return BOARD_SPACES[id];
}

export function getDistrictSpaces(district: DistrictName): number[] {
  if (!district) return [];
  return DISTRICTS[district] ?? [];
}

export function isDistrictComplete(district: DistrictName, ownedByPlayer: number[]): boolean {
  if (!district) return false;
  const allSpaces = getDistrictSpaces(district);
  return allSpaces.every((id) => ownedByPlayer.includes(id));
}

export function getBoardPosition(index: number): { row: number; col: number; side: "bottom" | "left" | "top" | "right" } {
  // Board layout: 40 spaces, 11 per side
  if (index >= 0 && index <= 10) return { row: 10, col: 10 - index, side: "bottom" };
  if (index >= 11 && index <= 20) return { row: 10 - (index - 10), col: 0, side: "left" };
  if (index >= 21 && index <= 30) return { row: 0, col: index - 20, side: "top" };
  return { row: index - 30, col: 10, side: "right" };
}
