import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(request);
  if (auth.response) {
    return auth.response;
  }

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
          status: "APPROVED",
          decidedBy: auth.session.email,
          decidedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          returnRequestId: id,
          action: "APPROVED",
          actor: auth.session.email,
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
