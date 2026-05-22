import { NextRequest, NextResponse } from "next/server";
import { grantMockKyc } from "@/lib/demo/register-investor";

export const runtime = "nodejs";
export const maxDuration = 60;

/** @deprecated Use /api/demo/mock-kyc */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address = typeof body.address === "string" ? body.address.trim() : "";

    if (!address) {
      return NextResponse.json({ error: "Missing investor address" }, { status: 400 });
    }

    const result = await grantMockKyc(address);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mock KYC request failed" },
      { status: 503 }
    );
  }
}
