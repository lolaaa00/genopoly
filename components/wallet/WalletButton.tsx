"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { truncateAddress } from "@/lib/utils";
import {
  Wallet,
  ChevronDown,
  LogOut,
  Copy,
  Pencil,
  Key,
  Lock,
  Settings,
} from "lucide-react";
import EmbeddedWalletModal from "@/components/wallet/EmbeddedWalletModal";
import UsernameModal from "@/components/wallet/UsernameModal";
import { fetchMyUsername, useUsernames } from "@/hooks/useUsernames";

type EmbeddedModalMode = "create" | "unlock" | "export" | "change" | "import";

export default function WalletButton() {
  const wallet = useWallet();
  const {
    mode,
    setMode,
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    embeddedExists,
    embeddedUnlocked,
    embeddedHydrated,
  } = wallet;

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [walletModalMode, setWalletModalMode] = useState<EmbeddedModalMode | null>(null);

  const resolve = useUsernames(address ? [address] : []);
  const displayLabel = address ? resolve(address) : "";

  // Prompt for a username once an embedded wallet is unlocked and has no name yet
  useEffect(() => {
    if (!address) return;
    fetchMyUsername(address).then((n) => {
      if (!n) setEditingName(true);
    });
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // External-mode UI (existing injected flow)
  if (mode === "external") {
    if (isConnecting) {
      return (
        <button disabled style={btnConnecting}>Connecting...</button>
      );
    }
    if (!isConnected || !address) {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={connectWallet} style={btnPrimary}>
            <Wallet size={16} /> Connect Wallet
          </button>
          <button
            onClick={() => setMode("embedded")}
            title="Use embedded Genopoly wallet"
            style={btnGhostSm}
          >
            <Key size={14} /> Embedded
          </button>
        </div>
      );
    }
    return (
      <>
        <WalletPill
          label={displayLabel || truncateAddress(address)}
          address={address}
          open={open}
          setOpen={setOpen}
          copied={copied}
          copyAddress={copyAddress}
          onEditName={() => { setEditingName(true); setOpen(false); }}
          onDisconnect={() => { disconnect(); setOpen(false); }}
          extras={
            <DropdownItem onClick={() => { setMode("embedded"); setOpen(false); }} icon={<Key size={14} />}>
              Switch to embedded wallet
            </DropdownItem>
          }
        />
        <UsernameModal wallet={address} open={editingName} onClose={() => setEditingName(false)} />
      </>
    );
  }

  // Embedded-mode UI
  if (!embeddedHydrated) {
    return <button disabled style={btnConnecting}>Loading...</button>;
  }

  if (!embeddedExists) {
    return (
      <>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setWalletModalMode("create")} style={btnPrimary}>
            <Wallet size={16} /> Create Wallet
          </button>
          <button
            onClick={() => setMode("external")}
            title="Use injected browser wallet"
            style={btnGhostSm}
          >
            <Settings size={14} /> External
          </button>
        </div>
        <EmbeddedWalletModal
          open={walletModalMode !== null}
          initialMode={walletModalMode ?? "create"}
          onClose={() => setWalletModalMode(null)}
          onUnlocked={() => {}}
        />
      </>
    );
  }

  if (!embeddedUnlocked) {
    return (
      <>
        <button onClick={() => setWalletModalMode("unlock")} style={btnPrimary}>
          <Lock size={16} /> Unlock Wallet
        </button>
        <EmbeddedWalletModal
          open={walletModalMode !== null}
          initialMode={walletModalMode ?? "unlock"}
          onClose={() => setWalletModalMode(null)}
        />
      </>
    );
  }

  // Unlocked
  return (
    <>
      <WalletPill
        label={displayLabel || truncateAddress(address!)}
        address={address!}
        open={open}
        setOpen={setOpen}
        copied={copied}
        copyAddress={copyAddress}
        onEditName={() => { setEditingName(true); setOpen(false); }}
        onDisconnect={() => { disconnect(); setOpen(false); }}
        extras={
          <>
            <DropdownItem onClick={() => { setWalletModalMode("export"); setOpen(false); }} icon={<Key size={14} />}>
              Export private key
            </DropdownItem>
            <DropdownItem onClick={() => { setWalletModalMode("change"); setOpen(false); }} icon={<Settings size={14} />}>
              Change password
            </DropdownItem>
            <DropdownItem onClick={() => { setMode("external"); setOpen(false); }} icon={<Wallet size={14} />}>
              Switch to external wallet
            </DropdownItem>
          </>
        }
        disconnectLabel="Lock wallet"
        disconnectIcon={<Lock size={14} />}
      />
      <UsernameModal wallet={address!} open={editingName} onClose={() => setEditingName(false)} />
      <EmbeddedWalletModal
        open={walletModalMode !== null}
        initialMode={walletModalMode ?? "export"}
        onClose={() => setWalletModalMode(null)}
      />
    </>
  );
}

// --- shared UI ---

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#D98236,#A85C20)",
  color: "#071013",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
};

const btnGhostSm: React.CSSProperties = {
  background: "transparent",
  color: "#B3C7C3",
  border: "1px solid rgba(179,199,195,0.18)",
  borderRadius: 8,
  padding: "6px 10px",
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
};

const btnConnecting: React.CSSProperties = {
  background: "#D98236",
  color: "#071013",
  border: "none",
  borderRadius: 8,
  padding: "8px 20px",
  fontWeight: 600,
  opacity: 0.7,
  cursor: "not-allowed",
};

function WalletPill({
  label, address, open, setOpen, copied, copyAddress, onEditName, onDisconnect, extras, disconnectLabel = "Disconnect", disconnectIcon,
}: {
  label: string;
  address: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  copied: boolean;
  copyAddress: () => void;
  onEditName: () => void;
  onDisconnect: () => void;
  extras?: React.ReactNode;
  disconnectLabel?: string;
  disconnectIcon?: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: "#132E35", color: "#F6FAF9", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
        {label}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#1B3A41", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 10, padding: 8, minWidth: 240, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          <div style={{ padding: "8px 12px", fontSize: 12, color: "#B3C7C3", borderBottom: "1px solid rgba(179,199,195,0.1)", marginBottom: 4, wordBreak: "break-all" }}>
            <div style={{ fontWeight: 600, color: "#F6FAF9", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#77918B" }}>{address}</div>
          </div>
          <DropdownItem onClick={onEditName} icon={<Pencil size={14} />}>Edit display name</DropdownItem>
          <DropdownItem onClick={copyAddress} icon={<Copy size={14} />}>{copied ? "Copied!" : "Copy address"}</DropdownItem>
          {extras}
          <DropdownItem onClick={onDisconnect} icon={disconnectIcon ?? <LogOut size={14} />} danger>
            {disconnectLabel}
          </DropdownItem>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ onClick, icon, children, danger }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ width: "100%", background: "none", border: "none", color: danger ? "#EF4444" : "#F6FAF9", padding: "8px 12px", textAlign: "left", cursor: "pointer", borderRadius: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#244B52")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {icon}
      {children}
    </button>
  );
}
