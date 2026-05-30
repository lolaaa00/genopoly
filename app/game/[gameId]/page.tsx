"use client";
import { use, useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useGameState } from "@/hooks/useGameState";
import { useGameStore } from "@/store/gameStore";
import { getSupabaseClient } from "@/lib/supabase/client";
import GameBoard from "@/components/board/GameBoard";
import DicePanel from "@/components/game/DicePanel";
import TurnPanel from "@/components/game/TurnPanel";
import PlayerSidebar from "@/components/game/PlayerSidebar";
import AuctionPanel from "@/components/game/AuctionPanel";
import BuyOrAuctionModal from "@/components/game/BuyOrAuctionModal";
import MoveHistory from "@/components/game/MoveHistory";
import ProofPanel from "@/components/proof/ProofPanel";
import WinnerModal from "@/components/game/WinnerModal";
import ChatPanel from "@/components/game/ChatPanel";
import WalletButton from "@/components/wallet/WalletButton";
import InGameHelp from "@/components/game/InGameHelp";
import type { MoveHistoryItem } from "@/types";

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const { address, isConnected } = useWallet();
  const { gameState, setMyWallet } = useGameStore();
  const [moves, setMoves] = useState<MoveHistoryItem[]>([]);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const gameQuery = useGameState(gameId);

  useEffect(() => {
    if (address) setMyWallet(address);
  }, [address, setMyWallet]);

  useEffect(() => {
    if (!gameId) return;
    const supabase = getSupabaseClient();
    const channel = supabase.channel(`moves:${gameId}`)
      .on("broadcast", { event: "move" }, ({ payload }) => {
        setMoves((prev) => [...prev, payload as MoveHistoryItem]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [gameId]);

  useEffect(() => {
    if (!gameState || !address) return;
    const cp = gameState.players[gameState.currentPlayerIndex];
    if (cp?.wallet?.toLowerCase() === address.toLowerCase() && gameState.pendingAction === "buy_or_auction") {
      setShowBuyModal(true);
    } else {
      setShowBuyModal(false);
    }
  }, [gameState?.pendingAction, gameState?.currentPlayerIndex, address]);

  const myPlayer = gameState?.players.find((p) => p.wallet?.toLowerCase() === address?.toLowerCase());

  if (!isConnected) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <p style={{ color: "#B3C7C3" }}>Connect your wallet to play</p>
        <WalletButton />
      </div>
    );
  }

  if (!gameState) {
    // After the first fetch settles with no data, the game ID is invalid / not on-chain
    const isMissing = gameQuery.isFetched && !gameQuery.isFetching && !gameQuery.data;
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", background: "#071013", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#77918B", maxWidth: 420, padding: 24 }}>
          {isMissing ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ color: "#F6FAF9", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Game not found</div>
              <div style={{ fontSize: 14, color: "#B3C7C3", marginBottom: 20 }}>
                No on-chain game matches <code style={{ color: "#D98236" }}>{gameId}</code>. It may have been cancelled, or the link is stale.
              </div>
              <a href="/create" style={{ color: "#2DD4BF", fontWeight: 600, fontSize: 14 }}>← Create a new game</a>
            </>
          ) : (
            <>
              <div style={{ width: 32, height: 32, border: "3px solid #D98236", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              Loading game state from GenLayer...
            </>
          )}
        </div>
      </div>
    );
  }

  const pendingSpaceId = myPlayer?.position ?? 0;

  return (
    <div style={{ background: "#071013", minHeight: "calc(100vh - 60px)", padding: "16px 12px" }}>
      <div className="genopoly-game-grid" style={{ maxWidth: 1300, margin: "0 auto", gap: 14, alignItems: "start" }}>
        {/* Players + Turn */}
        <div className="genopoly-col-left" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TurnPanel gameState={gameState} myWallet={address ?? ""} />
          <PlayerSidebar gameState={gameState} myWallet={address ?? ""} />
        </div>

        {/* Board + Dice + History */}
        <div className="genopoly-col-center" style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", minWidth: 0 }}>
          <div style={{ width: "100%", maxWidth: 720, overflowX: "auto" }}>
            <GameBoard gameState={gameState} />
          </div>
          {address && <DicePanel gameId={gameId} myWallet={address} />}
          {gameState.auction?.active && address && myPlayer && (
            <AuctionPanel gameId={gameId} myWallet={address} auction={gameState.auction} myBalance={myPlayer.balance} />
          )}
          <div style={{ width: "100%", maxWidth: 720 }}>
            <MoveHistory moves={moves} />
          </div>
        </div>

        {/* Chat + Proof */}
        <div className="genopoly-col-right" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ProofPanel />
          {address && <ChatPanel roomId={gameId} myWallet={address} />}
        </div>
      </div>

      <InGameHelp />

      {/* Modals */}
      {showBuyModal && address && myPlayer && (
        <BuyOrAuctionModal
          gameId={gameId}
          myWallet={address}
          spaceId={pendingSpaceId}
          balance={myPlayer.balance}
          onClose={() => setShowBuyModal(false)}
        />
      )}
      {gameState.status === "completed" && address && (
        <WinnerModal gameState={gameState} myWallet={address} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .genopoly-game-grid {
          display: grid;
          grid-template-columns: 240px 1fr 280px;
        }
        @media (max-width: 1100px) {
          .genopoly-game-grid {
            grid-template-columns: 220px 1fr;
          }
          .genopoly-col-right {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 760px) {
          .genopoly-game-grid {
            grid-template-columns: 1fr;
          }
          .genopoly-col-left, .genopoly-col-right {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
}
