"use client";
import { useState } from "react";
import { buyProperty, declineBuyProperty } from "@/lib/genlayer/contract";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { BOARD_SPACES } from "@/lib/constants";
import { formatBalance } from "@/lib/utils";

interface Props { gameId: string; myWallet: string; spaceId: number; balance: number; onClose: () => void; }

export default function BuyOrAuctionModal({ gameId, myWallet, spaceId, balance, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const space = BOARD_SPACES[spaceId];

  async function handleBuy() {
    setLoading(true);
    try { await buyProperty(gameId, myWallet); onClose(); } catch { } finally { setLoading(false); }
  }

  async function handleAuction() {
    setLoading(true);
    try { await declineBuyProperty(gameId, myWallet); onClose(); } catch { } finally { setLoading(false); }
  }

  return (
    <Modal title="Buy or Auction" onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: (space as any).upgradeColor ?? "#D98236", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏘️</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{space.name}</h3>
        <div style={{ color: "#77918B", fontSize: 13, marginBottom: 24 }}>{space.district} District</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24, background: "#071013", borderRadius: 10, padding: 16 }}>
          <div><div style={{ color: "#77918B", fontSize: 12 }}>Price</div><div style={{ fontWeight: 700, fontSize: 18, color: "#D98236" }}>{formatBalance(space.price ?? 0)}</div></div>
          <div><div style={{ color: "#77918B", fontSize: 12 }}>Base Rent</div><div style={{ fontWeight: 700, fontSize: 18, color: "#2DD4BF" }}>{formatBalance(space.baseRent ?? 0)}</div></div>
          <div><div style={{ color: "#77918B", fontSize: 12 }}>Your Balance</div><div style={{ fontWeight: 700, fontSize: 16 }}>{formatBalance(balance)}</div></div>
          <div><div style={{ color: "#77918B", fontSize: 12 }}>After Buy</div><div style={{ fontWeight: 700, fontSize: 16, color: balance - (space.price ?? 0) < 0 ? "#EF4444" : "#22C55E" }}>{formatBalance(balance - (space.price ?? 0))}</div></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="primary" onClick={handleBuy} loading={loading} disabled={balance < (space.price ?? 0)} style={{ flex: 1, justifyContent: "center" }}>
            Buy {formatBalance(space.price ?? 0)}
          </Button>
          <Button variant="ghost" onClick={handleAuction} loading={loading} style={{ flex: 1, justifyContent: "center" }}>
            Start Auction
          </Button>
        </div>
      </div>
    </Modal>
  );
}
