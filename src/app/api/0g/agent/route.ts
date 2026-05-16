import { NextRequest, NextResponse } from "next/server";
import {
  runAuditorComplianceAgent,
  runBidRecommendationAgent,
  runDueDiligenceAgent,
  runInvestorRiskAgent,
  runIssuerAllocationAgent,
  runUnderwritingSwarm
} from "@/lib/0g/compute";
import { uploadAIReportTo0G } from "@/lib/0g/storage";

export const runtime = "nodejs";

const runners = {
  due_diligence: runDueDiligenceAgent,
  investor_risk: runInvestorRiskAgent,
  bid_recommendation: runBidRecommendationAgent,
  issuer_allocation: runIssuerAllocationAgent,
  auditor_compliance: runAuditorComplianceAgent,
  underwriting_swarm: runUnderwritingSwarm
} as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const agentType = body.agentType as keyof typeof runners;
    if (!agentType || !(agentType in runners)) {
      return NextResponse.json({ error: "Unknown Kavro agent type" }, { status: 400 });
    }

    const result = await runners[agentType](body.input ?? {});
    const storageRef = await uploadAIReportTo0G({
      agentType,
      result,
      inputCommitmentOnly: true
    });

    return NextResponse.json({
      ...result,
      storageRef
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "0G Compute request failed" },
      { status: 503 }
    );
  }
}
