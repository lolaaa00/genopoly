"use client";
import { useQuery } from "@tanstack/react-query";
import { truncateAddress } from "@/lib/utils";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { History, ExternalLink } from "lucide-react";
import type { GameHistoryItem } from "@/types";

async function fetchHistory(): Promise<GameHistoryItem[]> {
  const res = await fetch("/api/games/history");
  if (!res.ok) return [];
  const data = await res.json() as { games: GameHistoryItem[] };
  return data.games ?? [];
}

export default function HistoryPage() {
  const { data: games = [], isLoading } = useQuery({ queryKey: ["history"], queryFn: fetchHistory });

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <History size={28} style={{ color: "#D98236" }} />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 2 }}>Game History</h1>
            <p style={{ color: "#B3C7C3", fontSize: 14, margin: 0 }}>Past on-chain matches</p>
          </div>
        </div>
        <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 80px 100px", gap: 0, padding: "12px 20px", borderBottom: "1px solid rgba(179,199,195,0.1)", fontSize: 11, fontWeight: 700, color: "#77918B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>Players</span><span>Winner</span><span>Moves</span><span>Status</span><span>Date</span><span></span>
          </div>
          {isLoading && <div style={{ padding: 40, textAlign: "center", color: "#77918B" }}>Loading...</div>}
          {!isLoading && games.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#77918B" }}>No games yet</div>
          )}
          {games.map((g, i) => (
            <div key={g.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 80px 100px", gap: 0, padding: "14px 20px", borderBottom: "1px solid rgba(179,199,195,0.06)", alignItems: "center", background: i % 2 === 0 ? "transparent" : "rgba(19,46,53,0.2)" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {g.players.map((p) => (
                  <Link key={p} href={`/profile/${p}`} style={{ fontSize: 12, color: "#B3C7C3", textDecoration: "none", background: "#132E35", borderRadius: 4, padding: "2px 6px" }}>{truncateAddress(p, 3)}</Link>
                ))}
              </div>
              <span style={{ color: "#22C55E", fontWeight: 600, fontSize: 13 }}>{g.winner ? truncateAddress(g.winner, 3) : "—"}</span>
              <span style={{ fontSize: 13 }}>{g.moveCount}</span>
              <Badge variant={g.status === "completed" ? "success" : g.status === "cancelled" ? "danger" : "warning"}>{g.status}</Badge>
              <span style={{ fontSize: 12, color: "#77918B" }}>{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "—"}</span>
              <Link href={`/game/${g.genlayerGameId}`} style={{ color: "#D98236", textDecoration: "none", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><ExternalLink size={12} /> View</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
