"use client";

import { useEffect, useState } from "react";
import {
  createWallet,
  unlock,
  exportPrivateKey,
  wipe,
  hasVault,
  changePassword,
} from "@/lib/wallet/embedded";
import { truncateAddress } from "@/lib/utils";

type Mode = "create" | "unlock" | "export" | "change" | "import" | "wiped";

export default function EmbeddedWalletModal({
  open,
  initialMode = "create",
  onClose,
  onUnlocked,
}: {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
  onUnlocked?: (address: `0x${string}`) => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [importKey, setImportKey] = useState("");
  const [exported, setExported] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setPassword("");
    setConfirm("");
    setImportKey("");
    setExported(null);
    setErr(null);
    setCopied(false);
    // If they opened "create" but a vault already exists, switch to unlock
    if (initialMode === "create") {
      hasVault().then((exists) => {
        if (exists) setMode("unlock");
      });
    }
  }, [open, initialMode]);

  if (!open) return null;

  async function handleSubmit() {
    setErr(null);
    setLoading(true);
    try {
      if (mode === "create") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (password !== confirm) throw new Error("Passwords don't match");
        const { address } = await createWallet(password);
        onUnlocked?.(address);
        setMode("export");
        setExported(exportPrivateKey());
      } else if (mode === "import") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (password !== confirm) throw new Error("Passwords don't match");
        if (!/^0x?[0-9a-fA-F]{64}$|^[0-9a-fA-F]{64}$/.test(importKey.trim())) {
          throw new Error("Private key must be 64 hex characters (optionally 0x-prefixed)");
        }
        const { address } = await createWallet(password, importKey.trim());
        onUnlocked?.(address);
        onClose();
      } else if (mode === "unlock") {
        const { address } = await unlock(password);
        onUnlocked?.(address);
        onClose();
      } else if (mode === "change") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (password !== confirm) throw new Error("Passwords don't match");
        await changePassword(password);
        onClose();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleWipe() {
    if (!window.confirm("Wipe your embedded wallet? This permanently deletes the encrypted key from this browser. Export your private key first or you'll lose access.")) return;
    setLoading(true);
    try {
      await wipe();
      setMode("wiped");
      setPassword("");
      setConfirm("");
    } finally {
      setLoading(false);
    }
  }

  function copyKey() {
    if (!exported) return;
    navigator.clipboard.writeText(exported);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const title =
    mode === "create" ? "Create a Genopoly wallet"
    : mode === "import" ? "Import private key"
    : mode === "unlock" ? "Unlock your wallet"
    : mode === "export" ? "Backup your private key"
    : mode === "change" ? "Change password"
    : "Wallet wiped";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,16,19,0.8)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(460px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0D1F23",
          border: "1px solid rgba(179,199,195,0.22)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{title}</h2>

        {mode === "create" && (
          <>
            <p style={{ color: "#77918B", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              We&apos;ll generate a private key, encrypt it with your password using AES-256-GCM,
              and store the ciphertext in this browser&apos;s IndexedDB. The unlocked key only lives
              in memory while you&apos;re playing.
            </p>
            <PasswordFields {...{ password, setPassword, confirm, setConfirm }} />
            <FooterErr err={err} />
            <Buttons
              primaryLabel={loading ? "Creating..." : "Create wallet"}
              onPrimary={handleSubmit}
              primaryDisabled={loading || password.length < 6 || password !== confirm}
              onSecondary={() => setMode("import")}
              secondaryLabel="Import existing key"
              onClose={onClose}
            />
          </>
        )}

        {mode === "import" && (
          <>
            <p style={{ color: "#77918B", fontSize: 13, marginBottom: 12 }}>
              Paste an existing 64-char hex private key. It will be encrypted with your password.
            </p>
            <textarea
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              placeholder="0x... (or just 64 hex chars)"
              rows={3}
              style={inputStyle}
            />
            <div style={{ height: 12 }} />
            <PasswordFields {...{ password, setPassword, confirm, setConfirm }} />
            <FooterErr err={err} />
            <Buttons
              primaryLabel={loading ? "Importing..." : "Import"}
              onPrimary={handleSubmit}
              primaryDisabled={loading || !importKey.trim() || password.length < 6 || password !== confirm}
              onSecondary={() => setMode("create")}
              secondaryLabel="Generate new instead"
              onClose={onClose}
            />
          </>
        )}

        {mode === "unlock" && (
          <>
            <p style={{ color: "#77918B", fontSize: 13, marginBottom: 16 }}>
              Enter your password to unlock the wallet for this session.
            </p>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && password && !loading) handleSubmit(); }}
              placeholder="Password"
              style={inputStyle}
            />
            <FooterErr err={err} />
            <Buttons
              primaryLabel={loading ? "Unlocking..." : "Unlock"}
              onPrimary={handleSubmit}
              primaryDisabled={loading || !password}
              onSecondary={handleWipe}
              secondaryLabel="Forgot password? Wipe"
              secondaryDanger
              onClose={onClose}
            />
          </>
        )}

        {mode === "export" && exported && (
          <>
            <p style={{ color: "#FBBF24", fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              ⚠️ Copy this private key and store it somewhere safe (password manager, paper).
              This is the ONLY way to recover your wallet if you clear your browser data.
              Anyone with this key controls the wallet.
            </p>
            <div
              style={{
                ...inputStyle,
                fontFamily: "monospace",
                fontSize: 12,
                background: "#071013",
                wordBreak: "break-all",
                padding: 12,
                minHeight: 70,
              }}
            >
              {exported}
            </div>
            <FooterErr err={err} />
            <Buttons
              primaryLabel={copied ? "Copied!" : "Copy & continue"}
              onPrimary={async () => {
                copyKey();
                setTimeout(onClose, 400);
              }}
              primaryDisabled={false}
              onClose={onClose}
            />
          </>
        )}

        {mode === "change" && (
          <>
            <p style={{ color: "#77918B", fontSize: 13, marginBottom: 16 }}>
              Choose a new password. Your private key will be re-encrypted.
            </p>
            <PasswordFields {...{ password, setPassword, confirm, setConfirm }} />
            <FooterErr err={err} />
            <Buttons
              primaryLabel={loading ? "Updating..." : "Update password"}
              onPrimary={handleSubmit}
              primaryDisabled={loading || password.length < 6 || password !== confirm}
              onClose={onClose}
            />
          </>
        )}

        {mode === "wiped" && (
          <>
            <p style={{ color: "#B3C7C3", fontSize: 14, marginBottom: 16 }}>
              The encrypted wallet was deleted from this browser.
            </p>
            <Buttons
              primaryLabel="Create a new wallet"
              onPrimary={() => setMode("create")}
              primaryDisabled={false}
              onClose={onClose}
            />
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#071013",
  border: "1px solid rgba(179,199,195,0.22)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#F6FAF9",
  fontSize: 14,
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
};

function PasswordFields({
  password, setPassword, confirm, setConfirm,
}: {
  password: string;
  setPassword: (s: string) => void;
  confirm: string;
  setConfirm: (s: string) => void;
}) {
  return (
    <>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (min 6 chars)"
        style={inputStyle}
      />
      <div style={{ height: 8 }} />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm password"
        style={inputStyle}
      />
    </>
  );
}

function FooterErr({ err }: { err: string | null }) {
  if (!err) return null;
  return (
    <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", borderRadius: 10, fontSize: 13 }}>
      {err}
    </div>
  );
}

function Buttons({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  onSecondary,
  secondaryLabel,
  secondaryDanger,
  onClose,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled: boolean;
  onSecondary?: () => void;
  secondaryLabel?: string;
  secondaryDanger?: boolean;
  onClose: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18, flexWrap: "wrap" }}>
      {onSecondary && secondaryLabel && (
        <button
          onClick={onSecondary}
          style={{
            background: "transparent",
            border: `1px solid ${secondaryDanger ? "rgba(239,68,68,0.5)" : "rgba(179,199,195,0.22)"}`,
            color: secondaryDanger ? "#FCA5A5" : "#B3C7C3",
            padding: "10px 16px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {secondaryLabel}
        </button>
      )}
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "1px solid rgba(179,199,195,0.22)",
          color: "#B3C7C3",
          padding: "10px 16px",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Close
      </button>
      <button
        onClick={onPrimary}
        disabled={primaryDisabled}
        style={{
          background: "#D98236",
          border: "none",
          color: "#071013",
          padding: "10px 20px",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 13,
          cursor: primaryDisabled ? "not-allowed" : "pointer",
          opacity: primaryDisabled ? 0.5 : 1,
        }}
      >
        {primaryLabel}
      </button>
    </div>
  );
}

// Reusable mini-pill (not used elsewhere yet but handy)
export function AddressPill({ address }: { address: `0x${string}` | string }) {
  return <span style={{ fontFamily: "monospace", fontSize: 12 }}>{truncateAddress(address)}</span>;
}
