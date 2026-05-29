import { create } from "zustand";
import type { GameState, ChatMessage, RoomPlayer } from "@/types";

interface GameStore {
  gameState: GameState | null;
  roomPlayers: RoomPlayer[];
  chatMessages: ChatMessage[];
  isMyTurn: boolean;
  myWallet: string | null;
  proofData: Record<string, unknown> | null;

  setGameState: (state: GameState | null) => void;
  setRoomPlayers: (players: RoomPlayer[]) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setMyWallet: (wallet: string) => void;
  setProofData: (data: Record<string, unknown> | null) => void;
  updateIsMyTurn: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  roomPlayers: [],
  chatMessages: [],
  isMyTurn: false,
  myWallet: null,
  proofData: null,

  setGameState: (state) => {
    set({ gameState: state });
    get().updateIsMyTurn();
  },
  setRoomPlayers: (players) => set({ roomPlayers: players }),
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages.slice(-99), msg] })),
  setMyWallet: (wallet) => {
    set({ myWallet: wallet });
    get().updateIsMyTurn();
  },
  setProofData: (data) => set({ proofData: data }),
  updateIsMyTurn: () => {
    const { gameState, myWallet } = get();
    if (!gameState || !myWallet) { set({ isMyTurn: false }); return; }
    const current = gameState.players[gameState.currentPlayerIndex];
    set({ isMyTurn: current?.wallet?.toLowerCase() === myWallet.toLowerCase() });
  },
}));
