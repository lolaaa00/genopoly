"use client";

import { getSessionAccount, subscribeWallet } from "@/lib/wallet/embedded";

type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

let glClient: unknown = null;
let glClientSignature = "";

function getEthereumProvider(): EthProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { ethereum?: EthProvider };
  return w.ethereum ?? null;
}

// Invalidate the cached client whenever the embedded wallet locks/unlocks.
if (typeof window !== "undefined") {
  subscribeWallet(() => {
    glClient = null;
    glClientSignature = "";
  });
}

/**
 * Returns a GenLayer client wired for either:
 *  - the unlocked embedded wallet (privateKeyToAccount), or
 *  - the injected browser wallet (window.ethereum).
 * Falls back to a read-only client when no signer is available.
 */
export async function getGenLayerClient() {
  const embedded = getSessionAccount();
  const provider = embedded ? null : getEthereumProvider();

  const signature = embedded
    ? `embedded:${embedded.address.toLowerCase()}`
    : provider
    ? "external"
    : "readonly";

  if (glClient && glClientSignature === signature) return glClient;

  try {
    const [glMod, chainsMod, viemAccountsMod] = await Promise.all([
      import("genlayer-js"),
      import("genlayer-js/chains"),
      import("viem/accounts"),
    ]);
    const createClient = (glMod as unknown as { createClient: (config: unknown) => unknown }).createClient;
    const studionet = (chainsMod as unknown as { studionet: unknown }).studionet;
    const { privateKeyToAccount } = viemAccountsMod;

    const proxyUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/rpc`
        : process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api";

    if (!studionet || typeof studionet !== "object") {
      throw new Error("genlayer-js/chains did not export studionet");
    }
    const s = studionet as { rpcUrls?: { default?: { http?: string[] } } };
    const chain = {
      ...studionet,
      rpcUrls: {
        ...(s.rpcUrls ?? {}),
        default: { http: [proxyUrl] },
      },
    };

    const config: Record<string, unknown> = { chain };
    if (embedded) {
      config.account = privateKeyToAccount(embedded.privateKey);
    } else if (provider) {
      config.provider = provider;
    }

    glClient = createClient(config);
    glClientSignature = signature;
  } catch (e) {
    console.warn("GenLayer client unavailable:", e);
    glClient = null;
    glClientSignature = "";
  }
  return glClient;
}

export function getContractAddress(): `0x${string}` {
  const addr = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS;
  if (!addr || !addr.startsWith("0x") || addr.length !== 42) {
    throw new Error(
      "NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS is not configured. Set it in Vercel → Settings → Environment Variables and redeploy."
    );
  }
  return addr as `0x${string}`;
}

export function isEmbeddedSession(): boolean {
  return getSessionAccount() !== null;
}
