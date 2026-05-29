"use client";
import { useState } from "react";
import { rollDice } from "@/lib/genlayer/contract";
import { useGameStore } from "@/store/gameStore";
import Button from "@/components/ui/Button";
import { Dices } from "lucide-react";

const DIE_FACE = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

interface Props { gameId: string; myWallet: string; }

export default function DicePanel({ gameId, myWallet }: Props) {
  const { isMyTurn, gameState } = useGameStore();
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState("");
  const last = gameState?.lastDiceRoll;

  async function handleRoll() {
    setRolling(true);
    setError("");
    try {
      await rollDice(gameId, myWallet);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Roll failed");
    } finally {
      setRolling(false);
    }
  }

  return (
    <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#77918B", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6 }}>
        <Dices size={14} /> Dice
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 48, height: 48, background: "#071013", border: `2px solid ${last ? "#D98236" : "rgba(179,199,195,0.2)"}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, transition: "all 0.3s" }}>
            {last ? DIE_FACE[last.die1] : "?"}
          </div>
          <div style={{ width: 48, height: 48, background: "#071013", border: `2px solid ${last ? "#D98236" : "rgba(179,199,195,0.2)"}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, transition: "all 0.3s" }}>
            {last ? DIE_FACE[last.die2] : "?"}
          </div>
        </div>
        {last && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#D98236" }}>{last.total}</div>
            {last.isDoubles && <div style={{ fontSize: 11, color: "#2DD4BF", fontWeight: 700 }}>DOUBLES!</div>}
          </div>
        )}
      </div>
      {error && <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>{error}</div>}
      <Button
        variant="primary"
        onClick={handleRoll}
        loading={rolling}
        disabled={!isMyTurn || rolling}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {isMyTurn ? "Roll Dice" : "Waiting for your turn..."}
      </Button>
      {last && (
        <div style={{ marginTop: 10, fontSize: 11, color: "#77918B" }}>
          Rolled by {last.player?.slice(0, 8)}… · Move #{last.moveNumber}
        </div>
      )}
    </div>
  );
}
