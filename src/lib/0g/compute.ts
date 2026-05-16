import type {
  AuditorComplianceOutput,
  DueDiligenceOutput,
  InvestorRiskOutput,
  IssuerAllocationOutput,
  KavroAgentResult,
  UnderwritingSwarmOutput
} from "@/lib/0g/types";

const COMPUTE_BASE_URL = process.env.NEXT_PUBLIC_0G_COMPUTE_BASE_URL;
const COMPUTE_PROVIDER = process.env.NEXT_PUBLIC_0G_COMPUTE_PROVIDER_ADDRESS;
const MODEL = process.env.NEXT_PUBLIC_0G_COMPUTE_MODEL ?? "zai-org/GLM-5-FP8";

type AgentKind = KavroAgentResult["agentType"];

async function resolveComputeService() {
  if (COMPUTE_BASE_URL) {
    return { endpoint: COMPUTE_BASE_URL, model: MODEL };
  }
  throw new Error("Missing NEXT_PUBLIC_0G_COMPUTE_BASE_URL");
}

function systemPrompt(agentType: AgentKind) {
  return `You are a Kavro Protocol ${agentType} agent running on 0G Compute. Return strict JSON only. Do not request or reveal plaintext confidential bid amounts. Use public metadata, commitments, hashes, and encrypted storage references.`;
}

function parseJsonContent(content: unknown) {
  if (typeof content !== "string") return content;
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return JSON.parse(fenced[1]);

  const firstObject = trimmed.indexOf("{");
  const lastObject = trimmed.lastIndexOf("}");
  if (firstObject >= 0 && lastObject > firstObject) {
    return JSON.parse(trimmed.slice(firstObject, lastObject + 1));
  }
  return JSON.parse(trimmed);
}

async function run0GAgent(agentType: AgentKind, input: Record<string, unknown>): Promise<KavroAgentResult> {
  const apiKey = process.env.OG_COMPUTE_API_KEY;
  if (!apiKey) throw new Error("Missing OG_COMPUTE_API_KEY");
  const service = await resolveComputeService();

  const response = await fetch(`${service.endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: service.model,
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
  const output = parseJsonContent(content);
  return {
    mode: "0g",
    agentType,
    provider: COMPUTE_PROVIDER ? `0G Compute Direct Provider ${COMPUTE_PROVIDER}` : "0G Compute",
    model: service.model,
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
