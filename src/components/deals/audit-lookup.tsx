"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuditLookup() {
  const { address } = useAccount();
  const [dealId, setDealId] = useState("0");
  const [investor, setInvestor] = useState("");

  const parsedDealId = /^\d+$/.test(dealId) ? BigInt(dealId) : undefined;
  const investorIsValid = /^0x[a-fA-F0-9]{40}$/.test(investor);
  const canLookup = parsedDealId !== undefined && investorIsValid && !!DEAL_ROOM_ADDRESS;

  const { data, error, isFetching, refetch } = useReadContract({
    address: DEAL_ROOM_ADDRESS as `0x${string}`,
    abi: dealRoomAbi,
    functionName: "getBidForInvestor",
    args: canLookup ? [parsedDealId as bigint, investor as `0x${string}`] : undefined,
    query: { enabled: canLookup },
  });

  const { data: hasAccess } = useReadContract({
    address: DEAL_ROOM_ADDRESS as `0x${string}`,
    abi: dealRoomAbi,
    functionName: "hasAuditorAccessForInvestor",
    args: canLookup && address ? [parsedDealId as bigint, address, investor as `0x${string}`] : undefined,
    query: { enabled: canLookup && !!address },
  });

  const { data: disclosureRef } = useReadContract({
    address: DEAL_ROOM_ADDRESS as `0x${string}`,
    abi: dealRoomAbi,
    functionName: "getDisclosureRef",
    args: canLookup && address && hasAccess ? [parsedDealId as bigint, address, investor as `0x${string}`] : undefined,
    query: { enabled: canLookup && !!address && hasAccess === true },
  });

  const bid = data as { bidCommitment: string; storageRef: string; aiReportHash: `0x${string}`; claimed: boolean } | undefined;

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Auditor Lookup</p>
      <h3 className="mt-1 text-lg font-semibold text-text-1">Permissioned Bid Disclosure</h3>
      <p className="mt-1 text-sm text-text-2">Enter a deal ID and investor address to view permissioned commitment and 0G disclosure references.</p>
      <div className="mt-4 grid gap-3 text-xs md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <span className="block uppercase tracking-widest text-text-3">Connected auditor</span>
          <span className="mt-1 block font-mono text-text-1">{address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "connect wallet"}</span>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <span className="block uppercase tracking-widest text-text-3">Required issuer action</span>
          <span className="mt-1 block text-text-1">grant auditor access</span>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <span className="block uppercase tracking-widest text-text-3">Seeded proof</span>
          <span className="mt-1 block text-text-1">deal 0 / deployer investor</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Deal ID</Label>
          <Input value={dealId} onChange={(e) => setDealId(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Investor Address</Label>
          <Input value={investor} onChange={(e) => setInvestor(e.target.value)} placeholder="0x…" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" disabled={!canLookup || isFetching} onClick={() => refetch()}>
          {isFetching ? "Checking..." : "Check Disclosure"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setDealId("0");
            setInvestor("0x267C17E938cb6C504bE4710F580780B9199299D7");
          }}
        >
          Use seeded proof values
        </Button>
      </div>

      {bid ? (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Bid Data</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-2">Bid Commitment</span>
              <span className="font-mono text-xs text-text-1 max-w-[220px] truncate">{bid.bidCommitment}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">0G Storage Ref</span>
              <span className="font-mono text-xs text-gold max-w-[220px] truncate">{bid.storageRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Claimed</span>
              <span className={bid.claimed ? "text-success" : "text-text-3"}>{bid.claimed ? "✓ Yes" : "No"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Auditor Access</span>
              <span className={hasAccess ? "text-success" : "text-warning"}>{hasAccess ? "Granted" : "Not granted"}</span>
            </div>
            {disclosureRef ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-text-2">Disclosure Ref</span>
                <span className="max-w-[260px] truncate font-mono text-xs text-gold">{disclosureRef}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : error ? (
        <div className="mt-5 rounded-xl border border-warning/30 bg-warning/5 px-4 py-4 text-sm text-warning">
          No permissioned bid data for this connected auditor wallet. Make sure the issuer granted auditor access for this deal ID and investor address.
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-6 text-center text-sm text-text-2">
          Enter the exact deal ID and investor address, then check disclosure. For the seeded proof, use deal ID 0 and the deployer investor shortcut.
        </div>
      )}
      <p className="mt-3 text-xs text-text-2">Permissioned access required: issuer must call Grant Auditor Access before lookup can reveal bid data.</p>
    </Card>
  );
}
