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
 */
export async function getGenLayerClient() {
  const provider = getEthereumProvider();
  // Recreate the client if we now have a provider but the cached one didn't
  if (glClient && (!provider || glClientHasProvider)) return glClient;
  try {
    const { createClient } = await import("genlayer-js");
    const rpcUrl = process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000/api";
    const config: Record<string, unknown> = { endpoint: rpcUrl };
    if (provider) {
      config.provider = provider;
      glClientHasProvider = true;
    }
    glClient = createClient(config as Parameters<typeof createClient>[0]);
  } catch (e) {
    console.warn("GenLayer client unavailable:", e);
    glClient = null;
  }
  return glClient;
}

export function getContractAddress(): `0x${string}` {
  const addr = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS || "";
  return addr as `0x${string}`;
}
