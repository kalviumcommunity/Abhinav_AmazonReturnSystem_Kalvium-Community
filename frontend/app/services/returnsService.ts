import { API_BASE_URL, ReturnRequest } from "@/app/types";

export interface DecisionResult {
  success: boolean;
  message: string;
  returnRequest?: ReturnRequest;
  error?: string;
}

/**
 * Parses an error response from the backend into a user-friendly message.
 */
async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.error || data.message || `Request failed (${response.status})`;
  } catch {
    switch (response.status) {
      case 401:
        return "You are not authenticated. Please sign in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested return was not found.";
      case 409:
        return "This return has already been decided.";
      default:
        return `An unexpected error occurred (${response.status}).`;
    }
  }
}

/**
 * Fetch all return requests from the backend.
 */
export async function getAllReturns(): Promise<ReturnRequest[]> {
  const response = await fetch(`${API_BASE_URL}/api/returns`, {
    credentials: "include",
  });

  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error(msg);
  }

  const data = await response.json();
  return data.returnRequests ?? [];
}

/**
 * Fetch a single return request by ID, including audit logs.
 */
export async function getReturnById(
  id: string
): Promise<ReturnRequest | null> {
  const response = await fetch(`${API_BASE_URL}/api/returns/${id}`, {
    credentials: "include",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error(msg);
  }

  const data = await response.json();
  return data.returnRequest ?? null;
}

/**
 * Approve a return request.
 */
export async function approveReturn(id: string): Promise<DecisionResult> {
  const response = await fetch(`${API_BASE_URL}/api/returns/${id}/approve`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const msg = await parseError(response);
    return { success: false, message: msg, error: msg };
  }

  const data = await response.json();
  return {
    success: true,
    message: data.message || "Return request approved successfully.",
    returnRequest: data.returnRequest,
  };
}

/**
 * Reject a return request with a reason.
 */
export async function rejectReturn(
  id: string,
  reason: string
): Promise<DecisionResult> {
  const response = await fetch(`${API_BASE_URL}/api/returns/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const msg = await parseError(response);
    return { success: false, message: msg, error: msg };
  }

  const data = await response.json();
  return {
    success: true,
    message: data.message || "Return request rejected successfully.",
    returnRequest: data.returnRequest,
  };
}
