import type { MoveHistoryItem } from "@/types";
import { truncateAddress } from "@/lib/utils";

interface Props { moves: MoveHistoryItem[]; }

export default function MoveHistory({ moves }: Props) {
  return (
    <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(179,199,195,0.1)", fontSize: 12, fontWeight: 700, color: "#77918B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Move History</div>
      <div style={{ maxHeight: 260, overflowY: "auto", padding: "8px 0" }}>
        {moves.length === 0 && <div style={{ padding: "20px 18px", color: "#77918B", fontSize: 13 }}>No moves yet</div>}
        {[...moves].reverse().map((m) => (
          <div key={m.moveNumber} style={{ padding: "8px 18px", borderBottom: "1px solid rgba(179,199,195,0.06)", fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ color: "#D98236", fontWeight: 600 }}>#{m.moveNumber} {truncateAddress(m.player, 3)}</span>
              <span style={{ color: "#77918B" }}>{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
            <div style={{ color: "#B3C7C3" }}>{m.action}</div>
            {m.txHash && <div style={{ fontSize: 10, color: "#77918B", fontFamily: "monospace", marginTop: 2 }}>{m.txHash.slice(0, 20)}…</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
