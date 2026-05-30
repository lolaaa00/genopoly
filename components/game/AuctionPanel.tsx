"use client";
import { useState } from "react";
import { placeAuctionBid, passAuction } from "@/lib/genlayer/contract";
import type { AuctionState } from "@/types";
import Button from "@/components/ui/Button";
import { formatBalance } from "@/lib/utils";
import { BOARD_SPACES } from "@/lib/constants";
import { Gavel } from "lucide-react";
import { useUsernames } from "@/hooks/useUsernames";

interface Props { gameId: string; myWallet: string; auction: AuctionState; myBalance: number; }

export default function AuctionPanel({ gameId, myWallet, auction, myBalance }: Props) {
  const nameOf = useUsernames([auction.highestBidder]);
  const [bid, setBid] = useState(auction.highestBid + 10);
  const [loading, setLoading] = useState(false);
  const space = BOARD_SPACES[auction.spaceId];
  const hasPassed = auction.passedPlayers.includes(myWallet);

  async function handleBid() {
    setLoading(true);
    try { await placeAuctionBid(gameId, myWallet, bid); } catch {} finally { setLoading(false); }
  }

  async function handlePass() {
    setLoading(true);
    try { await passAuction(gameId, myWallet); } catch {} finally { setLoading(false); }
  }

  return (
    <div style={{ background: "#0D1F23", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Gavel size={16} style={{ color: "#38BDF8" }} />
        <span style={{ fontWeight: 700, color: "#38BDF8", fontSize: 14 }}>AUCTION IN PROGRESS</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{space.name}</div>
      <div style={{ color: "#77918B", fontSize: 12, marginBottom: 16 }}>Round {auction.round} · {auction.participants.length - auction.passedPlayers.length} remaining</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16, background: "#071013", borderRadius: 10, padding: 12, fontSize: 13 }}>
        <div><div style={{ color: "#77918B", fontSize: 11 }}>Highest Bid</div><div style={{ fontWeight: 700, color: "#38BDF8" }}>{formatBalance(auction.highestBid)}</div></div>
        <div><div style={{ color: "#77918B", fontSize: 11 }}>Leader</div><div style={{ fontWeight: 700 }}>{auction.highestBidder ? nameOf(auction.highestBidder, 3) : "None"}</div></div>
      </div>
      {!hasPassed && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="number" value={bid} min={auction.highestBid + 1} max={myBalance} onChange={(e) => setBid(Number(e.target.value))} style={{ flex: 1, background: "#071013", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 8, padding: "8px 12px", color: "#F6FAF9", fontSize: 14, outline: "none" }} />
          <Button variant="info" onClick={handleBid} loading={loading} disabled={bid <= auction.highestBid || bid > myBalance}>Bid</Button>
          <Button variant="ghost" onClick={handlePass} loading={loading}>Pass</Button>
        </div>
      )}
      {hasPassed && <div style={{ color: "#77918B", fontSize: 13, textAlign: "center" }}>You passed this auction</div>}
    </div>
  );
}
