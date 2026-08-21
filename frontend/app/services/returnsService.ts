import { allReturnRequests, ReturnRequest } from "@/app/data/mockData";

// Shared state for in-memory tracking of decisions across the session
let returnStore: ReturnRequest[] = [...allReturnRequests];

export interface DecisionResult {
  success: boolean;
  message: string;
  returnRequest?: ReturnRequest;
  error?: string;
}

/**
 * Service to fetch and manage return request decisions.
 * Designed to mirror backend API contracts so it can be swapped with real HTTP calls.
 */
export async function getReturnById(id: string): Promise<ReturnRequest | null> {
  const item = returnStore.find((r) => r.id === id);
  return item ? { ...item } : null;
}

export async function getAllReturns(): Promise<ReturnRequest[]> {
  return [...returnStore];
}

export async function approveReturn(id: string): Promise<DecisionResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = returnStore.findIndex((r) => r.id === id);
  if (index === -1) {
    return {
      success: false,
      message: "Return request not found",
      error: "Return request not found",
    };
  }

  const existing = returnStore[index];
  if (existing.status !== "Pending") {
    return {
      success: false,
      message: `Cannot approve: Return is already ${existing.status}`,
      error: `Return request is not in Pending status (currently ${existing.status})`,
    };
  }

  const updated: ReturnRequest = {
    ...existing,
    status: "Approved",
    decidedBy: "Seller (Abhinav)",
    decidedAt: new Date().toISOString().split("T")[0],
  };

  returnStore[index] = updated;

  return {
    success: true,
    message: "Return request approved successfully",
    returnRequest: updated,
  };
}

export async function rejectReturn(
  id: string,
  reason: string
): Promise<DecisionResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!reason || typeof reason !== "string" || reason.trim() === "") {
    return {
      success: false,
      message: "Rejection reason is required",
      error: "Rejection reason is required and must not be empty",
    };
  }

  const index = returnStore.findIndex((r) => r.id === id);
  if (index === -1) {
    return {
      success: false,
      message: "Return request not found",
      error: "Return request not found",
    };
  }

  const existing = returnStore[index];
  if (existing.status !== "Pending") {
    return {
      success: false,
      message: `Cannot reject: Return is already ${existing.status}`,
      error: `Return request is not in Pending status (currently ${existing.status})`,
    };
  }

  const updated: ReturnRequest = {
    ...existing,
    status: "Rejected",
    rejectionReason: reason.trim(),
    decidedBy: "Seller (Abhinav)",
    decidedAt: new Date().toISOString().split("T")[0],
  };

  returnStore[index] = updated;

  return {
    success: true,
    message: "Return request rejected successfully",
    returnRequest: updated,
  };
}
