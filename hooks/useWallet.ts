"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEmbeddedWallet } from "@/hooks/useEmbeddedWallet";
import { lock as lockEmbedded } from "@/lib/wallet/embedded";
import { useEffect, useState } from "react";

const MODE_KEY = "genopoly:wallet_mode"; // "embedded" | "external"

type WalletMode = "embedded" | "external";

function readMode(): WalletMode {
  if (typeof window === "undefined") return "embedded";
  return (localStorage.getItem(MODE_KEY) as WalletMode) || "embedded";
}

export function useWallet() {
  const [mode, setModeState] = useState<WalletMode>("embedded");
  useEffect(() => {
    setModeState(readMode());
  }, []);
  const setMode = (m: WalletMode) => {
    setModeState(m);
    if (typeof window !== "undefined") localStorage.setItem(MODE_KEY, m);
  };

  // External (wagmi/injected)
  const { address: extAddr, isConnected: extConn, chain } = useAccount();
  const { connect, isPending: extConnecting } = useConnect();
  const { disconnect: extDisconnect } = useDisconnect();
  const connectExternal = () => connect({ connector: injected() });

  // Embedded
  const emb = useEmbeddedWallet();

  if (mode === "external") {
    return {
      mode,
      setMode,
      address: extAddr,
      isConnected: extConn,
      chain,
      isConnecting: extConnecting,
      connectWallet: connectExternal,
      disconnect: extDisconnect,
      // Embedded-specific (unused in this mode)
      embeddedExists: emb.exists,
      embeddedUnlocked: emb.unlocked,
      embeddedHydrated: emb.hydrated,
      lockEmbedded: () => {},
      refreshEmbedded: emb.refresh,
    };
  }

  // Embedded mode (default)
  return {
    mode,
    setMode,
    address: emb.address ?? undefined,
    isConnected: emb.unlocked,
    chain: undefined,
    isConnecting: false,
    connectWallet: () => {}, // UI opens the embedded modal directly
    disconnect: () => lockEmbedded(),
    embeddedExists: emb.exists,
    embeddedUnlocked: emb.unlocked,
    embeddedHydrated: emb.hydrated,
    lockEmbedded,
    refreshEmbedded: emb.refresh,
  };
}
