"use client";

import { useEffect, useMemo } from "react";
import { useAccount, useBlockNumber, usePublicClient, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DealStateBadge } from "@/components/deals/deal-state";
import { BidForm } from "@/components/deals/bid-form";
import { ClaimButton } from "@/components/deals/claim-button";
import { GrantAuditor } from "@/components/deals/grant-auditor";
import { RepayForm } from "@/components/deals/repay-form";
import { TxLink } from "@/components/tx/tx-link";
import { AiBrief } from "@/components/deals/ai-brief";

const dealRoomAddress = DEAL_ROOM_ADDRESS as `0x${string}`;
type Mode = "issuer" | "investor" | "auditor";

export function DealList({ mode }: { mode: Mode }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: actionHash, writeContract, isPending: actionPending, error: actionError } = useWriteContract();
  const hasAddress = Boolean(DEAL_ROOM_ADDRESS);

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: count, refetch: refetchCount } = useReadContract({
    address: dealRoomAddress,
    abi: dealRoomAbi,
    functionName: "getDealsCount",
    query: { enabled: hasAddress },
  });

  const dealCount = Number(count ?? 0);

  const dealContracts = useMemo(
    () => Array.from({ length: dealCount }).map((_, i) => ({
      address: dealRoomAddress,
      abi: dealRoomAbi,
      functionName: "getDeal" as const,
      args: [BigInt(i)],
    })),
    [dealCount]
  );

  const { data: dealResults, refetch: refetchDeals } = useReadContracts({
    contracts: dealContracts,
    query: { enabled: dealCount > 0 },
  });

  const bidContracts = useMemo(
    () => Array.from({ length: dealCount }).map((_, i) => ({
      address: dealRoomAddress,
      abi: dealRoomAbi,
      functionName: "getBidForInvestor" as const,
      args: [BigInt(i), address as `0x${string}`],
    })),
    [dealCount, address]
  );

  const { data: bidResults, refetch: refetchBids } = useReadContracts({
    contracts: bidContracts,
    query: { enabled: mode === "investor" && dealCount > 0 && !!address },
  });

  const accessContracts = useMemo(
    () => Array.from({ length: dealCount }).map((_, i) => ({
      address: dealRoomAddress,
      abi: dealRoomAbi,
      functionName: "hasAuditorAccess" as const,
      args: [BigInt(i), address as `0x${string}`],
    })),
    [dealCount, address]
  );

  const { data: accessResults, refetch: refetchAccess } = useReadContracts({
    contracts: accessContracts,
    query: { enabled: mode === "auditor" && dealCount > 0 && !!address },
  });

  // Refetch all on-chain data whenever a new block arrives.
  useEffect(() => {
    if (!blockNumber) return;
    void refetchCount();
    void refetchDeals();
    void refetchBids();
    void refetchAccess();
  }, [blockNumber, refetchCount, refetchDeals, refetchBids, refetchAccess]);

  if (!DEAL_ROOM_ADDRESS) {
    return (
      <Card>
        <p className="text-sm text-text-2">Kavro deal contract not configured. Set <code className="text-gold">NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS</code> after 0G deployment.</p>
      </Card>
    );
  }

  if (!dealCount) {
    return (
      <Card>
        <p className="text-sm text-text-2">No Kavro Rooms yet. Create the first private credit-agent funding round.</p>
      </Card>
    );
  }

  const getFees = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    return {
      ...(fees.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {}),
    };
  };

  const issuerAction = async (fn: "openFunding" | "markFunded" | "closeDeal", index: number) => {
    const fees = await getFees();
    writeContract({ address: dealRoomAddress, abi: dealRoomAbi, functionName: fn, args: [BigInt(index)], ...fees });
  };

  return (
    <div className="space-y-5">
      {dealResults?.map((result, index) => {
        if (!result?.result) return null;
        const hasAccess = accessResults?.[index]?.result as boolean | undefined;
        if (mode === "auditor" && !hasAccess) return null;

        const deal = result.result as {
          issuer: string;
          metadata: { title: string; category: string; maturityDate: bigint; description: string; storageRef: string };
          state: number;
          aiReportRef: string;
          repaymentCommitment: `0x${string}`;
          bidCount: bigint;
        };

        const bid = bidResults?.[index]?.result as
          | { bidCommitment: string; storageRef: string; aiReportHash: `0x${string}`; claimed: boolean }
          | undefined;

        const isIssuer = !!address && deal.issuer.toLowerCase() === address.toLowerCase();

        return (
          <Card key={`deal-${index}`}>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-text-3">Kavro Room {index}</p>
                <h3 className="mt-1 text-lg font-semibold text-text-1">{deal.metadata.title || "Untitled Deal"}</h3>
                <p className="text-sm text-text-2">{deal.metadata.category}</p>
              </div>
              <DealStateBadge state={deal.state} />
            </div>

            {deal.metadata.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-2">{deal.metadata.description}</p>
            )}

            {/* Metadata grid */}
            <div className="mt-4 grid gap-x-6 gap-y-2 text-xs md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Maturity</span>
                <span className="font-mono text-text-1">
                  {new Date(Number(deal.metadata.maturityDate) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Issuer</span>
                <span className="font-mono text-text-2">
                  {deal.issuer.slice(0, 6)}…{deal.issuer.slice(-4)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Sealed Bids</span>
                <span className="text-gold text-xs">{Number(deal.bidCount ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Repayment</span>
                <span className="font-mono text-text-2">{deal.repaymentCommitment && deal.repaymentCommitment !== "0x0000000000000000000000000000000000000000000000000000000000000000" ? `${deal.repaymentCommitment.slice(0, 10)}...` : "Pending"}</span>
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-xs md:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface px-3 py-2">
                <span className="block uppercase tracking-widest text-text-3">0G Storage status</span>
                <span className="mt-1 block text-gold">metadata committed</span>
              </div>
              <div className="rounded-lg border border-border bg-surface px-3 py-2">
                <span className="block uppercase tracking-widest text-text-3">Deal metadata ref</span>
                <span className="mt-1 block break-all font-mono text-text-2">{deal.metadata.storageRef || "not set"}</span>
              </div>
              <div className="rounded-lg border border-border bg-surface px-3 py-2">
                <span className="block uppercase tracking-widest text-text-3">AI report ref</span>
                <span className="mt-1 block break-all font-mono text-text-2">{deal.aiReportRef || "generated during demo"}</span>
              </div>
            </div>

            {/* Issuer actions */}
            {mode === "issuer" && (
              <div className="mt-6 space-y-5 border-t border-border pt-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Deal Controls</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => issuerAction("openFunding", index)} disabled={actionPending || !isIssuer}>
                      {actionPending ? "Submitting…" : "Open Funding"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => issuerAction("markFunded", index)} disabled={actionPending || !isIssuer}>
                      Mark Funded
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => issuerAction("closeDeal", index)} disabled={actionPending || !isIssuer}>
                      Close Deal
                    </Button>
                    <TxLink hash={actionHash} />
                  </div>
                  {!isIssuer && <p className="mt-2 text-xs text-warning">Connect the issuer wallet to use deal controls.</p>}
                  {actionError && <p className="mt-2 text-xs text-danger">{actionError.message}</p>}
                </div>
                <div className="border-t border-border pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Repayment</p>
                  <RepayForm dealId={index} isIssuer={isIssuer} />
                </div>
                <div className="border-t border-border pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Auditor Access</p>
                  <GrantAuditor dealId={index} />
                </div>
              </div>
            )}

            {/* AI Due Diligence Brief — all modes */}
            <AiBrief
              dealId={index}
              mode={mode}
              title={deal.metadata.title}
              category={deal.metadata.category}
              description={deal.metadata.description}
              maturityDate={deal.metadata.maturityDate}
              storageRef={deal.metadata.storageRef}
            />

            {/* Investor actions */}
            {mode === "investor" && (
              <div className="mt-6 space-y-4 border-t border-border pt-5">
                {deal.state === 1 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Submit Bid</p>
                    <BidForm dealId={index} />
                  </div>
                )}
                <div className="rounded-xl border border-border bg-surface p-4 text-sm space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-3">Your Position</p>
                  <div className="flex items-center justify-between">
                    <span className="text-text-2">Bid Commitment</span>
                    <span className="font-mono text-xs text-text-1">{bid?.bidCommitment ? `${bid.bidCommitment.slice(0, 10)}...` : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-2">Storage Ref</span>
                    <span className="max-w-[14rem] truncate text-xs text-gold">{bid?.storageRef || "encrypted 0G ref pending"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-2">Claimed</span>
                    <span className={bid?.claimed ? "text-success" : "text-text-3"}>
                      {bid?.claimed ? "✓ Yes" : "No"}
                    </span>
                  </div>
                </div>
                {deal.state >= 3 && bid && !bid.claimed && <ClaimButton dealId={index} />}
                {deal.state >= 3 && !bid && (
                  <p className="text-xs text-warning">No bid found for this wallet.</p>
                )}
                {deal.state >= 3 && bid?.claimed && (
                  <p className="text-xs text-success">Already claimed with this wallet.</p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
