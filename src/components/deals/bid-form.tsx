"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi, identityRegistryAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS, IDENTITY_REGISTRY_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { keccak256, toBytes } from "viem";
import { TxLink } from "@/components/tx/tx-link";

export function BidForm({ dealId }: { dealId: number }) {
  const { address, isConnected } = useAccount();
  const [privateBidMemo, setPrivateBidMemo] = useState("");
  const [bidCommitment, setBidCommitment] = useState<`0x${string}` | "">("");
  const [storageRef, setStorageRef] = useState("");
  const [aiReportHash, setAiReportHash] = useState<`0x${string}` | "">("");
  const [notice, setNotice] = useState("");
  const [storing, setStoring] = useState(false);
  const publicClient = usePublicClient();

  const { data: bidHash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash: bidHash });
  const { data: isVerified, isLoading: checkingIdentity } = useReadContract({
    address: IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address && !!IDENTITY_REGISTRY_ADDRESS }
  });

  const requiresIdentity = Boolean(IDENTITY_REGISTRY_ADDRESS);
  const canSubmitIdentity = !requiresIdentity || isVerified === true;

  const generateCommitment = () => {
    const secret = privateBidMemo || `kavro-private-bid-${dealId}-${Date.now()}`;
    setBidCommitment(keccak256(toBytes(secret)));
  };

  const storePrivateBid = async () => {
    setNotice("");
    setStoring(true);
    try {
      const payload = {
        dealId,
        privateBidMemo: privateBidMemo || "Demo bid terms intentionally omitted from public chain state.",
        bidCommitment: bidCommitment || keccak256(toBytes(`kavro-private-bid-${dealId}-${Date.now()}`)),
        privateFieldsExcludedFromPublicChain: true
      };
      const res = await fetch("/api/0g/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "encrypted-room-state", payload })
      });
      const ref = await res.json();
      if (!res.ok || !ref.uri) throw new Error(ref.error ?? "0G Storage upload failed");
      setStorageRef(ref.uri);
      setNotice("0G Storage ref created.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not create 0G Storage ref.");
    } finally {
      setStoring(false);
    }
  };

  const handleBid = async () => {
    if (!bidCommitment || !storageRef || !canSubmitIdentity) return;
    const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "submitSealedBid",
      args: [
        BigInt(dealId),
        bidCommitment,
        storageRef,
        aiReportHash || "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Private Bid Memo</Label>
          <Input
            value={privateBidMemo}
            onChange={(event) => setPrivateBidMemo(event.target.value)}
            placeholder="Private amount/terms stay off public chain"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Bid Commitment</Label>
            <button type="button" onClick={generateCommitment} className="text-xs text-text-3 hover:text-gold">
              Generate
            </button>
          </div>
          <Input value={bidCommitment} onChange={(event) => setBidCommitment(event.target.value as `0x${string}`)} placeholder="0x..." />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>0G Storage Ref</Label>
          <Input value={storageRef} onChange={(event) => setStorageRef(event.target.value)} placeholder="0g://..." />
        </div>
        <div className="space-y-2">
          <Label>AI Report Hash</Label>
          <Input value={aiReportHash} onChange={(event) => setAiReportHash(event.target.value as `0x${string}`)} placeholder="optional 0x..." />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={storePrivateBid} disabled={storing || !bidCommitment}>
          {storing ? "Storing..." : "Store Private Bid on 0G"}
        </Button>
        <Button onClick={handleBid} disabled={!DEAL_ROOM_ADDRESS || isPending || !bidCommitment || !storageRef || !canSubmitIdentity}>
          {isPending ? "Submitting" : "Submit Sealed Bid"}
        </Button>
        {confirming && <span className="text-xs text-text-2">Confirming...</span>}
        <TxLink hash={bidHash} />
      </div>
      {requiresIdentity && isConnected && checkingIdentity ? (
        <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-2">
          Checking investor KYC status before sealed bid submission...
        </div>
      ) : null}
      {requiresIdentity && isConnected && isVerified === false ? (
        <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning">
          This investor wallet is not KYC verified in the Identity Registry, so the contract will reject
          <span className="font-mono"> submitSealedBid</span>. Connect the registry admin wallet on{" "}
          <Link href="/admin" className="font-semibold underline underline-offset-2">
            Admin
          </Link>{" "}
          and register this address first.
        </div>
      ) : null}
      {requiresIdentity && !isConnected ? (
        <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning">
          Connect the investor wallet before submitting a sealed bid.
        </div>
      ) : null}
      <div className="text-xs text-text-2">
        Kavro submits only a commitment and 0G Storage reference. Plaintext bid amounts are not written to public chain state.
      </div>
      {notice ? <div className="text-xs text-gold">{notice}</div> : null}
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
