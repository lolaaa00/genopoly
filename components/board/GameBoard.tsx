"use client";
import { BOARD_SPACES, PLAYER_COLORS } from "@/lib/constants";
import type { GameState } from "@/types";
import BoardSpaceCell from "./BoardSpaceCell";
import PlayerToken from "./PlayerToken";
import BoardInner from "./BoardInner";

interface Props {
  gameState: GameState | null;
  onSpaceClick?: (spaceId: number) => void;
}

function getGridPosition(spaceId: number): { row: number; col: number; rotation?: number } {
  if (spaceId === 0) return { row: 10, col: 10, rotation: 0 };
  if (spaceId === 10) return { row: 10, col: 0, rotation: 90 };
  if (spaceId === 20) return { row: 0, col: 0, rotation: 180 };
  if (spaceId === 30) return { row: 0, col: 10, rotation: 270 };

  if (spaceId >= 1 && spaceId <= 9) return { row: 10, col: 10 - spaceId };
  if (spaceId >= 11 && spaceId <= 19) return { row: 10 - (spaceId - 10), col: 0 };
  if (spaceId >= 21 && spaceId <= 29) return { row: 0, col: spaceId - 20 };
  return { row: spaceId - 30, col: 10 };
}

export default function GameBoard({ gameState, onSpaceClick }: Props) {
  const playerPositions: Record<number, number[]> = {};
  if (gameState) {
    gameState.players.forEach((p, idx) => {
      if (p.status !== "bankrupt") {
        if (!playerPositions[p.position]) playerPositions[p.position] = [];
        playerPositions[p.position].push(idx);
      }
    });
  }

  return (
    <div style={{ width: "100%", aspectRatio: "1/1", maxWidth: 640, position: "relative" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "72px repeat(9,1fr) 72px",
        gridTemplateRows: "72px repeat(9,1fr) 72px",
        width: "100%",
        height: "100%",
        background: "#102429",
        border: "3px solid #D98236",
        borderRadius: 4,
        overflow: "hidden",
        gap: 0,
      }}>
        {BOARD_SPACES.map((space) => {
          const { row, col, rotation } = getGridPosition(space.id);
          const tokens = playerPositions[space.id] ?? [];
          const isCorner = [0, 10, 20, 30].includes(space.id);
          return (
            <div
              key={space.id}
              style={{
                gridRow: `${row + 1} / ${row + 2}`,
                gridColumn: `${col + 1} / ${col + 2}`,
                position: "relative",
                cursor: onSpaceClick ? "pointer" : "default",
              }}
              onClick={() => onSpaceClick?.(space.id)}
            >
              <BoardSpaceCell space={space} isCorner={isCorner} rotation={rotation} />
              {tokens.length > 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", padding: 2, pointerEvents: "none", gap: 2, zIndex: 10 }}>
                  {tokens.map((playerIdx) => (
                    <PlayerToken key={playerIdx} playerIndex={playerIdx} size={isCorner ? 18 : 12} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {/* Center */}
        <div style={{ gridRow: "2 / 11", gridColumn: "2 / 11", overflow: "hidden" }}>
          <BoardInner gameState={gameState} />
        </div>
      </div>
    </div>
  );
}
