"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log so we can pull stacks from Vercel function logs / Sentry later
    console.error("Genopoly client error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: "#071013",
        color: "#F6FAF9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "#0D1F23",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Something broke</h2>
        <p style={{ color: "#B3C7C3", fontSize: 14, marginBottom: 18, lineHeight: 1.55 }}>
          An error crashed this page. The contract and your game state are safe —
          GenLayer is still the source of truth. Try reloading.
        </p>
        <details
          style={{
            background: "#071013",
            border: "1px solid rgba(179,199,195,0.18)",
            borderRadius: 10,
            padding: 12,
            textAlign: "left",
            marginBottom: 18,
            fontSize: 12,
            color: "#FCA5A5",
            wordBreak: "break-word",
          }}
        >
          <summary style={{ cursor: "pointer", color: "#B3C7C3", marginBottom: 6 }}>
            Show error details
          </summary>
          <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {error.message || String(error)}
            {error.digest ? `\n\n(digest: ${error.digest})` : ""}
          </div>
        </details>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "#D98236",
              color: "#071013",
              border: "none",
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              background: "transparent",
              border: "1px solid rgba(179,199,195,0.22)",
              color: "#B3C7C3",
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Back home
          </a>
        </div>
      </div>
    </div>
  );
}
