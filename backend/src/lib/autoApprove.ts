import type { PrismaClient } from "../generated/prisma/client";

const AUTO_APPROVAL_WINDOW_MS = 48 * 60 * 60 * 1000;

export interface AutoApprovalResult {
  approvedIds: string[];
  count: number;
}

/**
 * Auto-approves any ReturnRequest that has sat in PENDING for more than 48h,
 * pairing each status change with an AuditLog row (actor: "SYSTEM") in the
 * same transaction, matching the approve/reject route convention.
 */
export async function runAutoApprovalSweep(
  prisma: PrismaClient,
  now: Date = new Date()
): Promise<AutoApprovalResult> {
  const deadline = new Date(now.getTime() - AUTO_APPROVAL_WINDOW_MS);

  const expiredReturns = await prisma.returnRequest.findMany({
    where: { status: "PENDING", createdAt: { lte: deadline } },
  });

  const approvedIds: string[] = [];

  for (const returnRequest of expiredReturns) {
    await prisma.$transaction([
      prisma.returnRequest.update({
        where: { id: returnRequest.id },
        data: {
          status: "AUTO_APPROVED",
          decidedBy: "SYSTEM",
          decidedAt: now,
        },
      }),
      prisma.auditLog.create({
        data: {
          returnRequestId: returnRequest.id,
          action: "AUTO_APPROVED",
          actor: "SYSTEM",
          reason: "48h timeout reached",
        },
      }),
    ]);
    approvedIds.push(returnRequest.id);
  }

  return { approvedIds, count: approvedIds.length };
}
