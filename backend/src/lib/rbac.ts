import { NextResponse } from "next/server";
import { SessionPayload } from "@/lib/auth";

/**
 * Canonical role constants — must match the UserRole enum in schema.prisma.
 */
export const Roles = {
  SELLER: "SELLER",
  CUSTOMER_SUPPORT: "CUSTOMER_SUPPORT",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

/**
 * Returns null when the session role is in allowedRoles (request may proceed).
 * Returns a ready-to-return 403 NextResponse when the role is insufficient.
 *
 * Usage:
 *   const forbidden = requireRole(auth.session, [Roles.CUSTOMER_SUPPORT]);
 *   if (forbidden) return forbidden;
 */
export function requireRole(
  session: SessionPayload,
  allowedRoles: Role[]
): NextResponse | null {
  if (allowedRoles.includes(session.role as Role)) {
    return null;
  }
  return NextResponse.json(
    {
      error: "Forbidden",
      code: "INSUFFICIENT_PERMISSIONS",
      message: `Role '${session.role}' is not permitted to perform this action.`,
    },
    { status: 403 }
  );
}
