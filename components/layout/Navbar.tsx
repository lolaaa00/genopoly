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
    <nav style={{ background: "#0D1F23", borderBottom: "1px solid rgba(179,199,195,0.12)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#D98236,#A85C20)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#071013", fontSize: 16 }}>G</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#F6FAF9", letterSpacing: "-0.5px" }}>Genopoly</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: pathname === href ? "#D98236" : "#B3C7C3", background: pathname === href ? "rgba(217,130,54,0.1)" : "transparent", transition: "all 0.2s" }}>
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
        <WalletButton />
      </div>
    </nav>
  );
}
