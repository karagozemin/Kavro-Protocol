"use client";

import { useAccount, useBalance, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ogGalileo } from "@/lib/wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { TxLink } from "@/components/tx/tx-link";

export function ClaimButton({ dealId }: { dealId: number }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectChain = chainId === ogGalileo.id;
  const { data: nativeBalance } = useBalance({ address, query: { enabled: !!address } });
  const hasGas = (nativeBalance?.value ?? 0n) > 0n;
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });
  const disabled = !DEAL_ROOM_ADDRESS || !isConnected || !isCorrectChain || !hasGas;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() =>
            writeContract({
              address: DEAL_ROOM_ADDRESS as `0x${string}`,
              abi: dealRoomAbi,
              functionName: "claim",
              args: [BigInt(dealId)]
            })
          }
          disabled={disabled || isPending}
        >
          {isPending ? "Claiming" : "Request Claim"}
        </Button>
        {isLoading ? <span className="text-xs text-white/60">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      {!isConnected ? (
        <div className="text-xs text-amber-300">Connect wallet to claim.</div>
      ) : !isCorrectChain ? (
        <div className="text-xs text-amber-300">Switch to 0G Galileo to claim.</div>
      ) : !hasGas ? (
        <div className="text-xs text-amber-300">You need testnet 0G for gas.</div>
      ) : null}
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </>
  );
}
