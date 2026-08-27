import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { requireRole, Roles } from "@/lib/rbac";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(request);
  if (auth.response) {
    return auth.response;
  }

  const { session } = auth;

  // Only SELLER and CUSTOMER_SUPPORT may approve returns.
  const forbidden = requireRole(session, [Roles.SELLER, Roles.CUSTOMER_SUPPORT]);
  if (forbidden) return forbidden;

  try {
    const { id } = await params;

    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id },
    });

    if (!returnRequest) {
      return NextResponse.json(
        { error: "Return request not found" },
        { status: 404 }
      );
    }

    // SELLER may only approve their own return requests.
    if (
      session.role === Roles.SELLER &&
      returnRequest.sellerId !== session.sub
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "INSUFFICIENT_PERMISSIONS",
          message: "You do not have permission to approve this return request.",
        },
        { status: 403 }
      );
    }

    if (returnRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Return request is not in PENDING status" },
        { status: 409 }
      );
    }

    // Use session.sub (user ID) as the authoritative actor identity in audit logs,
    // replacing the Day 4 SYSTEM_MOCK / email-based actor.
    const actorId = session.sub;
    const actorDisplay = session.name ?? session.email;

    const [updatedReturnRequest, auditLog] = await prisma.$transaction([
      prisma.returnRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          decidedBy: actorId,
          decidedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          returnRequestId: id,
          action: "APPROVED",
          // actor stores the user ID for traceability; actorDisplay carries the human-readable name.
          actor: `${actorId} (${actorDisplay})`,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Return request approved successfully",
      returnRequest: updatedReturnRequest,
      auditLog,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
