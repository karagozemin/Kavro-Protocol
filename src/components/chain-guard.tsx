"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { BrandLogo } from "@/components/brand-logo";
import { active0GChain } from "@/lib/wagmi";

const ACTIVE_0G_CHAIN_HEX = `0x${active0GChain.id.toString(16)}`;

async function switchToActive0GChain() {
  const eth = (window as unknown as { ethereum?: { request: (a: unknown) => Promise<unknown> } }).ethereum;
  if (!eth) return;

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ACTIVE_0G_CHAIN_HEX }],
    });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: ACTIVE_0G_CHAIN_HEX,
          chainName: active0GChain.name,
          nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
          rpcUrls: [...active0GChain.rpcUrls.default.http],
          blockExplorerUrls: [active0GChain.blockExplorers.default.url],
        }],
      });
    }
  }
}

export function ChainGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isConnected, chain: connectedChain } = useAccount();
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // chain is undefined when wallet is on a chain not in wagmi config
  const isWrongChain = mounted && isConnected && connectedChain?.id !== active0GChain.id;

  const handle = async () => {
    setSwitching(true);
    try {
      await switchToActive0GChain();
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
              <BrandLogo size="lg" className="border-warning/35" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-text-1">Wrong Network</h2>
            <p className="mb-6 text-sm text-text-2">
              Kavro Protocol demo runs on{" "}
              <span className="font-medium text-warning">{active0GChain.name}</span>.
              Please switch your wallet to continue.
            </p>
            <button
              onClick={handle}
              disabled={switching}
              className="w-full rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning transition-all hover:bg-warning/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {switching ? "Switching..." : `Switch to ${active0GChain.name}`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
