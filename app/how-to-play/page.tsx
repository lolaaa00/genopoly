import Link from "next/link";

export const metadata = {
  title: "How to Play — Genopoly",
  description: "Learn how to play Genopoly: rules, dice, properties, auctions, trades, rent, and how GenLayer verifies every move.",
};

const sections = [
  {
    title: "1. The Goal",
    body: "Be the last solvent player. Buy property, collect rent, build districts, and bankrupt your opponents — or out-trade them. Every action is signed by your wallet and validated by the GenLayer Intelligent Contract.",
  },
  {
    title: "2. Setup",
    body: "Connect an injected wallet (MetaMask, Rabby, Brave, etc.). Create or join a room with 2–4 players. Each player starts with G1,500. The room creator clicks Start when everyone has joined.",
  },
  {
    title: "3. Your Turn",
    body: "Click Roll Dice. The contract — not the frontend — generates two dice (1–6 each). You move that many spaces around the 40-space board. Pass or land on Start: collect G200.",
  },
  {
    title: "4. Doubles",
    body: "Roll doubles (matching dice)? You get an extra turn. Three doubles in a row sends you to Lockup.",
  },
  {
    title: "5. Buying Property",
    body: "Land on an unowned property, transit station, or utility — you may Buy it at the listed price, or Decline to send it to auction where every active player can bid.",
  },
  {
    title: "6. Rent",
    body: "Landing on a property owned by another player triggers rent, automatically calculated by the contract:\n• Properties: base rent, doubled if the owner holds the whole district, then scaled by upgrade level (0–5).\n• Transit: G25 × number of transits owned.\n• Utilities: dice roll × 4 (one utility) or × 10 (both).\n• Mortgaged property collects no rent.",
  },
  {
    title: "7. Upgrades (1 → 5)",
    body: "Once you own every property in a district, you can pay to upgrade. Each level multiplies rent — Level 5 (Landmark) is the most expensive but most lucrative. Mortgaged properties cannot be upgraded.",
  },
  {
    title: "8. Mortgages",
    body: "Need cash? Mortgage a property (no upgrades on it) for its mortgage value. Unmortgage later for 110% of that. Mortgaged property collects no rent.",
  },
  {
    title: "9. Trades",
    body: "Open the Trade modal, pick a player, and offer/request any combination of cash and properties. Both sides accept on-chain. The contract enforces ownership and balance.",
  },
  {
    title: "10. Lockup",
    body: "If you go to Lockup (Go-To-Lockup space, three doubles, or an event card), you skip movement until you: roll doubles, pay G50, or use a Release card. After 3 missed turns the fee is forced.",
  },
  {
    title: "11. Events",
    body: "City Event and Market Event spaces deal a card — gain or lose cash, move spaces, get a Release card, or worse. The contract resolves the effect.",
  },
  {
    title: "12. Bankruptcy & Winning",
    body: "If you owe more than you can pay, you can mortgage / trade to raise cash, or declare bankruptcy and forfeit everything. Last active player standing wins, the contract finalizes stats, and the leaderboard updates.",
  },
  {
    title: "13. Proof",
    body: "Every dice roll, rent payment, auction, trade, upgrade, mortgage, bankruptcy and winner is a real transaction. Check the Proof Panel in-game for tx hashes — GenLayer is the source of truth. Supabase only mirrors state for speed.",
  },
];

export default function HowToPlayPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", padding: "48px 24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>How to Play Genopoly</h1>
          <p style={{ color: "#B3C7C3", fontSize: 16 }}>Build your empire. Prove every move.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((s) => (
            <section
              key={s.title}
              style={{
                background: "#0D1F23",
                border: "1px solid rgba(179,199,195,0.18)",
                borderRadius: 14,
                padding: 22,
              }}
            >
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, color: "#D98236" }}>
                {s.title}
              </h2>
              <p style={{ color: "#B3C7C3", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-line" }}>
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/create"
            style={{
              background: "#D98236",
              color: "#071013",
              padding: "12px 22px",
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Create a Game
          </Link>
          <Link
            href="/lobby"
            style={{
              background: "transparent",
              border: "1px solid #2DD4BF",
              color: "#2DD4BF",
              padding: "12px 22px",
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Browse Open Rooms
          </Link>
        </div>

        <p style={{ marginTop: 32, textAlign: "center", color: "#77918B", fontSize: 12 }}>
          GenLayer is the official referee. Supabase only mirrors state for speed.
        </p>
      </div>
    </div>
  );
}
