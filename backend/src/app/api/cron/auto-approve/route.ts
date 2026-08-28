import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAutoApprovalSweep } from "@/lib/autoApprove";

// Triggered by an external scheduler (e.g. Vercel Cron), which sends
// `Authorization: Bearer <CRON_SECRET>` when the CRON_SECRET env var is set.
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAutoApprovalSweep(prisma);
    return NextResponse.json({
      message: `Auto-approved ${result.count} expired return request(s)`,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
