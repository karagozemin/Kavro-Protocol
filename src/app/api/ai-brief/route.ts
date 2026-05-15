import { NextRequest } from "next/server";
import { runDueDiligenceAgent } from "@/lib/0g/compute";
import { uploadAIReportTo0G } from "@/lib/0g/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const input = await req.json();
  const result = await runDueDiligenceAgent(input);
  const storageRef = await uploadAIReportTo0G({ agentType: "due_diligence", result });

  return Response.json({
    ...result,
    storageRef,
    legacyRoute: true,
    note: "Use /api/0g/agent for new Kavro agent flows."
  });
}
