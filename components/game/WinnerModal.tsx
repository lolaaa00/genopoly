"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Trophy } from "lucide-react";
import { truncateAddress, formatBalance } from "@/lib/utils";
import type { GameState } from "@/types";

interface Props { gameState: GameState; myWallet: string; }

export default function WinnerModal({ gameState, myWallet }: Props) {
  const router = useRouter();
  const winner = gameState.players.find((p) => p.wallet?.toLowerCase() === gameState.winner?.toLowerCase());
  const isWinner = gameState.winner?.toLowerCase() === myWallet.toLowerCase();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,16,19,0.9)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#0D1F23", border: "1px solid rgba(217,130,54,0.4)", borderRadius: 20, padding: 40, maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: "#D98236" }}>{isWinner ? "You Won!" : "Game Over"}</h2>
        <p style={{ color: "#B3C7C3", marginBottom: 24, fontSize: 15 }}>
          {isWinner ? "Congratulations! You built the winning empire." : `${truncateAddress(gameState.winner ?? "", 4)} won the game.`}
        </p>
        {winner && (
          <div style={{ background: "#071013", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#77918B", marginBottom: 8 }}>Winner</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{truncateAddress(winner.wallet, 6)}</div>
            <div style={{ color: "#D98236", fontWeight: 800, fontSize: 20 }}>{formatBalance(winner.balance)}</div>
            <div style={{ fontSize: 12, color: "#77918B", marginTop: 4 }}>{winner.properties.length} properties owned</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Button variant="primary" onClick={() => router.push("/create")}>Play Again</Button>
          <Button variant="secondary" onClick={() => router.push("/leaderboard")}>Leaderboard</Button>
        </div>
        <p style={{ fontSize: 11, color: "#77918B", marginTop: 16 }}>Result verified by GenLayer Intelligent Contract</p>
      </div>
    </div>
  );
}
