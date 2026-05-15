"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxLink } from "@/components/tx/tx-link";

export function GrantAuditor({ dealId }: { dealId: number }) {
  const [auditor, setAuditor] = useState("");
  const [investor, setInvestor] = useState("");
  const [disclosureRef, setDisclosureRef] = useState("");
  const [storing, setStoring] = useState(false);
  const publicClient = usePublicClient();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const getFees = async () => {
    if (!publicClient) return {};
    const priorityFallback = parseUnits("0.1", 9);

    try {
      const fees = await publicClient.estimateFeesPerGas();
      const maxFee = fees.maxFeePerGas ?? fees.gasPrice;
      const maxPriority = fees.maxPriorityFeePerGas ?? priorityFallback;
      return {
        ...(maxFee ? { maxFeePerGas: maxFee } : {}),
        ...(maxPriority ? { maxPriorityFeePerGas: maxPriority } : {})
      };
    } catch {
      const gasPrice = await publicClient.getGasPrice().catch(() => undefined);
      const maxFee = gasPrice ? gasPrice * 2n : parseUnits("1", 9);
      return { maxFeePerGas: maxFee, maxPriorityFeePerGas: priorityFallback };
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Auditor Wallet</Label>
        <Input value={auditor} onChange={(event) => setAuditor(event.target.value)} placeholder="0x..." />
      </div>
      <div className="space-y-2">
        <Label>Investor Wallet</Label>
        <Input value={investor} onChange={(event) => setInvestor(event.target.value)} placeholder="0x..." />
      </div>
      <div className="space-y-2">
        <Label>Disclosure Ref</Label>
        <Input value={disclosureRef} onChange={(event) => setDisclosureRef(event.target.value)} placeholder="0g://... or generated on grant" />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={async () => {
            setStoring(true);
            let ref = disclosureRef;
            if (!ref) {
              const res = await fetch("/api/0g/storage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  kind: "encrypted-room-state",
                  payload: { dealId, auditor, investor, disclosure: "Permissioned Kavro auditor packet" }
                })
              });
              const json = await res.json();
              ref = json.uri;
              setDisclosureRef(ref);
            }
            setStoring(false);
            const fees = await getFees();
            writeContract({
              address: DEAL_ROOM_ADDRESS as `0x${string}`,
              abi: dealRoomAbi,
              functionName: "grantAuditorAccess",
              args: [BigInt(dealId), auditor as `0x${string}`, investor as `0x${string}`, ref],
              ...fees
            });
          }}
          disabled={isPending || storing || !auditor || !investor}
        >
          {storing ? "Storing disclosure..." : isPending ? "Granting" : "Grant Access"}
        </Button>
        {isLoading ? <span className="text-xs text-text-2">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      <p className="text-xs text-text-2">Auditors receive a permissioned 0G Storage disclosure reference, not public plaintext bid details.</p>
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
