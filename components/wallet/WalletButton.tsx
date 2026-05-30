"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { truncateAddress } from "@/lib/utils";
import { Wallet, ChevronDown, LogOut, Copy, Pencil } from "lucide-react";
import UsernameModal from "@/components/wallet/UsernameModal";
import { fetchMyUsername, useUsernames } from "@/hooks/useUsernames";

export default function WalletButton() {
  const { address, isConnected, isConnecting, connectWallet, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  // Pull this wallet's username (re-renders when it changes via setMyUsername)
  const resolve = useUsernames(address ? [address] : []);
  const displayLabel = address ? resolve(address) : "";

  // On first connect, if there's no username yet, prompt to set one
  useEffect(() => {
    if (!address) return;
    fetchMyUsername(address).then((n) => {
      if (!n) setEditing(true);
    });
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (isConnecting) {
    return (
      <button disabled style={{ background: "#D98236", color: "#071013", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, opacity: 0.7, cursor: "not-allowed" }}>
        Connecting...
      </button>
    );
  }

  if (!isConnected || !address) {
    return (
      <button
        onClick={connectWallet}
        style={{ background: "linear-gradient(135deg,#D98236,#A85C20)", color: "#071013", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14, transition: "opacity 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <Wallet size={16} />
        Connect Wallet
      </button>
    );
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "#132E35", color: "#F6FAF9", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
          {displayLabel || truncateAddress(address)}
          <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {open && (
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#1B3A41", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 10, padding: 8, minWidth: 220, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "8px 12px", fontSize: 12, color: "#B3C7C3", borderBottom: "1px solid rgba(179,199,195,0.1)", marginBottom: 4, wordBreak: "break-all" }}>
              <div style={{ fontWeight: 600, color: "#F6FAF9", marginBottom: 2 }}>
                {displayLabel || truncateAddress(address)}
              </div>
              <div style={{ fontSize: 11, color: "#77918B" }}>{address}</div>
            </div>
            <button onClick={() => { setEditing(true); setOpen(false); }} style={{ width: "100%", background: "none", border: "none", color: "#F6FAF9", padding: "8px 12px", textAlign: "left", cursor: "pointer", borderRadius: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#244B52")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <Pencil size={14} /> Edit display name
            </button>
            <button onClick={copyAddress} style={{ width: "100%", background: "none", border: "none", color: "#F6FAF9", padding: "8px 12px", textAlign: "left", cursor: "pointer", borderRadius: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#244B52")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <Copy size={14} /> {copied ? "Copied!" : "Copy Address"}
            </button>
            <button onClick={() => { disconnect(); setOpen(false); }} style={{ width: "100%", background: "none", border: "none", color: "#EF4444", padding: "8px 12px", textAlign: "left", cursor: "pointer", borderRadius: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#244B52")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <LogOut size={14} /> Disconnect
            </button>
          </div>
        )}
      </div>
      <UsernameModal wallet={address} open={editing} onClose={() => setEditing(false)} />
    </>
  );
}
