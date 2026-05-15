import { NextRequest, NextResponse } from "next/server";
import {
  uploadAgentProfileTo0G,
  uploadAIReportTo0G,
  uploadDealMetadataTo0G,
  uploadEncryptedRoomStateTo0G
} from "@/lib/0g/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { kind, payload } = await req.json();

  if (kind === "deal-metadata") {
    return NextResponse.json(await uploadDealMetadataTo0G(payload));
  }
  if (kind === "encrypted-room-state") {
    return NextResponse.json(await uploadEncryptedRoomStateTo0G(payload));
  }
  if (kind === "agent-profile") {
    return NextResponse.json(await uploadAgentProfileTo0G(payload));
  }
  if (kind === "ai-report") {
    return NextResponse.json(await uploadAIReportTo0G(payload));
  }

  return NextResponse.json({ error: "Unsupported storage kind" }, { status: 400 });
}
