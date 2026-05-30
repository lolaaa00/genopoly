"use client";

import { getGenLayerClient, getContractAddress, isEmbeddedSession } from "./client";
import { ensureCorrectChain } from "./chain";

async function callView(method: string, args: unknown[] = []): Promise<unknown> {
  const client = await getGenLayerClient();
  if (!client) return null;
  try {
    const c = client as { readContract: (opts: unknown) => Promise<unknown> };
    const result = await c.readContract({
      address: getContractAddress(),
      functionName: method,
      args,
    });
    return result;
  } catch (e) {
    console.error(`GenLayer view ${method} error:`, e);
    return null;
  }
}

async function callWrite(method: string, sender: string, args: unknown[] = []): Promise<{ hash?: string; result?: unknown; error?: string }> {
  const client = await getGenLayerClient();
  if (!client) return { error: "GenLayer client unavailable — is your wallet connected?" };
  // Embedded wallets sign directly with viem — no chain switch needed.
  // External wallets must be on chain 61999, so prompt a switch.
  if (!isEmbeddedSession()) {
    try {
      await ensureCorrectChain();
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
  try {
    const c = client as {
      writeContract: (opts: unknown) => Promise<unknown>;
      waitForTransactionReceipt?: (opts: { hash: string }) => Promise<unknown>;
    };
    // Embedded session: the client already has a LocalAccount attached via config.account,
    // so don't override here. External session: provide a json-rpc Account so viem can sign.
    const writeOpts: Record<string, unknown> = {
      address: getContractAddress(),
      functionName: method,
      args,
      value: BigInt(0),
    };
    if (!isEmbeddedSession()) {
      writeOpts.account = { address: sender as `0x${string}`, type: "json-rpc" as const };
    }
    const writeResult = await c.writeContract(writeOpts);
    const hash =
      typeof writeResult === "string"
        ? writeResult
        : (writeResult as { hash?: string } | null)?.hash;
    let result: unknown = writeResult;
    if (hash && c.waitForTransactionReceipt) {
      try {
        const receipt = await c.waitForTransactionReceipt({ hash });
        const r = receipt as { result?: unknown; returnValue?: unknown };
        result = r.result ?? r.returnValue ?? receipt;
      } catch { /* fall back to writeResult */ }
    }
    return { hash, result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`GenLayer write ${method} error:`, e);
    return { error: msg };
  }
}

// View functions
export const getGame = (gameId: string) => callView("get_game", [gameId]);
export const getGameStatus = (gameId: string) => callView("get_status", [gameId]);
export const getBoard = (gameId: string) => callView("get_board", [gameId]);
export const getPlayers = (gameId: string) => callView("get_players", [gameId]);
export const getCurrentPlayer = (gameId: string) => callView("get_current_player", [gameId]);
export const getPlayerState = (gameId: string, wallet: string) => callView("get_player_state", [gameId, wallet]);
export const getPropertyState = (gameId: string, spaceId: number) => callView("get_property_state", [gameId, spaceId]);
export const getPendingAction = (gameId: string) => callView("get_pending_action", [gameId]);
export const getAuction = (gameId: string) => callView("get_auction", [gameId]);
export const getTradeOffers = (gameId: string) => callView("get_trade_offers", [gameId]);
export const getMoveHistory = (gameId: string) => callView("get_move_history", [gameId]);
export const getDiceHistory = (gameId: string) => callView("get_dice_history", [gameId]);
export const getEventHistory = (gameId: string) => callView("get_event_history", [gameId]);
export const getWinner = (gameId: string) => callView("get_winner", [gameId]);
export const getPlayerStats = (wallet: string) => callView("get_player_stats", [wallet]);
export const getLeaderboard = () => callView("get_leaderboard", []);
export const getRecentGames = () => callView("get_recent_games", []);
export const getOpenGames = () => callView("get_open_games", []);
export const getTotalGames = () => callView("get_total_games", []);

// Write functions
export const createGame = (sender: string, maxPlayers: number) => callWrite("create_game", sender, [maxPlayers]);
export const joinGame = (gameId: string, sender: string) => callWrite("join_game", sender, [gameId]);
export const startGame = (gameId: string, sender: string) => callWrite("start_game", sender, [gameId]);
export const rollDice = (gameId: string, sender: string) => callWrite("roll_dice", sender, [gameId]);
export const buyProperty = (gameId: string, sender: string) => callWrite("buy_property", sender, [gameId]);
export const declineBuyProperty = (gameId: string, sender: string) => callWrite("decline_buy_property", sender, [gameId]);
export const placeAuctionBid = (gameId: string, sender: string, amount: number) => callWrite("place_auction_bid", sender, [gameId, amount]);
export const passAuction = (gameId: string, sender: string) => callWrite("pass_auction", sender, [gameId]);
export const resolveAuction = (gameId: string, sender: string) => callWrite("resolve_auction", sender, [gameId]);
export const upgradeProperty = (gameId: string, sender: string, spaceId: number) => callWrite("upgrade_property", sender, [gameId, spaceId]);
export const mortgageProperty = (gameId: string, sender: string, spaceId: number) => callWrite("mortgage_property", sender, [gameId, spaceId]);
export const unmortgageProperty = (gameId: string, sender: string, spaceId: number) => callWrite("unmortgage_property", sender, [gameId, spaceId]);
export const createTradeOffer = (gameId: string, sender: string, toPlayer: string, offeredCash: number, requestedCash: number, offeredProperties: number[], requestedProperties: number[]) =>
  callWrite("create_trade_offer", sender, [gameId, toPlayer, offeredCash, requestedCash, offeredProperties, requestedProperties]);
export const acceptTradeOffer = (gameId: string, sender: string, tradeId: string) => callWrite("accept_trade_offer", sender, [gameId, tradeId]);
export const cancelTradeOffer = (gameId: string, sender: string, tradeId: string) => callWrite("cancel_trade_offer", sender, [gameId, tradeId]);
export const payLockupRelease = (gameId: string, sender: string) => callWrite("pay_lockup_release", sender, [gameId]);
export const useReleaseCard = (gameId: string, sender: string) => callWrite("use_release_card", sender, [gameId]);
export const declareBankruptcy = (gameId: string, sender: string) => callWrite("declare_bankruptcy", sender, [gameId]);
export const raiseDispute = (gameId: string, sender: string, reason: string) => callWrite("raise_dispute", sender, [gameId, reason]);
export const endTurn = (gameId: string, sender: string) => callWrite("end_turn", sender, [gameId]);
export const resignGame = (gameId: string, sender: string) => callWrite("resign_game", sender, [gameId]);
export const endGame = (gameId: string, sender: string) => callWrite("end_game", sender, [gameId]);
