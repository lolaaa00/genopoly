"use client";

import { useEffect, useState } from "react";
import { fetchMyUsername, setMyUsername } from "@/hooks/useUsernames";
import { truncateAddress } from "@/lib/utils";

export default function UsernameModal({
  wallet,
  open,
  onClose,
}: {
  wallet: string;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !wallet) return;
    setErr(null);
    fetchMyUsername(wallet).then((n) => setName(n));
  }, [open, wallet]);

  if (!open) return null;

  async function save() {
    setLoading(true);
    setErr(null);
    const { error } = await setMyUsername(wallet, name);
    setLoading(false);
    if (error) setErr(error);
    else onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,16,19,0.78)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(420px, 100%)",
          background: "#0D1F23",
          border: "1px solid rgba(179,199,195,0.22)",
          borderRadius: 16,
          padding: 28,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Choose a display name</h2>
        <p style={{ color: "#77918B", fontSize: 13, marginBottom: 20 }}>
          Other players will see this instead of {truncateAddress(wallet)}. Saved to your Genopoly profile.
        </p>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) save();
          }}
          placeholder="e.g. ironbanker"
          maxLength={24}
          style={{
            width: "100%",
            background: "#071013",
            border: "1px solid rgba(179,199,195,0.22)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "#F6FAF9",
            fontSize: 15,
            outline: "none",
            marginBottom: 8,
          }}
        />
        <div style={{ fontSize: 11, color: "#77918B", marginBottom: 16 }}>
          2–24 characters
        </div>

        {err && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#EF4444",
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: "transparent",
              border: "1px solid rgba(179,199,195,0.22)",
              color: "#B3C7C3",
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading || name.trim().length < 2}
            style={{
              background: "#D98236",
              border: "none",
              color: "#071013",
              padding: "10px 22px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              cursor: loading || name.trim().length < 2 ? "not-allowed" : "pointer",
              opacity: loading || name.trim().length < 2 ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
