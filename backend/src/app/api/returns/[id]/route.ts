import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(request);
  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id },
      include: { auditLogs: true },
    });

    if (!returnRequest) {
      return NextResponse.json(
        { error: "Return request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ returnRequest });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}