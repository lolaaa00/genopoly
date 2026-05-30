"use client";
import { useState, useRef, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";
import { generateId } from "@/lib/utils";
import { Send } from "lucide-react";
import type { ChatMessage } from "@/types";
import { useUsernames } from "@/hooks/useUsernames";

interface Props { roomId: string; myWallet: string; }

export default function ChatPanel({ roomId, myWallet }: Props) {
  const { chatMessages, addChatMessage } = useGameStore();
  const nameOf = useUsernames(chatMessages.map((m) => m.wallet));
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const channel = supabase.channel(`chat:${roomId}`)
      .on("broadcast", { event: "chat" }, ({ payload }) => addChatMessage(payload as ChatMessage))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId, addChatMessage]);

  async function send() {
    if (!input.trim() || !myWallet) return;
    const msg: ChatMessage = { id: generateId(), roomId, wallet: myWallet, message: input.trim(), createdAt: new Date().toISOString() };
    const supabase = getSupabaseClient();
    await supabase.channel(`chat:${roomId}`).send({ type: "broadcast", event: "chat", payload: msg });
    addChatMessage(msg);
    setInput("");
  }

  return (
    <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 14, display: "flex", flexDirection: "column", height: 300 }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(179,199,195,0.1)", fontSize: 12, fontWeight: 700, color: "#77918B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Chat</div>
      <div style={{ flex: 1, overflow: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {chatMessages.map((m) => (
          <div key={m.id} style={{ fontSize: 12 }}>
            <span style={{ color: "#D98236", fontWeight: 600, marginRight: 6 }}>{nameOf(m.wallet, 3)}</span>
            <span style={{ color: "#B3C7C3" }}>{m.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 10, borderTop: "1px solid rgba(179,199,195,0.1)", display: "flex", gap: 6 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Message..." style={{ flex: 1, background: "#071013", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 7, padding: "7px 10px", color: "#F6FAF9", fontSize: 12, outline: "none" }} />
        <button onClick={send} style={{ background: "#D98236", border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: "#071013", display: "flex" }}><Send size={12} /></button>
      </div>
    </div>
  );
}
