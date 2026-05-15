import { createConfig, http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const rpcUrl =
  process.env.NEXT_PUBLIC_0G_RPC_URL ?? "https://evmrpc-testnet.0g.ai";

export const ogGalileo = {
  id: 16602,
  name: "0G-Galileo-Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] }
  },
  blockExplorers: {
    default: {
      name: "0G ChainScan Galileo",
      url: process.env.NEXT_PUBLIC_0G_EXPLORER_URL ?? "https://chainscan-galileo.0g.ai"
    }
  },
  testnet: true
} as const;

export const wagmiConfig = createConfig({
  chains: [ogGalileo, arbitrumSepolia],
  connectors: [injected({ target: "metaMask" })],
  multiInjectedProviderDiscovery: false,
  transports: {
    [ogGalileo.id]: http(rpcUrl),
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_LEGACY_ARB_RPC_URL ?? "https://sepolia-rollup.arbitrum.io/rpc")
  }
});
