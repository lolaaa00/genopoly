<div align="center">

# 🎲 Genopoly

**Build your empire. Prove every move.**

A GenLayer-refereed property trading board game where every dice roll, rent payment, auction, trade, upgrade, mortgage, bankruptcy, and winner settlement is verified through an Intelligent Contract.

[🎮 **Play Now**](https://genopoly-w3la.vercel.app) · [📖 How to Play](https://genopoly-w3la.vercel.app/how-to-play) · [🏆 Leaderboard](https://genopoly-w3la.vercel.app/leaderboard)

</div>

---

## 🌐 Live deployment

| Resource | Link |
|---|---|
| **App** | https://genopoly-w3la.vercel.app |
| **Intelligent Contract** | [`0x710aB9a34fcFd248C1e5040284aEcCd1a97297Fa`](https://studio.genlayer.com/) |
| **Chain** | GenLayer Studionet (id `61999`) |
| **RPC** | `https://studio.genlayer.com/api` |
| **Source** | https://github.com/lolaaa00/genopoly |

---

## 🤖 GenLayer nondeterministic consensus

Genopoly uses GenLayer's **Equivalence Principle** in two product-critical paths — both shape the game's outcome:

### 1. AI-generated Event Cards

When a player lands on a `market_event` or `city_event` space, the contract builds a context payload (wallet, balance, position, properties owned, move number) and calls an LLM through `gl.nondet.exec_prompt(...)`. Validators independently run the LLM and converge on a single card via:

```python
gl.eq_principle_prompt_comparative(
    runner,
    "Both outputs propose a card with the same effect.type. "
    "Numeric amounts within 20%. Text wording may differ."
)
```

The card's mechanical effect (`gain` / `lose` / `advance` / `go_to_lockup` / `collect_from_all` / `pay_to_all` / `release_card`) is validated, clamped to safe ranges, and applied to player state on-chain. **Different validators consistently agree, and the consensus directly changes who wins.**

### 2. AI Referee for disputes

`resolve_dispute_ai(game_id, dispute_id)` lets any participant invoke an AI Referee. The contract assembles the dispute reason, the last 10 moves, the dispute snapshot of the dice roll and pending action, and asks an LLM to issue a ruling (`uphold` / `dismiss`) plus an optional refund. Resolved through the same Equivalence Principle. If upheld, the contract pays the refund on-chain.

### Deterministic fallback

If the LLM is unavailable or validators diverge irrecoverably, each path falls back to a hash-pseudo-random static card / dismiss-by-default ruling so games never deadlock.

### What stays deterministic

Dice, turn order, rent math, district bonuses, transit/utility scaling, mortgage values, auction resolution, and bankruptcy unwind remain pure deterministic Python — those are correctness-critical and must be byte-identical across validators.

---

## 🧱 Architecture

| Layer | Purpose |
|---|---|
| **GenLayer Intelligent Contract** | Official referee. Generates dice, validates turns, computes rent, runs auctions, processes trades, decides the winner. The frontend never decides game outcomes. |
| **Next.js 16 frontend** | UI, board rendering, animations, wallet UX. Reads contract state, surfaces actions, displays proofs. |
| **Supabase** | Realtime relay only — rooms, chat, presence, cached state, profiles, leaderboard. Mirrors contract state for fast UX; the contract is always the source of truth. |
| **Embedded wallet (optional)** | Browser-side wallet, AES-256-GCM encrypted in IndexedDB, unlocked with a password. Removes MetaMask-style popups during gameplay. |

```
┌──────────────────────┐         ┌─────────────────────────┐
│  Browser (Next.js)   │ ──────► │  GenLayer Studionet     │
│                      │  signed │  (Intelligent Contract) │
│  Wallet — embedded   │   tx    │  — generates dice       │
│       or injected    │ ◄────── │  — validates turns      │
│                      │  state  │  — settles outcomes     │
└──────────┬───────────┘         └─────────────────────────┘
           │ realtime
           ▼
┌──────────────────────┐
│  Supabase (Postgres) │
│  rooms, chat, cache  │
└──────────────────────┘
```

---

## ✨ Features

- **40-space board** — 8 districts (Ember, Jade, Coral, Harbor, Ivory, Neon, Obsidian, Crown), 4 transit stations, 2 utilities, taxes, lockup, market & city events
- **Contract-generated dice** — frontend never sends dice values; the Intelligent Contract rolls them deterministically from on-chain state
- **Buy / Auction** — decline a buy and every active player gets to bid
- **Districts, upgrades 0–5** — own a whole district, double base rent, then upgrade to landmarks
- **Trades, mortgages, lockup, bankruptcy** — all resolved on-chain
- **Embedded wallet** — create a Genopoly wallet protected by a password; no MetaMask popups every roll. Or use any injected wallet (MetaMask, Rabby, Brave, etc.)
- **Realtime lobby & chat** — Supabase channels for instant updates
- **Proof panel** — every important action shows the contract-verified state and (where available) the tx reference
- **Leaderboard & history** — wins, losses, bankruptcies, rent collected, auctions won — all sourced from the contract

---

## 🚀 Quick start (local dev)

### 1. Clone and install

```bash
git clone https://github.com/lolaaa00/genopoly.git
cd genopoly
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Genopoly
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=0x710aB9a34fcFd248C1e5040284aEcCd1a97297Fa
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_CHAIN_ID=61999
NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase publishable / anon key>
SUPABASE_SERVICE_ROLE_KEY=<your supabase service-role secret>
```

### 3. Set up Supabase

In your Supabase project's SQL editor, run the migration:

```bash
# the migration is at supabase/migrations/001_initial_schema.sql
# paste its contents into the SQL editor and run
```

Then enable RLS policies that allow the anonymous client to write profiles, rooms, room_players, and chat (see `supabase/migrations/` for the full policy set).

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

---

## 🎮 How to play (short version)

1. **Connect** an injected wallet, **or** create a Genopoly embedded wallet (one-time password).
2. **Create a room** (2–4 players) — the contract creates an on-chain game; the room is mirrored to Supabase.
3. **Share the invite link**; once everyone has joined, the host clicks **Start**.
4. **Roll** — the contract generates dice and moves your token.
5. **Buy / decline / auction / trade / mortgage / upgrade** — every action is a signed transaction to the contract.
6. **Bankrupt your opponents.** Last player standing wins.

Full rules: [genopoly-w3la.vercel.app/how-to-play](https://genopoly-w3la.vercel.app/how-to-play)

---

## 🧠 The Intelligent Contract

Source: [`contracts/genlayer/genopoly_property_game.py`](./contracts/genlayer/genopoly_property_game.py)

| Write functions | View functions |
|---|---|
| `create_game(max_players)` | `get_total_games` |
| `join_game(game_id)` | `get_game(game_id)` |
| `start_game(game_id)` | `get_status(game_id)` |
| `roll_dice(game_id)` | `get_board(game_id)` |
| `buy_property(game_id)` | `get_players(game_id)` |
| `decline_buy_property(game_id)` | `get_current_player(game_id)` |
| `place_auction_bid(game_id, amount)` | `get_player_state(game_id, wallet)` |
| `pass_auction(game_id)` | `get_property_state(game_id, space_id)` |
| `resolve_auction(game_id)` | `get_pending_action(game_id)` |
| `upgrade_property(game_id, space_id)` | `get_auction(game_id)` |
| `mortgage_property(game_id, space_id)` | `get_trade_offers(game_id)` |
| `unmortgage_property(game_id, space_id)` | `get_move_history(game_id)` |
| `create_trade_offer(...)` | `get_dice_history(game_id)` |
| `accept_trade_offer(game_id, trade_id)` | `get_event_history(game_id)` |
| `cancel_trade_offer(game_id, trade_id)` | `get_winner(game_id)` |
| `pay_lockup_release(game_id)` | `get_player_stats(wallet)` |
| `use_release_card(game_id)` | `get_leaderboard()` |
| `declare_bankruptcy(game_id)` | `get_recent_games()` |
| `resign_game(game_id)` | `get_open_games()` |
| `end_turn(game_id)` | |
| `cancel_game(game_id)` | |
| `raise_dispute(game_id, reason)` | |
| `resolve_dispute(game_id, dispute_id, decision)` | |

**Important:** the frontend never decides dice, rent, ownership, auction results, trade validity, bankruptcy, or winner. Those are all computed inside the contract.

---

## 🛠️ Tech stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript** — strict mode
- **Tailwind CSS v4**
- **GenLayer JS 1.1.7** — `studionet` chain
- **viem** — transaction signing
- **wagmi + RainbowKit** — wallet infrastructure
- **Supabase** — Postgres + realtime
- **TanStack Query** — server state
- **Zustand** — client state
- **Framer Motion** — animations
- **Lucide React** — icons

---

## 📁 Project structure

```
genopoly/
├── app/                       # Next.js routes
│   ├── page.tsx               # Landing
│   ├── create/                # Create room
│   ├── lobby/                 # Game lobby + open rooms
│   ├── game/[gameId]/         # Main game page
│   ├── leaderboard/           # Stats from contract
│   ├── history/               # Past games
│   ├── profile/[wallet]/      # Per-wallet stats
│   ├── how-to-play/           # Rules
│   ├── error.tsx              # Global error boundary
│   └── api/                   # REST endpoints (Supabase only)
├── components/
│   ├── board/                 # Board renderer, spaces, tokens
│   ├── game/                  # Dice, turn, sidebar, auction, trades, chat
│   ├── wallet/                # Embedded + injected wallet UI
│   ├── proof/                 # GenLayer proof panel
│   └── ui/                    # Buttons, badges, modals
├── contracts/genlayer/
│   └── genopoly_property_game.py
├── hooks/                     # useWallet, useGameState, useUsernames, realtime
├── lib/
│   ├── genlayer/              # GenLayer client + write/view wrappers
│   ├── supabase/              # Client + admin
│   ├── board.ts               # 40-space static data
│   └── constants.ts
├── store/                     # Zustand stores
├── supabase/migrations/       # 001_initial_schema.sql
└── types/                     # Shared TS types
```

---

## 🔐 Security notes

- **The contract is the source of truth.** Supabase mirrors state for UX speed only.
- **Embedded wallet** is AES-256-GCM encrypted with PBKDF2(600k iterations) before being stored in IndexedDB. The unlocked key sits in JS memory only while the tab is open.
- **Recommendation:** never import a wallet holding mainnet funds into any web app. Use the embedded wallet as a dedicated game key and fund it with a small testnet balance.
- **Supabase RLS** is open during MVP development. Production deployments should add wallet-signature-verified policies before opening to untrusted players.

---

## 🧪 Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # production server
npm run lint       # eslint
```

---

## 📦 Deploy

Pushes to `main` auto-deploy via Vercel.

Environment variables required on Vercel:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_GENLAYER_RPC_URL`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GENLAYER_RPC_UPSTREAM` *(optional — for the server-side RPC proxy)*

---

## 🗺️ Roadmap

- [ ] Animated dice and token movement
- [ ] Trade modal UI polish
- [ ] Property upgrade slider in the property detail panel
- [ ] Tournament rooms with entry fees
- [ ] Mainnet deployment when GenLayer mainnet launches
- [ ] Mobile-first board layout

---

## 📜 License

MIT — do whatever, just don't claim to be the original referee.

---

<div align="center">

Built for the **GenLayer Hackathon**.
**Genopoly** is an original property-trading game — not affiliated with any other tabletop brand.

</div>
