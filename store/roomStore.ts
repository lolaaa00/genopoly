import { create } from "zustand";
import type { Room, RoomPlayer, ChatMessage } from "@/types";

interface RoomStore {
  room: Room | null;
  players: RoomPlayer[];
  messages: ChatMessage[];
  presenceList: string[];

  setRoom: (room: Room | null) => void;
  setPlayers: (players: RoomPlayer[]) => void;
  addMessage: (msg: ChatMessage) => void;
  setPresence: (wallets: string[]) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  players: [],
  messages: [],
  presenceList: [],

  setRoom: (room) => set({ room }),
  setPlayers: (players) => set({ players }),
  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages.slice(-99), msg] })),
  setPresence: (wallets) => set({ presenceList: wallets }),
}));
