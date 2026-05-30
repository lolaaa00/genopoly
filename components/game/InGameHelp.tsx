"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, X } from "lucide-react";

const STEPS = [
  { title: "Connect & Join", body: "Connect an injected wallet. Create a room or join one. Each player starts with G1,500." },
  { title: "Roll Dice", body: "On your turn, click Roll Dice. The GenLayer contract — not the frontend — generates the dice." },
  { title: "Move & Land", body: "You move that many spaces. Pass or land on Start: collect G200." },
  { title: "Buy or Auction", body: "Land on an unowned property: Buy it at price, or Decline to send it to auction." },
  { title: "Pay Rent", body: "Landing on owned property triggers rent. Whole-district owners earn double base rent; upgrades scale higher." },
  { title: "Upgrade Districts", body: "Once you own every property in a district, pay to upgrade (levels 1–5). Each level multiplies rent." },
  { title: "Mortgage / Trade", body: "Need cash? Mortgage unupgraded property or trade with others. Trades are signed by both sides on-chain." },
  { title: "Lockup", body: "3 doubles, the Go-To-Lockup space, or an event card sends you there. Roll doubles, pay G50, or use a Release card to leave." },
  { title: "Win or Go Bust", body: "If you owe more than you can pay, you can mortgage, trade, or declare bankruptcy. Last player standing wins." },
  { title: "Proof", body: "Every action is a real transaction. Check the Proof panel for tx hashes — GenLayer is the source of truth." },
];

export default function InGameHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="How to play"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#D98236",
          color: "#071013",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(217,130,54,0.4)",
          zIndex: 80,
        }}
      >
        <HelpCircle size={22} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7,16,19,0.85)",
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
              width: "min(560px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#0D1F23",
              border: "1px solid rgba(179,199,195,0.22)",
              borderRadius: 16,
              padding: 22,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>How to Play Genopoly</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: "transparent", border: "none", color: "#B3C7C3", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "10px 12px",
                    background: "#132E35",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 28px",
                      height: 28,
                      borderRadius: "50%",
                      background: "#D98236",
                      color: "#071013",
                      fontWeight: 800,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#F6FAF9", marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "#B3C7C3", lineHeight: 1.5 }}>{s.body}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link
                href="/how-to-play"
                style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                onClick={() => setOpen(false)}
              >
                Read the full rulebook →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
