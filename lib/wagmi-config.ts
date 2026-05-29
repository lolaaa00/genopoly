"use client";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1);
const rpcUrl = process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000/api";

const targetChain = chainId === 11155111 ? sepolia : mainnet;

export const wagmiConfig = createConfig({
  chains: [targetChain],
  connectors: [injected()],
  transports: {
    [targetChain.id]: http(rpcUrl),
  } as Record<typeof targetChain.id, ReturnType<typeof http>>,
  ssr: true,
});
