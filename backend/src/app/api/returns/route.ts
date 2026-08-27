import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { requireRole, Roles } from "@/lib/rbac";

export async function GET(request: Request) {
  const auth = requireSession(request);
  if (auth.response) {
    return auth.response;
  }

  const { session } = auth;

  // Both SELLER and CUSTOMER_SUPPORT may read returns; all other roles are denied.
  const forbidden = requireRole(session, [Roles.SELLER, Roles.CUSTOMER_SUPPORT]);
  if (forbidden) return forbidden;

  try {
    const where =
      session.role === Roles.SELLER
        ? // SELLER: scoped to their own return requests only
          { sellerId: session.sub }
        : // CUSTOMER_SUPPORT: global read — no filter
          {};

    const returnRequests = await prisma.returnRequest.findMany({
      where,
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
