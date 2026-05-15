"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { keccak256, toBytes } from "viem";

interface AiBriefProps {
  dealId: number;
  mode: "issuer" | "investor" | "auditor";
  title: string;
  category: string;
  description: string;
  maturityDate: bigint;
  storageRef: string;
}

const agentLabel = {
  issuer: "Generate Issuer Allocation Plan",
  investor: "Generate Investor Bid Recommendation",
  auditor: "Generate Auditor Compliance Summary"
} as const;

const agentType = {
  issuer: "issuer_allocation",
  investor: "bid_recommendation",
  auditor: "auditor_compliance"
} as const;

export function AiBrief({ dealId, mode, title, category, description, maturityDate, storageRef }: AiBriefProps) {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [storage, setStorage] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeAgentEnum, setActiveAgentEnum] = useState(4);
  const publicClient = usePublicClient();
  const { data: commitHash, writeContract, isPending: committing, error: commitError } = useWriteContract();
  const { isLoading: commitConfirming } = useWaitForTransactionReceipt({ hash: commitHash });

  const runAgent = async (selectedAgent: string) => {
    setResult(null);
    setStorage(null);
    setError("");
    setLoading(true);
    setActiveAgentEnum(selectedAgent === "due_diligence" ? 4 : selectedAgent === "auditor_compliance" ? 2 : selectedAgent === "issuer_allocation" ? 0 : 1);
    try {
      const res = await fetch("/api/0g/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: selectedAgent,
          input: {
            dealId,
            title,
            category,
            description,
            maturityDate: maturityDate.toString(),
            storageRef,
            confidentialAmountsExcluded: true
          }
        })
      });
      if (!res.ok) throw new Error("0G agent unavailable");
      const json = await res.json();
      setResult(json.output);
      setStorage(json.storageRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run Kavro agent.");
    } finally {
      setLoading(false);
    }
  };

  const commitReport = async () => {
    if (!result || !storage?.uri) return;
    const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "setAIReportRef",
      args: [
        BigInt(dealId),
        activeAgentEnum,
        keccak256(toBytes(JSON.stringify(result))),
        storage.uri
      ],
      ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    });
  };

  return (
    <div className="border-t border-border pt-5 mt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-1">
            Kavro 0G Agents
          </p>
          <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-3">
            0G Compute
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => runAgent("due_diligence")} disabled={loading}>
            Generate 0G Due Diligence
          </Button>
          <Button variant="outline" size="sm" onClick={() => runAgent(agentType[mode])} disabled={loading}>
            {agentLabel[mode]}
          </Button>
        </div>
      </div>

      <p className="mb-3 text-xs text-text-3">
        Kavro uses 0G Compute for private agent analysis and stores report commitments on 0G Storage / 0G Chain. Plaintext confidential amounts are excluded from prompts.
      </p>

      {loading && <p className="text-xs text-text-3 animate-pulse">Running 0G agent...</p>}
      {error && <p className="text-xs text-danger">{error}</p>}

      {result && (
        <div className="space-y-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-2">
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">
            {JSON.stringify(result, null, 2)}
          </pre>
          {storage && (
            <div className="rounded-lg border border-border bg-card p-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold uppercase tracking-widest text-text-3">AI report storage ref</span>
                <span className="text-gold">{storage.mode === "0g" ? "0G Storage" : "Local dev fallback"}</span>
              </div>
              <p className="mt-2 break-all font-mono text-text-2">{storage.uri}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={commitReport} disabled={committing || !DEAL_ROOM_ADDRESS}>
                  {committing ? "Committing..." : "Commit Report Ref on 0G Chain"}
                </Button>
                {commitConfirming ? <span className="text-text-3">Confirming...</span> : null}
                {commitHash ? <span className="break-all font-mono text-gold">{commitHash}</span> : null}
              </div>
              {commitError ? <p className="mt-2 text-danger">{commitError.message}</p> : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
