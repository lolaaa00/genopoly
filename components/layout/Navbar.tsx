"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "@/components/wallet/WalletButton";
import { Trophy, History, Gamepad2, BookOpen } from "lucide-react";

const NAV_LINKS = [
  { href: "/lobby", label: "Lobby", icon: Gamepad2 },
  { href: "/how-to-play", label: "How to Play", icon: BookOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="genopoly-navbar" style={{ background: "#0D1F23", borderBottom: "1px solid rgba(179,199,195,0.12)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, padding: "0 16px", gap: 8 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#D98236,#A85C20)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#071013", fontSize: 16 }}>G</div>
          <span className="genopoly-brand" style={{ fontWeight: 800, fontSize: 19, color: "#F6FAF9", letterSpacing: "-0.5px" }}>Genopoly</span>
        </Link>
        <div className="genopoly-nav-links" style={{ display: "flex", alignItems: "center", gap: 2, overflowX: "auto", flexShrink: 1, minWidth: 0 }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: pathname === href ? "#D98236" : "#B3C7C3", background: pathname === href ? "rgba(217,130,54,0.1)" : "transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}>
              <Icon size={15} />
              <span className="genopoly-nav-label">{label}</span>
            </Link>
          ))}
        </div>
        <div style={{ flexShrink: 0 }}>
          <WalletButton />
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .genopoly-brand { display: none; }
          .genopoly-nav-label { display: none; }
        }
      `}</style>
    </nav>
  );
}
