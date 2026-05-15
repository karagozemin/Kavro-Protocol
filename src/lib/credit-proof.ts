import type { ProofOfCreditPacket } from "@/lib/0g/types";

export function generateProofOfCreditPacket(input: Partial<ProofOfCreditPacket> & { dealId: string }): ProofOfCreditPacket {
  return {
    packetType: "proof_of_credit",
    dealId: input.dealId,
    chainId: input.chainId ?? 16661,
    issuerAgent: input.issuerAgent ?? "verified-or-pending",
    investorBids: "sealed",
    underwritingReportRef: input.underwritingReportRef ?? "generated-during-demo",
    aiRiskScore: input.aiRiskScore ?? "pending",
    bidCommitments: input.bidCommitments ?? [],
    auditorDisclosureRef: input.auditorDisclosureRef ?? "generated-during-demo",
    repaymentState: input.repaymentState ?? "pending",
    explorerLinks: input.explorerLinks ?? [],
    integrations: input.integrations ?? [
      "0G Storage",
      "0G Compute",
      "0G Chain",
      "Kavro SDK",
      "Agent ID-ready prototype",
      "Persistent Memory-ready adapter"
    ]
  };
}
