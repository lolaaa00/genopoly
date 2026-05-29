"use client";
import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Shield, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

export default function ProofPanel() {
  const { proofData, gameState } = useGameStore();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyProof = () => {
    navigator.clipboard.writeText(JSON.stringify(proofData ?? {}, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ background: "#0D1F23", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 14, overflow: "hidden" }}>
      <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", background: "none", border: "none", padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#F6FAF9", textAlign: "left" }}>
        <Shield size={14} style={{ color: "#2DD4BF" }} />
        <span style={{ fontWeight: 700, fontSize: 13, flex: 1, color: "#2DD4BF" }}>GenLayer Proof</span>
        {expanded ? <ChevronUp size={14} style={{ color: "#77918B" }} /> : <ChevronDown size={14} style={{ color: "#77918B" }} />}
      </button>
      {expanded && (
        <div style={{ padding: "0 18px 18px" }}>
          <p style={{ fontSize: 12, color: "#77918B", marginBottom: 14, lineHeight: 1.6 }}>
            Genopoly uses GenLayer as the official referee. Supabase only mirrors this state for speed. Every dice roll, rent, auction, and trade result is verified on-chain.
          </p>
          {gameState && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14, fontSize: 12 }}>
              <div style={{ background: "#071013", borderRadius: 8, padding: 10 }}>
                <div style={{ color: "#77918B", marginBottom: 2 }}>Game ID</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#2DD4BF" }}>{gameState.gameId?.slice(0, 16)}…</div>
              </div>
              <div style={{ background: "#071013", borderRadius: 8, padding: 10 }}>
                <div style={{ color: "#77918B", marginBottom: 2 }}>Turn</div>
                <div style={{ fontWeight: 700 }}>#{gameState.turnNumber}</div>
              </div>
              <div style={{ background: "#071013", borderRadius: 8, padding: 10 }}>
                <div style={{ color: "#77918B", marginBottom: 2 }}>Status</div>
                <div style={{ color: gameState.status === "active" ? "#22C55E" : "#FBBF24", fontWeight: 700 }}>{gameState.status}</div>
              </div>
              <div style={{ background: "#071013", borderRadius: 8, padding: 10 }}>
                <div style={{ color: "#77918B", marginBottom: 2 }}>Last Dice</div>
                <div style={{ fontWeight: 700 }}>{gameState.lastDiceRoll ? `${gameState.lastDiceRoll.die1}+${gameState.lastDiceRoll.die2}=${gameState.lastDiceRoll.total}` : "—"}</div>
              </div>
            </div>
          )}
          {proofData && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#77918B" }}>Latest action proof</span>
                <button onClick={copyProof} style={{ background: "none", border: "none", color: "#2DD4BF", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre style={{ background: "#071013", borderRadius: 8, padding: 10, fontSize: 10, color: "#A7F3D0", overflow: "auto", maxHeight: 120, fontFamily: "monospace" }}>
                {JSON.stringify(proofData, null, 2)}
              </pre>
            </div>
          )}
          {!proofData && <div style={{ fontSize: 12, color: "#77918B", textAlign: "center", padding: "8px 0" }}>No proof data yet. Take an action to see proof.</div>}
        </div>
      )}
    </div>
  );
}
