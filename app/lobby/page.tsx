"use client";
import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import WalletButton from "@/components/wallet/WalletButton";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { joinGame, startGame } from "@/lib/genlayer/contract";
import { getSupabaseClient } from "@/lib/supabase/client";
import { truncateAddress, generateId } from "@/lib/utils";
import { Users, Copy, Check, Send, Play, RefreshCw } from "lucide-react";
import type { Room, RoomPlayer, ChatMessage } from "@/types";
import { useUsernames } from "@/hooks/useUsernames";

function LobbyInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get("room");
  const { address, isConnected } = useWallet();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [openRooms, setOpenRooms] = useState<Room[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId);
    } else {
      fetchOpenRooms();
    }
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;
    const supabase = getSupabaseClient();
    const channel = supabase.channel(`room:${roomId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` }, () => fetchRoom(roomId))
      .on("broadcast", { event: "chat" }, ({ payload }) => {
        setMessages((prev) => [...prev, payload as ChatMessage]);
      })
      .on("broadcast", { event: "game_started" }, ({ payload }) => {
        const p = payload as { genlayerGameId?: string };
        if (p?.genlayerGameId) router.push(`/game/${p.genlayerGameId}`);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId, router]);

  async function fetchRoom(id: string) {
    try {
      const res = await fetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json() as { room: Room; players: RoomPlayer[] };
        setRoom(data.room);
        setPlayers(data.players);
      }
    } catch {}
  }

  async function fetchOpenRooms() {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json() as { rooms: Room[] };
        setOpenRooms(data.rooms);
      }
    } catch {}
  }

  async function handleJoin() {
    if (!address || !room) return;
    setLoading(true);
    setErrMsg(null);
    try {
      const result = await joinGame(room.genlayerGameId, address);
      if (result?.error) {
        setErrMsg(result.error);
        return;
      }
      await fetch(`/api/rooms/${room.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    if (!address || !room) return;
    setLoading(true);
    setErrMsg(null);
    try {
      const result = await startGame(room.genlayerGameId, address);
      if (result?.error) {
        setErrMsg(result.error);
        return;
      }
      // Tell other players in the lobby to follow us into the game
      const supabase = getSupabaseClient();
      await supabase.channel(`room:${roomId}`).send({
        type: "broadcast",
        event: "game_started",
        payload: { genlayerGameId: room.genlayerGameId },
      });
      router.push(`/game/${room.genlayerGameId}`);
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!chatInput.trim() || !roomId || !address) return;
    const msg: ChatMessage = { id: generateId(), roomId, wallet: address, message: chatInput.trim(), createdAt: new Date().toISOString() };
    const supabase = getSupabaseClient();
    await supabase.channel(`room:${roomId}`).send({ type: "broadcast", event: "chat", payload: msg });
    setMessages((prev) => [...prev, msg]);
    setChatInput("");
  }

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/lobby?room=${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isCreator = room?.creatorWallet?.toLowerCase() === address?.toLowerCase();
  const isJoined = players.some((p) => p.wallet?.toLowerCase() === address?.toLowerCase());
  const nameOf = useUsernames([
    ...players.map((p) => p.wallet),
    ...messages.map((m) => m.wallet),
    ...openRooms.map((r) => r.creatorWallet),
  ]);

  if (!roomId) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", padding: 32 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Open Games</h1>
              <p style={{ color: "#B3C7C3", fontSize: 14 }}>Join an open room or create your own</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="secondary" size="sm" onClick={fetchOpenRooms}><RefreshCw size={14} /></Button>
              <Button variant="primary" size="sm" onClick={() => router.push("/create")}>+ Create Room</Button>
            </div>
          </div>
          {openRooms.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#77918B" }}>
              <Users size={40} style={{ marginBottom: 16, opacity: 0.4 }} />
              <p>No open rooms right now</p>
              <Button variant="primary" onClick={() => router.push("/create")} style={{ marginTop: 16 }}>Create the first game</Button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {openRooms.map((r) => (
                <div key={r.id} style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{nameOf(r.creatorWallet)}&apos;s Room</div>
                    <div style={{ fontSize: 13, color: "#77918B" }}>{r.playerCount}/{r.maxPlayers} players · {r.isPublic ? "Public" : "Private"}</div>
                  </div>
                  <Button variant="emerald" size="sm" onClick={() => router.push(`/lobby?room=${r.id}`)}>Join</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", padding: 24 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Left */}
        <div>
          <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Game Lobby</h1>
                <p style={{ fontSize: 13, color: "#77918B" }}>Room {roomId?.slice(0, 8)}</p>
              </div>
              <Badge variant={room?.status === "waiting" ? "warning" : "success"}>{room?.status ?? "..."}</Badge>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#77918B", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Players ({players.length}/{room?.maxPlayers ?? "?"})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {players.map((p, i) => (
                  <div key={p.wallet} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#132E35", borderRadius: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: ["#D98236","#2DD4BF","#FBBF24","#A78BFA"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#071013" }}>{i + 1}</div>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{nameOf(p.wallet)}</span>
                    {p.wallet?.toLowerCase() === room?.creatorWallet?.toLowerCase() && <Badge variant="copper">Host</Badge>}
                    <Badge variant={p.isReady ? "success" : "default"}>{p.isReady ? "Ready" : "Waiting"}</Badge>
                  </div>
                ))}
                {room && Array.from({ length: room.maxPlayers - players.length }).map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(19,46,53,0.4)", borderRadius: 10, border: "1px dashed rgba(179,199,195,0.12)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(179,199,195,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={12} style={{ color: "#77918B" }} /></div>
                    <span style={{ color: "#77918B", fontSize: 14 }}>Waiting for player...</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!isConnected && <WalletButton />}
              {isConnected && !isJoined && <Button variant="emerald" onClick={handleJoin} loading={loading}>Join Game</Button>}
              {isConnected && isCreator && players.length >= 2 && (
                <Button variant="primary" onClick={handleStart} loading={loading}><Play size={14} /> Start Game</Button>
              )}
              <Button variant="secondary" onClick={copyInvite} size="sm">
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy Invite
              </Button>
            </div>
            {errMsg && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", borderRadius: 10, fontSize: 13, lineHeight: 1.5 }}>
                {errMsg}
              </div>
            )}
          </div>
        </div>

        {/* Chat */}
        <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 14, display: "flex", flexDirection: "column", height: 500 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(179,199,195,0.1)", fontWeight: 700, fontSize: 14 }}>Chat</div>
          <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ fontSize: 13 }}>
                <span style={{ color: "#D98236", fontWeight: 600, marginRight: 6 }}>{nameOf(m.wallet, 3)}</span>
                <span style={{ color: "#B3C7C3" }}>{m.message}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: 12, borderTop: "1px solid rgba(179,199,195,0.1)", display: "flex", gap: 8 }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} placeholder="Message..." style={{ flex: 1, background: "#071013", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 8, padding: "8px 12px", color: "#F6FAF9", fontSize: 13, outline: "none" }} />
            <button onClick={sendMessage} style={{ background: "#D98236", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "#071013" }}><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div style={{ background: "#071013", minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#77918B" }}>Loading lobby...</div>}>
      <LobbyInner />
    </Suspense>
  );
}
