import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { requireRole, Roles } from "@/lib/rbac";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(request);
  if (auth.response) {
    return auth.response;
  }

  const { session } = auth;

  // Only SELLER and CUSTOMER_SUPPORT may read a return detail.
  const forbidden = requireRole(session, [Roles.SELLER, Roles.CUSTOMER_SUPPORT]);
  if (forbidden) return forbidden;

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

    // SELLER may only view their own return requests.
    if (
      session.role === Roles.SELLER &&
      returnRequest.sellerId !== session.sub
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "INSUFFICIENT_PERMISSIONS",
          message: "You do not have access to this return request.",
        },
        { status: 403 }
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