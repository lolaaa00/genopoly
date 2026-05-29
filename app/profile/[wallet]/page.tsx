"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlayerStats } from "@/lib/genlayer/contract";
import { truncateAddress, formatBalance } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { User, Trophy, TrendingDown, TrendingUp } from "lucide-react";

export default function ProfilePage({ params }: { params: Promise<{ wallet: string }> }) {
  const { wallet } = use(params);
  const { data: stats } = useQuery({ queryKey: ["stats", wallet], queryFn: () => getPlayerStats(wallet) });

  const s = stats as Record<string, unknown> | null;

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#D98236,#A85C20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={24} style={{ color: "#071013" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{truncateAddress(wallet, 6)}</h1>
              <div style={{ fontSize: 12, color: "#77918B", fontFamily: "monospace" }}>{wallet}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 14 }}>
            {[
              { label: "Wins", value: String(s?.wins ?? 0), icon: Trophy, color: "#22C55E" },
              { label: "Losses", value: String(s?.losses ?? 0), icon: TrendingDown, color: "#EF4444" },
              { label: "Bankruptcies", value: String(s?.bankruptcies ?? 0), icon: TrendingDown, color: "#FBBF24" },
              { label: "Games Played", value: String(s?.games_played ?? 0), icon: TrendingUp, color: "#D98236" },
              { label: "Rent Collected", value: formatBalance(Number(s?.total_rent_collected ?? 0)), icon: TrendingUp, color: "#2DD4BF" },
              { label: "Auctions Won", value: String(s?.auctions_won ?? 0), icon: Trophy, color: "#A78BFA" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ background: "#132E35", borderRadius: 10, padding: 16 }}>
                <Icon size={16} style={{ color, marginBottom: 8 }} />
                <div style={{ fontWeight: 800, fontSize: 20, color, marginBottom: 2 }}>{value}</div>
                <div style={{ fontSize: 12, color: "#77918B" }}>{label}</div>
              </div>
            ))}
          </div>
          {s && (
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#77918B" }}>Fair Play Score</span>
              <Badge variant={Number(s.fair_play_score ?? 0) > 80 ? "success" : "warning"}>{String(s.fair_play_score ?? "N/A")}</Badge>
            </div>
          )}
          {!s && <div style={{ color: "#77918B", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No on-chain stats yet for this wallet.</div>}
        </div>
      </div>
    </div>
  );
}
