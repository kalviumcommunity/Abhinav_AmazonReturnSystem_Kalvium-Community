/**
 * Shared types and UI constants for the frontend.
 * These are NOT mock data — they are type definitions and static display configuration.
 */

// ─── Backend API Base URL ───────────────────────────────
export const API_BASE_URL = "http://localhost:3001";

// ─── Return Status ──────────────────────────────────────
export type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | "AUTO_APPROVED";

/** Display-friendly label for each status */
export const statusDisplayLabel: Record<ReturnStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  AUTO_APPROVED: "Auto Approved",
};

// ─── Filter Labels ──────────────────────────────────────
export const statusFilters: Array<"All" | ReturnStatus> = [
  "All",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "AUTO_APPROVED",
];

// ─── Audit Log ──────────────────────────────────────────
export interface AuditLog {
  id: string;
  returnRequestId: string;
  action: string;
  actor: string;
  reason: string | null;
  createdAt: string;
}

// ─── Return Request ─────────────────────────────────────
export interface ReturnRequest {
  id: string;
  orderId: string;
  product: string;
  customer: string;
  status: ReturnStatus;
  sellerId: string;
  decidedBy: string | null;
  decidedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  auditLogs?: AuditLog[];
}

// ─── Summary Card (UI-only shape) ───────────────────────
export interface SummaryCardData {
  title: string;
  value: number;
  color: string;
  bgColor: string;
}

// ─── Daily Activity (UI-only shape) ─────────────────────
export interface DailyActivity {
  day: string;
  value: number;
}
