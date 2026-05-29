"use client";

let glClient: unknown = null;

export async function getGenLayerClient() {
  if (glClient) return glClient;
  try {
    const { createClient } = await import("genlayer-js");
    const rpcUrl = process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000/api";
    glClient = createClient({ endpoint: rpcUrl } as Parameters<typeof createClient>[0]);
  } catch {
    console.warn("GenLayer client unavailable, using mock mode");
    glClient = null;
  }
  return glClient;
}

export function getContractAddress(): string {
  return process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS || "";
}
