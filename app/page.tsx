import Link from "next/link";
import { Shield, Zap, Trophy, Users, Dice1, BarChart3, Lock, Globe } from "lucide-react";

const FEATURES = [
  { icon: Shield, title: "On-Chain Referee", desc: "Every dice roll, rent, auction, and trade is validated by a GenLayer Intelligent Contract — not the frontend, not the server." },
  { icon: Zap, title: "Realtime Play", desc: "Supabase powers instant updates across all players. Board state, chat, and presence sync in milliseconds." },
  { icon: Dice1, title: "Verified Randomness", desc: "Dice are generated inside the contract using game history and player data. No client can manipulate outcomes." },
  { icon: Trophy, title: "Provable Winners", desc: "Win conditions, bankruptcies, and final balances are all decided on-chain. Challenge any result with a dispute." },
  { icon: Users, title: "2-4 Players", desc: "Play with friends or join a public room. Supports 2, 3, or 4 players per game." },
  { icon: BarChart3, title: "Live Leaderboard", desc: "Track wins, losses, rent collected, and fair-play score across all on-chain games." },
  { icon: Lock, title: "Non-Custodial", desc: "Connect with any injected wallet. Your keys stay in your wallet — Genopoly never holds funds." },
  { icon: Globe, title: "Open Rooms", desc: "Browse open games and join mid-lobby, or create a private room with an invite link." },
];

export default function HomePage() {
  return (
    <div style={{ background: "#071013", color: "#F6FAF9" }}>
      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217,130,54,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#2DD4BF", marginBottom: 28, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2DD4BF" }} />
            Powered by GenLayer Intelligent Contracts
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 20px", background: "linear-gradient(135deg,#F6FAF9 40%,#D98236)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Genopoly
          </h1>
          <p style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", color: "#B3C7C3", marginBottom: 12, fontWeight: 500 }}>
            Build your empire. Prove every move.
          </p>
          <p style={{ fontSize: 15, color: "#77918B", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Genopoly is a GenLayer-refereed property trading board game where every dice roll, rent payment, auction, trade, upgrade, mortgage, bankruptcy, and winner settlement is verified through an Intelligent Contract.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/create" style={{ background: "linear-gradient(135deg,#D98236,#A85C20)", color: "#071013", textDecoration: "none", padding: "13px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Create Room
            </Link>
            <Link href="/lobby" style={{ background: "#132E35", color: "#F6FAF9", textDecoration: "none", padding: "13px 32px", borderRadius: 10, fontWeight: 700, fontSize: 16, border: "1px solid rgba(179,199,195,0.18)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Browse Games
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: "1px solid rgba(179,199,195,0.08)", borderBottom: "1px solid rgba(179,199,195,0.08)", padding: "20px 24px", background: "#0D1F23" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {[["On-Chain Referee", "GenLayer"], ["Realtime Layer", "Supabase"], ["Game Spaces", "40"], ["Max Players", "4"]].map(([label, value]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#D98236" }}>{value}</div>
              <div style={{ fontSize: 12, color: "#77918B" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Two layers, one game</h2>
        <p style={{ textAlign: "center", color: "#B3C7C3", marginBottom: 48, fontSize: 15 }}>GenLayer decides. Supabase delivers.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          <div style={{ background: "#0D1F23", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⛓️</div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: "#2DD4BF" }}>GenLayer — The Referee</h3>
            <p style={{ color: "#B3C7C3", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              The Intelligent Contract stores official game state. Dice, rent, ownership, auctions, trades, bankruptcy, and winners are all decided and validated on-chain. The frontend can never manipulate game outcomes.
            </p>
          </div>
          <div style={{ background: "#0D1F23", border: "1px solid rgba(217,130,54,0.2)", borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: "#D98236" }}>Supabase — The Relay</h3>
            <p style={{ color: "#B3C7C3", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Supabase mirrors the verified GenLayer state for low-latency play. It handles rooms, chat, presence, cached board state, profiles, and the leaderboard — all in realtime.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 72px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.12)", borderRadius: 12, padding: 22, transition: "border-color 0.2s" }}>
              <Icon size={22} style={{ color: "#D98236", marginBottom: 12 }} />
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, margin: "0 0 8px" }}>{title}</h3>
              <p style={{ color: "#77918B", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(179,199,195,0.1)", padding: "28px 24px", textAlign: "center", color: "#77918B", fontSize: 13 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontWeight: 700, color: "#D98236" }}>Genopoly</span>
          <span>An original property trading game powered by GenLayer Intelligent Contracts</span>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/lobby" style={{ color: "#77918B", textDecoration: "none" }}>Lobby</Link>
            <Link href="/leaderboard" style={{ color: "#77918B", textDecoration: "none" }}>Leaderboard</Link>
            <Link href="/history" style={{ color: "#77918B", textDecoration: "none" }}>History</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
