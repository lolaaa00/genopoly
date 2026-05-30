"use client";
import type { GameState } from "@/types";
import PlayerToken from "@/components/board/PlayerToken";
import Badge from "@/components/ui/Badge";
import { BOARD_SPACES } from "@/lib/constants";
import { useUsernames } from "@/hooks/useUsernames";

interface Props { gameState: GameState; myWallet: string; }

export default function TurnPanel({ gameState, myWallet }: Props) {
  const cp = gameState.players[gameState.currentPlayerIndex];
  const isMe = cp?.wallet?.toLowerCase() === myWallet.toLowerCase();
  const nameOf = useUsernames([cp?.wallet]);

  return (
    <div style={{ background: isMe ? "rgba(217,130,54,0.04)" : "#0D1F23", border: `1px solid ${isMe ? "rgba(217,130,54,0.4)" : "rgba(179,199,195,0.18)"}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#77918B", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Current Turn</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <PlayerToken playerIndex={gameState.currentPlayerIndex} size={28} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{nameOf(cp?.wallet)}</div>
          <div style={{ fontSize: 12, color: "#77918B" }}>Turn #{gameState.turnNumber}</div>
        </div>
        {isMe && <div style={{ marginLeft: "auto" }}><Badge variant="copper">YOUR TURN</Badge></div>}
      </div>
      {cp && (
        <div style={{ fontSize: 12, color: "#B3C7C3" }}>
          At: <span style={{ color: "#D98236" }}>{BOARD_SPACES[cp.position]?.name ?? `Space ${cp.position}`}</span>
          {cp.inLockup && <span style={{ color: "#EF4444", marginLeft: 8 }}>🔒 In Lockup</span>}
        </div>
      )}
      {gameState.pendingAction && gameState.pendingAction !== "none" && (
        <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, fontSize: 12, color: "#FBBF24" }}>
          Pending: {gameState.pendingAction.replace(/_/g, " ")}
        </div>
      )}
    </div>
  );
}
