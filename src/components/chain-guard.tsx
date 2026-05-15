"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ogGalileo } from "@/lib/wagmi";

const OG_GALILEO_HEX = "0x40da"; // 16602

async function switchTo0GGalileo() {
  const eth = (window as unknown as { ethereum?: { request: (a: unknown) => Promise<unknown> } }).ethereum;
  if (!eth) return;

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: OG_GALILEO_HEX }],
    });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: OG_GALILEO_HEX,
          chainName: "0G-Galileo-Testnet",
          nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
          rpcUrls: [process.env.NEXT_PUBLIC_0G_RPC_URL ?? "https://evmrpc-testnet.0g.ai"],
          blockExplorerUrls: [process.env.NEXT_PUBLIC_0G_EXPLORER_URL ?? "https://chainscan-galileo.0g.ai"],
        }],
      });
    }
  }
}

export function ChainGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, chain: connectedChain } = useAccount();
  const [switching, setSwitching] = useState(false);

  // chain is undefined when wallet is on a chain not in wagmi config
  const isWrongChain = isConnected && connectedChain?.id !== ogGalileo.id;

  const handle = async () => {
    setSwitching(true);
    try {
      await switchTo0GGalileo();
    } finally {
      setSwitching(false);
    }
  };

  return (
    <>
      {children}
      {isWrongChain && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/80 backdrop-blur-md">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-warning/30 bg-card p-8 text-center shadow-2xl">
            <div className="mb-4 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-2xl">⚠</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-text-1">Wrong Network</h2>
            <p className="mb-6 text-sm text-text-2">
              Kavro Protocol demo runs on{" "}
              <span className="font-medium text-warning">0G Galileo Testnet</span>.
              Please switch your wallet to continue.
            </p>
            <button
              onClick={handle}
              disabled={switching}
              className="w-full rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning transition-all hover:bg-warning/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {switching ? "Switching..." : "Switch to 0G Galileo"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
