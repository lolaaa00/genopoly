"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

// GenLayer Studionet defaults — overridable via env.
function targetChainIdDec(): number {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID;
  const n = raw ? parseInt(raw, 10) : 61999;
  return Number.isFinite(n) && n > 0 ? n : 61999;
}

function toHexChainId(dec: number): string {
  return "0x" + dec.toString(16);
}

const CHAIN_PARAMS = {
  chainId: toHexChainId(targetChainIdDec()),
  chainName: "GenLayer Studionet",
  nativeCurrency: { name: "Gen", symbol: "GEN", decimals: 18 },
  rpcUrls: [process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api"],
  blockExplorerUrls: ["https://studio.genlayer.com"],
};

function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  return (window as any).ethereum ?? null;
}

/**
 * Asks the user's wallet to switch to the GenLayer Studionet chain.
 * Adds the chain if it isn't configured in the wallet yet.
 * Throws a clear error message on failure.
 */
export async function ensureCorrectChain(): Promise<void> {
  const provider = getProvider();
  if (!provider?.request) {
    throw new Error("No browser wallet detected. Install MetaMask, Rabby, or another injected wallet.");
  }

  const targetHex = CHAIN_PARAMS.chainId;

  // Quick check — already on the right chain?
  try {
    const current = (await provider.request({ method: "eth_chainId" })) as string;
    if (current && current.toLowerCase() === targetHex.toLowerCase()) return;
  } catch {
    // Fall through to switch attempt
  }

  // Try to switch
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetHex }],
    });
    return;
  } catch (err: any) {
    // 4902 = chain not added to the wallet yet. Add it.
    const code = err?.code ?? err?.data?.originalError?.code;
    if (code === 4902 || code === -32603 || /Unrecognized chain/i.test(String(err?.message))) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [CHAIN_PARAMS],
        });
        return;
      } catch (addErr: any) {
        throw new Error(
          `Could not add the GenLayer chain to your wallet: ${addErr?.message ?? "rejected"}.`
        );
      }
    }
    if (code === 4001) {
      throw new Error("You declined the network switch. Approve it in your wallet to continue.");
    }
    throw new Error(
      `Could not switch to the GenLayer chain (id ${targetChainIdDec()}): ${err?.message ?? String(err)}.`
    );
  }
}
