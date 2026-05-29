import type { GameState } from "@/types";
import { truncateAddress, formatBalance } from "@/lib/utils";
import PlayerToken from "@/components/board/PlayerToken";
import Badge from "@/components/ui/Badge";
import { BOARD_SPACES } from "@/lib/constants";

interface Props { gameState: GameState; myWallet: string; }

export default function PlayerSidebar({ gameState, myWallet }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {gameState.players.map((p, i) => {
        const isMe = p.wallet?.toLowerCase() === myWallet.toLowerCase();
        const isCurrent = i === gameState.currentPlayerIndex;
        return (
          <div key={p.wallet} style={{ background: isMe ? "rgba(217,130,54,0.06)" : "#0D1F23", border: `1px solid ${isCurrent ? "rgba(217,130,54,0.4)" : "rgba(179,199,195,0.18)"}`, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <PlayerToken playerIndex={i} size={22} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{truncateAddress(p.wallet, 4)}</div>
                <div style={{ fontSize: 11, color: "#77918B" }}>{BOARD_SPACES[p.position]?.name ?? `Space ${p.position}`}</div>
              </div>
              <Badge variant={p.status === "active" ? (isCurrent ? "copper" : "default") : p.status === "bankrupt" ? "danger" : "warning"}>
                {p.status === "bankrupt" ? "💀" : isCurrent ? "▶" : p.status}
              </Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
              <div><span style={{ color: "#77918B" }}>Balance </span><span style={{ color: "#D98236", fontWeight: 700 }}>{formatBalance(p.balance)}</span></div>
              <div><span style={{ color: "#77918B" }}>Props </span><span style={{ fontWeight: 700 }}>{p.properties.length}</span></div>
              {p.releaseCards > 0 && <div style={{ gridColumn: "span 2" }}><span style={{ color: "#2DD4BF", fontSize: 11 }}>🃏 {p.releaseCards} release card{p.releaseCards > 1 ? "s" : ""}</span></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
