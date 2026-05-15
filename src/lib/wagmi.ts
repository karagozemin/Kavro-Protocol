import { createConfig, http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const rpcUrl =
  process.env.NEXT_PUBLIC_0G_RPC_URL ?? "https://evmrpc-testnet.0g.ai";
const activeChainId = Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID ?? 16602);
const activeExplorer = process.env.NEXT_PUBLIC_0G_EXPLORER_URL ?? "https://chainscan-galileo.0g.ai";

export const active0GChain = {
  id: activeChainId,
  name: activeChainId === 16661 ? "0G-Mainnet" : "0G-Galileo-Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] }
  },
  blockExplorers: {
    default: {
      name: activeChainId === 16661 ? "0G ChainScan" : "0G ChainScan Galileo",
      url: activeExplorer
    }
  },
  testnet: activeChainId !== 16661
} as const;

export const ogGalileo = active0GChain;

export const wagmiConfig = createConfig({
  chains: [active0GChain, arbitrumSepolia],
  connectors: [injected({ target: "metaMask" })],
  multiInjectedProviderDiscovery: false,
  transports: {
    [active0GChain.id]: http(rpcUrl),
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_LEGACY_ARB_RPC_URL ?? "https://sepolia-rollup.arbitrum.io/rpc")
  }
});
