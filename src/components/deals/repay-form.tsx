"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { keccak256, toBytes } from "viem";
import { TxLink } from "@/components/tx/tx-link";

export function RepayForm({ dealId, isIssuer }: { dealId: number; isIssuer: boolean }) {
  const [repaymentMemo, setRepaymentMemo] = useState("");
  const [repaymentCommitment, setRepaymentCommitment] = useState<`0x${string}` | "">("");
  const publicClient = usePublicClient();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  const generate = () => {
    setRepaymentCommitment(keccak256(toBytes(repaymentMemo || `kavro-repayment-${dealId}-${Date.now()}`)));
  };

  const handleRepay = async () => {
    if (!repaymentCommitment) return;
    const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "recordRepayment",
      args: [BigInt(dealId), repaymentCommitment],
      ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Private Repayment Memo</Label>
          <Input value={repaymentMemo} onChange={(event) => setRepaymentMemo(event.target.value)} placeholder="Settlement details stay private" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Repayment Commitment</Label>
            <button type="button" onClick={generate} className="text-xs text-text-3 hover:text-gold">
              Generate
            </button>
          </div>
          <Input value={repaymentCommitment} onChange={(event) => setRepaymentCommitment(event.target.value as `0x${string}`)} placeholder="0x..." />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleRepay} disabled={isPending || !isIssuer || !repaymentCommitment}>
          {isPending ? "Recording" : "Record Repayment"}
        </Button>
        {confirming ? <span className="text-xs text-text-2">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      <div className="text-xs text-text-2">
        The repayment event stores a commitment. Detailed settlement data belongs in encrypted 0G Storage.
      </div>
      {!isIssuer ? <div className="text-xs text-amber-300">Switch to the issuer wallet to record repayment.</div> : null}
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
