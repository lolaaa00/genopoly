import type { GameState } from "@/types";
import { formatBalance } from "@/lib/utils";

interface Props { gameState: GameState | null; }

export default function BoardInner({ gameState }: Props) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#071013", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#D98236,#A85C20)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GENOPOLY</div>
      <div style={{ fontSize: 9, color: "#77918B", textAlign: "center", fontStyle: "italic" }}>Build your empire.<br />Prove every move.</div>
      {gameState && (
        <div style={{ width: "100%", marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {gameState.players.map((p, i) => (
            <div key={p.wallet} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["#D98236","#2DD4BF","#FBBF24","#A78BFA"][i], flexShrink: 0 }} />
              <span style={{ color: "#B3C7C3", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.wallet.slice(0, 6)}…</span>
              <span style={{ color: "#D98236", fontWeight: 700, flexShrink: 0 }}>{formatBalance(p.balance)}</span>
            </div>
          ))}
        </div>
      )}
      {!gameState && <div style={{ fontSize: 9, color: "#77918B" }}>GenLayer Referee</div>}
    </div>
  );
}
