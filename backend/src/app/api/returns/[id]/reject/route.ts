import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let body: { reason?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const reason = body?.reason;
    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return NextResponse.json(
        { error: "Rejection reason is required and must not be empty" },
        { status: 400 }
      );
    }

    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id },
    });

    if (!returnRequest) {
      return NextResponse.json(
        { error: "Return request not found" },
        { status: 404 }
      );
    }

    if (returnRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Return request is not in PENDING status" },
        { status: 409 }
      );
    }

    const [updatedReturnRequest, auditLog] = await prisma.$transaction([
      prisma.returnRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectionReason: reason.trim(),
          decidedBy: "SYSTEM_MOCK",
          decidedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          returnRequestId: id,
          action: "REJECTED",
          actor: "SYSTEM_MOCK",
          reason: reason.trim(),
        },
      }),
    ]);

    return NextResponse.json({
      message: "Return request rejected successfully",
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
