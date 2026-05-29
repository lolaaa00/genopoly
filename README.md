# Genopoly

**Build your empire. Prove every move.**

Genopoly is a GenLayer-refereed property trading board game where every dice roll, rent payment, auction, trade, upgrade, mortgage, bankruptcy, and winner settlement is verified through an Intelligent Contract.

## Architecture

| Layer | Purpose |
|-------|---------|
| **GenLayer** | Official referee — all game logic, dice, rent, auctions, trades decided on-chain |
| **Supabase** | Realtime relay — rooms, chat, presence, cached state, profiles, leaderboard |
| **Next.js 16** | Frontend — UI, wallet connection, state display |

## Quick Start

### 1. Clone & install

```bash
git clone <repo>
cd genopoly
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_APP_NAME=Genopoly
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=<your deployed contract address>
NEXT_PUBLIC_GENLAYER_RPC_URL=<GenLayer Studionet RPC URL>
NEXT_PUBLIC_CHAIN_ID=<chain ID>
NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your Supabase anon key>
SUPABASE_SERVICE_ROLE_KEY=<your Supabase service role key>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<optional>
```

### 3. Deploy Supabase schema

```bash
# Run the migration in your Supabase project
# Dashboard → SQL Editor → paste contents of supabase/migrations/001_initial_schema.sql
```

### 4. Deploy GenLayer contract

```bash
# Using GenLayer Studionet:
# 1. Open GenLayer Studio
# 2. Upload contracts/genlayer/genopoly_property_game.py
# 3. Deploy to Studionet
# 4. Copy contract address to NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS
```

### 5. Run locally

```bash
npm run dev
```

## Gameplay

- **2-4 players** connect wallets and join a room
- **Creator** starts the game when all players are ready
- **Current player** clicks Roll — dice are generated inside the GenLayer contract
- **Land on property** → choose to buy or start auction
- **Own a district** → collect double rent, build upgrades
- **Transit/Utility** → rent scales with how many you own
- **Event cards** → Market Events and City Events triggered on-chain
- **Lockup** → pay G50, use a release card, or roll doubles to escape
- **Bankruptcy** → declare when debt can't be resolved
- **Winner** → last active player remaining

## Game Board

40 spaces across 8 property districts, 4 transit stations, 2 utilities, 2 tax spaces, 4 event spaces, and 4 special corners.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand + TanStack Query
- wagmi + viem (injected wallets)
- GenLayer JS 1.1.7
- Supabase JS

## Known Limitations (MVP)

- Dice randomness uses deterministic pseudo-random based on game state — suitable for MVP, upgrade to VRF for production
- GenLayer contract requires deployment to Studionet before game actions work
- Supabase requires schema migration before room/lobby features work
- WalletConnect is optional — injected wallets (MetaMask, Rabby) are the primary connection method

## Next Manual Steps

1. Deploy Supabase schema via SQL Editor
2. Deploy GenLayer contract to Studionet
3. Update `.env.local` with contract address and RPC URL
4. Connect an injected wallet and create your first room
