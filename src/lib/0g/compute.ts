import type {
  AuditorComplianceOutput,
  DueDiligenceOutput,
  InvestorRiskOutput,
  IssuerAllocationOutput,
  KavroAgentResult,
  UnderwritingSwarmOutput
} from "@/lib/0g/types";

const ROUTER_URL = process.env["0G_COMPUTE_ROUTER_URL"] ?? process.env.NEXT_PUBLIC_0G_COMPUTE_ROUTER_URL;
const MODEL = process.env.NEXT_PUBLIC_0G_COMPUTE_MODEL ?? "auto";

type AgentKind = KavroAgentResult["agentType"];

function systemPrompt(agentType: AgentKind) {
  return `You are a Kavro Protocol ${agentType} agent running on 0G Compute. Return strict JSON only. Do not request or reveal plaintext confidential bid amounts. Use public metadata, commitments, hashes, and encrypted storage references.`;
}

async function run0GAgent(agentType: AgentKind, input: Record<string, unknown>): Promise<KavroAgentResult> {
  const apiKey = process.env["0G_COMPUTE_API_KEY"];
  if (!apiKey) throw new Error("Missing 0G_COMPUTE_API_KEY");
  if (!ROUTER_URL) throw new Error("Missing 0G_COMPUTE_ROUTER_URL or NEXT_PUBLIC_0G_COMPUTE_ROUTER_URL");

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

  if (!response.ok) throw new Error(`0G Compute ${response.status}: ${await response.text()}`);
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
