"use client";

type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

let glClient: unknown = null;
let glClientHasProvider = false;

function getEthereumProvider(): EthProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { ethereum?: EthProvider };
  return w.ethereum ?? null;
}

/**
 * Returns a GenLayer client. If a browser wallet provider is available,
 * it is wired in so write transactions can be signed.
 *
 * IMPORTANT: pass `chain: studionet` (not bare `endpoint`) so viem sees
 * chainId 61999. Without this, writeContract trips
 * "chainId should be same as current chainId" against the connected wallet.
 */
export async function getGenLayerClient() {
  const provider = getEthereumProvider();
  if (glClient && (!provider || glClientHasProvider)) return glClient;
  try {
    const mod = await import("genlayer-js");
    const { createClient, studionet } = mod as unknown as {
      createClient: (config: unknown) => unknown;
      studionet: unknown;
    };

    // Route viem reads through our /api/rpc proxy to dodge CORS in the browser.
    // The proxy then forwards to GENLAYER_RPC_UPSTREAM server-side. When SSR'd
    // (window === undefined), fall back to the absolute upstream URL.
    const proxyUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/rpc`
        : process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api";

    let chain: unknown = studionet;
    if (typeof studionet === "object" && studionet !== null) {
      const s = studionet as { rpcUrls?: { default?: { http?: string[] } } };
      chain = {
        ...studionet,
        rpcUrls: {
          ...(s.rpcUrls ?? {}),
          default: { http: [proxyUrl] },
        },
      };
    }

    const config: Record<string, unknown> = { chain };
    if (provider) {
      config.provider = provider;
      glClientHasProvider = true;
    }
    glClient = createClient(config);
  } catch (e) {
    console.warn("GenLayer client unavailable:", e);
    glClient = null;
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
