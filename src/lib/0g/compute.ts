import type {
  AuditorComplianceOutput,
  DueDiligenceOutput,
  InvestorRiskOutput,
  IssuerAllocationOutput,
  KavroAgentResult,
  UnderwritingSwarmOutput
} from "@/lib/0g/types";

const ROUTER_URL = process.env.NEXT_PUBLIC_0G_COMPUTE_ROUTER_URL ?? "https://router-api-testnet.integratenetwork.work/v1";
const MODEL = process.env.NEXT_PUBLIC_0G_COMPUTE_MODEL ?? "auto";

type AgentKind = KavroAgentResult["agentType"];

function fallbackOutput(agentType: AgentKind, input: Record<string, unknown>) {
  const title = String(input.title ?? input.dealTitle ?? "Sample private credit room");
  if (agentType === "due_diligence") {
    return {
      overview: `${title} is a private credit room evaluated through Kavro's 0G Compute agent interface. The local fallback excludes private bid amounts and produces a judge-demo structure only.`,
      riskScore: 62,
      riskFactors: ["Borrower concentration risk", "Limited public collateral visibility", "Macro rate sensitivity"],
      positiveSignals: ["On-chain lifecycle commitments", "Permissioned auditor disclosure", "Encrypted deal memory on 0G Storage"],
      complianceNotes: ["Investor access should remain KYC-gated", "Confidential fields must stay encrypted or committed"],
      recommendedInvestorAction: "request_more_info",
      confidence: 78
    } satisfies DueDiligenceOutput;
  }
  if (agentType === "investor_risk" || agentType === "bid_recommendation") {
    return {
      dealId: String(input.dealId ?? "demo-room"),
      recommendedBidRange: { min: "250000", max: "750000" },
      suggestedTerms: {
        maturity: "9-12 months",
        yield: "11.5%-13.0%",
        collateralNotes: "Require receivables aging report and concentration covenant before final allocation."
      },
      reasoningSummary: "Recommendation uses public room metadata only; confidential wallet-specific limits are excluded from the prompt.",
      privateFieldsExcluded: true
    } satisfies InvestorRiskOutput;
  }
  if (agentType === "issuer_allocation") {
    return {
      allocationStrategy: "Prioritize verified institutional wallets with complementary size bands and lower concentration overlap.",
      bestBidProfile: "KYC-verified investor, medium ticket, covenant-friendly terms, low correlated exposure.",
      concentrationRisk: "Avoid filling more than 35% of the round with one investor profile.",
      recommendedNextStep: "Commit allocation summary to 0G Storage, then mark the room funded on 0G Chain.",
      publicSummary: "Kavro allocation agent recommends a diversified funded state without revealing bid amounts publicly.",
      privateDetailsStoredOn0G: true
    } satisfies IssuerAllocationOutput;
  }
  if (agentType === "underwriting_swarm") {
    const dueDiligence = fallbackOutput("due_diligence", input) as DueDiligenceOutput;
    const compliance = fallbackOutput("auditor_compliance", input) as AuditorComplianceOutput;
    const allocation = fallbackOutput("issuer_allocation", input) as IssuerAllocationOutput;
    return {
      dealId: String(input.dealId ?? "demo-room"),
      riskAgent: dueDiligence,
      complianceAgent: compliance,
      allocationAgent: allocation,
      criticAgent: {
        challengedAssumptions: [
          "Collateral quality should be verified against source documents before final allocation.",
          "Late-payment history needs a covenant or discount in the recommended yield.",
          "Investor concentration should be capped even if one bid is economically superior."
        ],
        missingInformation: ["Receivables aging report", "Borrower payment history", "Collateral concentration table"],
        revisedRiskScore: Math.min(100, dueDiligence.riskScore + 8),
        finalRecommendation: "request_more_info"
      },
      proofSummary: "Underwriting swarm produced a risk, compliance, allocation, and critic packet without exposing confidential bid amounts.",
      privateFieldsExcluded: true
    } satisfies UnderwritingSwarmOutput;
  }
  return {
    kycStatus: "permissioned_review_required",
    disclosureScope: "Auditor can verify selected bid commitment, AI report reference, and Proof-of-Credit Packet.",
    complianceFlags: ["Confirm KYC registry status", "Verify disclosure ref matches granted investor", "Check repayment commitment event"],
    auditSummary: "The auditor can verify lifecycle events and encrypted references without public leakage of sensitive terms.",
    canVerifyWithoutPublicLeakage: true
  } satisfies AuditorComplianceOutput;
}

function systemPrompt(agentType: AgentKind) {
  return `You are a Kavro Protocol ${agentType} agent running on 0G Compute. Return strict JSON only. Do not request or reveal plaintext confidential bid amounts. Use public metadata, commitments, hashes, and encrypted storage references.`;
}

async function run0GAgent(agentType: AgentKind, input: Record<string, unknown>): Promise<KavroAgentResult> {
  const apiKey = process.env["0G_COMPUTE_API_KEY"];
  if (!apiKey) {
    return {
      mode: "local-dev",
      agentType,
      provider: "local structured fallback",
      model: "deterministic-demo",
      output: fallbackOutput(agentType, input),
      warnings: ["0G_COMPUTE_API_KEY is not configured. This is a local-only fallback, not a live 0G Compute inference."]
    };
  }

  try {
    const response = await fetch(`${ROUTER_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt(agentType) },
          { role: "user", content: JSON.stringify(input) }
        ]
      })
    });

    if (!response.ok) throw new Error(`0G Compute ${response.status}`);
    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    const output = typeof content === "string" ? JSON.parse(content) : content;
    return {
      mode: "0g",
      agentType,
      provider: "0G Compute Router",
      model: MODEL,
      output: output as KavroAgentResult["output"],
      warnings: []
    };
  } catch (error) {
    return {
      mode: "local-dev",
      agentType,
      provider: "local structured fallback",
      model: "deterministic-demo",
      output: fallbackOutput(agentType, input),
      warnings: [`0G Compute request failed and local fallback was used: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}

export function runDueDiligenceAgent(input: Record<string, unknown>) {
  return run0GAgent("due_diligence", input) as Promise<KavroAgentResult<DueDiligenceOutput>>;
}

export function runInvestorRiskAgent(input: Record<string, unknown>) {
  return run0GAgent("investor_risk", input) as Promise<KavroAgentResult<InvestorRiskOutput>>;
}

export function runBidRecommendationAgent(input: Record<string, unknown>) {
  return run0GAgent("bid_recommendation", input) as Promise<KavroAgentResult<InvestorRiskOutput>>;
}

export function runIssuerAllocationAgent(input: Record<string, unknown>) {
  return run0GAgent("issuer_allocation", input) as Promise<KavroAgentResult<IssuerAllocationOutput>>;
}

export function runAuditorComplianceAgent(input: Record<string, unknown>) {
  return run0GAgent("auditor_compliance", input) as Promise<KavroAgentResult<AuditorComplianceOutput>>;
}

export function runUnderwritingSwarm(input: Record<string, unknown>) {
  return run0GAgent("underwriting_swarm", input) as Promise<KavroAgentResult<UnderwritingSwarmOutput>>;
}
