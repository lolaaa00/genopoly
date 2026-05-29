"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/lib/genlayer/actions";
import { truncateAddress, formatBalance } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Trophy, TrendingUp } from "lucide-react";
import type { LeaderboardRow } from "@/types";

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["leaderboard"], queryFn: () => fetchLeaderboard(), refetchInterval: 30_000 });
  const rows = (data ?? []) as LeaderboardRow[];

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Trophy size={32} style={{ color: "#D98236", marginBottom: 12 }} />
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Leaderboard</h1>
          <p style={{ color: "#B3C7C3", fontSize: 15 }}>All-time stats from verified on-chain games</p>
        </div>
        <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px 60px 60px 100px 100px 70px 80px", gap: 0, padding: "12px 20px", borderBottom: "1px solid rgba(179,199,195,0.1)", fontSize: 11, fontWeight: 700, color: "#77918B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>#</span><span>Player</span><span>Wins</span><span>Loss</span><span>BK</span><span>Net Worth</span><span>Rent Coll.</span><span>Auctions</span><span>Fair Play</span>
          </div>
          {isLoading && (
            <div style={{ padding: 40, textAlign: "center", color: "#77918B" }}>Loading leaderboard...</div>
          )}
          {!isLoading && rows.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#77918B" }}>
              <TrendingUp size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No games completed yet. Be the first!</p>
            </div>
          )}
          {rows.map((row, i) => (
            <div key={row.wallet} style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px 60px 60px 100px 100px 70px 80px", gap: 0, padding: "14px 20px", borderBottom: "1px solid rgba(179,199,195,0.06)", alignItems: "center", background: i % 2 === 0 ? "transparent" : "rgba(19,46,53,0.2)" }}>
              <span style={{ fontWeight: 700, color: i === 0 ? "#D98236" : i === 1 ? "#B3C7C3" : i === 2 ? "#A85C20" : "#77918B" }}>{i + 1}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{row.username || truncateAddress(row.wallet)}</div>
                <div style={{ fontSize: 11, color: "#77918B" }}>{truncateAddress(row.wallet, 4)}</div>
              </div>
              <span style={{ color: "#22C55E", fontWeight: 700 }}>{row.wins}</span>
              <span style={{ color: "#EF4444" }}>{row.losses}</span>
              <span style={{ color: "#FBBF24" }}>{row.bankruptcies}</span>
              <span style={{ color: "#D98236", fontWeight: 600 }}>{formatBalance(row.totalNetWorth)}</span>
              <span style={{ color: "#2DD4BF" }}>{formatBalance(row.totalRentCollected)}</span>
              <span>{row.auctionsWon}</span>
              <Badge variant={row.fairPlayScore > 80 ? "success" : row.fairPlayScore > 50 ? "warning" : "danger"}>{row.fairPlayScore}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
