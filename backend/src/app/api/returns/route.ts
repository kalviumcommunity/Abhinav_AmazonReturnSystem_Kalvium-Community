import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = requireSession(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const returnRequests = await prisma.returnRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ returnRequests });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
