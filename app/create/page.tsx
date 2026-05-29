"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import WalletButton from "@/components/wallet/WalletButton";
import Button from "@/components/ui/Button";
import { createGame } from "@/lib/genlayer/contract";
import { generateId } from "@/lib/utils";
import { Users, Lock, Globe, ChevronRight } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      const gameId = generateId();
      await createGame(address, maxPlayers);

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genlayerGameId: gameId, creatorWallet: address, maxPlayers, isPublic }),
      });
      if (!res.ok) throw new Error("Failed to create room");
      const { roomId } = await res.json() as { roomId: string };
      router.push(`/lobby?room=${roomId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create game");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Create Room</h1>
          <p style={{ color: "#B3C7C3", fontSize: 15 }}>Set up your Genopoly game and invite players</p>
        </div>
        <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 16, padding: 32 }}>
          {!isConnected ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "#B3C7C3", marginBottom: 20 }}>Connect your wallet to create a room</p>
              <WalletButton />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#B3C7C3", display: "block", marginBottom: 12 }}>Max Players</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[2, 3, 4].map((n) => (
                    <button key={n} onClick={() => setMaxPlayers(n)} style={{ flex: 1, padding: "14px 0", borderRadius: 10, border: `2px solid ${maxPlayers === n ? "#D98236" : "rgba(179,199,195,0.18)"}`, background: maxPlayers === n ? "rgba(217,130,54,0.1)" : "#132E35", color: maxPlayers === n ? "#D98236" : "#B3C7C3", fontWeight: 700, fontSize: 20, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                      {n}
                      <Users size={14} style={{ opacity: 0.7 }} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#B3C7C3", display: "block", marginBottom: 12 }}>Room Visibility</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setIsPublic(true)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `2px solid ${isPublic ? "#2DD4BF" : "rgba(179,199,195,0.18)"}`, background: isPublic ? "rgba(45,212,191,0.08)" : "#132E35", color: isPublic ? "#2DD4BF" : "#B3C7C3", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}>
                    <Globe size={15} /> Public
                  </button>
                  <button onClick={() => setIsPublic(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `2px solid ${!isPublic ? "#D98236" : "rgba(179,199,195,0.18)"}`, background: !isPublic ? "rgba(217,130,54,0.08)" : "#132E35", color: !isPublic ? "#D98236" : "#B3C7C3", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}>
                    <Lock size={15} /> Private
                  </button>
                </div>
              </div>

              <div style={{ background: "#071013", borderRadius: 10, padding: 16, marginBottom: 24, fontSize: 13, color: "#77918B" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span>Starting Balance</span><span style={{ color: "#D98236", fontWeight: 600 }}>G1,500</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span>Board Spaces</span><span style={{ color: "#F6FAF9", fontWeight: 600 }}>40</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Referee</span><span style={{ color: "#2DD4BF", fontWeight: 600 }}>GenLayer Contract</span>
                </div>
              </div>

              {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#EF4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

              <Button variant="primary" size="lg" onClick={handleCreate} loading={loading} style={{ width: "100%", justifyContent: "center" }}>
                Create Game <ChevronRight size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
