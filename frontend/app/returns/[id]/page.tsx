"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import TopNav from "@/app/components/TopNav";
import Sidebar from "@/app/components/Sidebar";
import StatusBadge from "@/app/components/StatusBadge";
import DecisionModal from "@/app/components/DecisionModal";
import {
  getReturnById,
  approveReturn,
  rejectReturn,
} from "@/app/services/returnsService";
import { ReturnRequest, statusDisplayLabel } from "@/app/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReturnDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const [returnItem, setReturnItem] = useState<ReturnRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getReturnById(id);
        setReturnItem(data);
      } catch (err: any) {
        setError(err.message || "Failed to load return request.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleOpenApprove = () => {
    setFeedback(null);
    setModalType("approve");
  };

  const handleOpenReject = () => {
    setFeedback(null);
    setModalType("reject");
  };

  const handleConfirmApprove = async () => {
    if (!returnItem) return;
    setIsSubmitting(true);
    const result = await approveReturn(returnItem.id);
    setIsSubmitting(false);

    if (result.success && result.returnRequest) {
      setReturnItem(result.returnRequest);
      setFeedback({
        type: "success",
        message: result.message || "Return request approved successfully.",
      });
      setModalType(null);
    } else {
      setFeedback({
        type: "error",
        message: result.error || result.message || "Failed to approve return request.",
      });
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!returnItem) return;
    setIsSubmitting(true);
    const result = await rejectReturn(returnItem.id, reason);
    setIsSubmitting(false);

    if (result.success && result.returnRequest) {
      setReturnItem(result.returnRequest);
      setFeedback({
        type: "success",
        message: result.message || "Return request rejected successfully.",
      });
      setModalType(null);
    } else {
      setFeedback({
        type: "error",
        message: result.error || result.message || "Failed to reject return request.",
      });
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <TopNav />
        <div className="dashboard-layout__body">
          <Sidebar />
          <main className="dashboard-main">
            <div className="returns-loading">
              <div className="returns-loading__spinner" />
              <p>Loading return request details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <TopNav />
        <div className="dashboard-layout__body">
          <Sidebar />
          <main className="dashboard-main">
            <div className="return-detail__not-found">
              <h1>Error</h1>
              <p>{error}</p>
              <Link href="/returns" className="return-detail__back-btn">
                ← Back to Return Requests
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!returnItem) {
    return (
      <div className="dashboard-layout">
        <TopNav />
        <div className="dashboard-layout__body">
          <Sidebar />
          <main className="dashboard-main">
            <div className="return-detail">
              <div className="return-detail__not-found">
                <h1>Return Not Found</h1>
                <p>
                  The return request <strong>{id}</strong> could not be found.
                </p>
                <Link href="/returns" className="return-detail__back-btn">
                  ← Back to Return Requests
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isPending = returnItem.status === "PENDING";

  // Calculate Auto-Approval Countdown
  const createdAtDate = new Date(returnItem.createdAt);
  const autoApproveDate = new Date(createdAtDate.getTime() + 48 * 60 * 60 * 1000);
  const now = new Date();
  const timeRemainingMs = autoApproveDate.getTime() - now.getTime();
  const hoursRemaining = Math.max(0, Math.floor(timeRemainingMs / (1000 * 60 * 60)));
  const isExpired = timeRemainingMs <= 0;

  return (
    <div className="dashboard-layout">
      <TopNav />
      <div className="dashboard-layout__body">
        <Sidebar />
        <main className="dashboard-main">
          {/* Breadcrumb */}
          <div className="return-detail__breadcrumb">
            <Link href="/returns" className="return-detail__breadcrumb-link">
              Return Requests
            </Link>
            <span className="return-detail__breadcrumb-sep">/</span>
            <span className="return-detail__breadcrumb-current">
              {returnItem.id}
            </span>
          </div>

          {/* Feedback Alert Banner */}
          {feedback && (
            <div
              className={`feedback-banner feedback-banner--${feedback.type}`}
              role="alert"
            >
              <span className="feedback-banner__icon">
                {feedback.type === "success" ? "✓" : "⚠"}
              </span>
              <div className="feedback-banner__text">
                <strong>
                  {feedback.type === "success" ? "Success" : "Error"}:
                </strong>{" "}
                {feedback.message}
              </div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="feedback-banner__close"
                aria-label="Dismiss feedback"
              >
                ✕
              </button>
            </div>
          )}

          <div className="return-detail">
            {/* Header */}
            <div className="return-detail__header">
              <div>
                <div className="return-detail__title-row">
                  <h1 className="return-detail__title">
                    Return Request {returnItem.id}
                  </h1>
                  <StatusBadge status={returnItem.status} />
                </div>
                <p className="return-detail__subtitle">
                  Submitted on{" "}
                  {new Date(returnItem.createdAt).toLocaleDateString()} • Order:{" "}
                  <strong>{returnItem.orderId}</strong>
                </p>
              </div>

              {/* Action Buttons for Pending items */}
              {isPending ? (
                <div className="decision-actions-container">
                  <div className="decision-actions">
                    <button
                      type="button"
                      onClick={handleOpenReject}
                      className="decision-btn decision-btn--reject"
                    >
                      <span className="decision-btn__icon">✕</span> Reject Request
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenApprove}
                      className="decision-btn decision-btn--approve"
                    >
                      <span className="decision-btn__icon">✓</span> Approve Request
                    </button>
                  </div>
                  
                  <div className="auto-approve-countdown" style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '4px' }}>
                    <strong>⏳ Auto-Approval Status:</strong> 
                    {isExpired 
                      ? ' Processing auto-approval (48 hours elapsed).'
                      : ` This return will automatically approve in ${hoursRemaining} hours if no action is taken.`}
                  </div>
                </div>
              ) : (
                <div className="decision-locked-badge">
                  <span className="decision-locked-icon">🔒</span>
                  <span>Decision Completed ({statusDisplayLabel[returnItem.status]})</span>
                </div>
              )}
            </div>

            {/* Decision Status Callout if already resolved */}
            {!isPending && (
              <div
                className={`decision-callout decision-callout--${returnItem.status
                  .toLowerCase()
                  .replace("_", "-")}`}
              >
                <div className="decision-callout__icon">
                  {returnItem.status === "APPROVED" ||
                  returnItem.status === "AUTO_APPROVED"
                    ? "✓"
                    : "✕"}
                </div>
                <div className="decision-callout__content">
                  <h4 className="decision-callout__title">
                    This return request was marked as{" "}
                    <strong>{statusDisplayLabel[returnItem.status]}</strong>
                  </h4>
                  <p className="decision-callout__meta">
                    Decided by: {returnItem.status === "AUTO_APPROVED" ? "System" : returnItem.decidedBy || "System Policy"}
                    {returnItem.decidedAt &&
                      ` on ${new Date(returnItem.decidedAt).toLocaleDateString()}`}
                  </p>
                  {returnItem.status === "AUTO_APPROVED" && (
                    <div className="decision-callout__reason">
                      <strong>Reason:</strong> Seller did not respond within 48 hours
                    </div>
                  )}
                  {returnItem.rejectionReason && (
                    <div className="decision-callout__reason">
                      <strong>Rejection Reason:</strong>{" "}
                      {returnItem.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="return-detail__grid">
              <div className="return-detail__card">
                <h3 className="return-detail__card-title">Return Information</h3>
                <div className="return-detail__field">
                  <span className="return-detail__label">Return ID</span>
                  <span className="return-detail__value">{returnItem.id}</span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Order ID</span>
                  <span className="return-detail__value">
                    {returnItem.orderId}
                  </span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Request Date</span>
                  <span className="return-detail__value">
                    {new Date(returnItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Status</span>
                  <span className="return-detail__value">
                    <StatusBadge status={returnItem.status} />
                  </span>
                </div>
                {returnItem.decidedAt && (
                  <div className="return-detail__field">
                    <span className="return-detail__label">Decision Date</span>
                    <span className="return-detail__value">
                      {new Date(returnItem.decidedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {returnItem.decidedBy && (
                  <div className="return-detail__field">
                    <span className="return-detail__label">Decided By</span>
                    <span className="return-detail__value">
                      {returnItem.decidedBy}
                    </span>
                  </div>
                )}
              </div>

              <div className="return-detail__card">
                <h3 className="return-detail__card-title">Product Details</h3>
                <div className="return-detail__field">
                  <span className="return-detail__label">Product Name</span>
                  <span className="return-detail__value">
                    {returnItem.product}
                  </span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Customer Name</span>
                  <span className="return-detail__value">
                    {returnItem.customer}
                  </span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Return Reason</span>
                  <span className="return-detail__value">
                    {returnItem.returnReason || "Not specified"}
                  </span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Customer Comments</span>
                  <span className="return-detail__value">
                    {returnItem.customerComments || "None"}
                  </span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Rejection Reason</span>
                  <span
                    className={`return-detail__value ${
                      returnItem.rejectionReason
                        ? "return-detail__value--reason"
                        : "return-detail__value--muted"
                    }`}
                  >
                    {returnItem.rejectionReason || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            {returnItem.auditLogs && returnItem.auditLogs.length > 0 && (
              <div className="return-detail__card" style={{ marginTop: "20px" }}>
                <h3 className="return-detail__card-title">Audit History</h3>
                <div className="recent-returns__table-wrapper">
                  <table className="recent-returns__table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Reason</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnItem.auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td><strong>{log.action}</strong></td>
                          <td>{log.actor}</td>
                          <td className={log.reason ? "" : "return-detail__value--muted"}>
                            {log.reason || "—"}
                          </td>
                          <td>{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="return-detail__actions">
              <Link href="/returns" className="return-detail__back-btn">
                ← Back to Return Requests
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Decision Modal (Approve or Reject) */}
      <DecisionModal
        isOpen={modalType !== null}
        type={modalType}
        returnId={returnItem.id}
        customer={returnItem.customer}
        product={returnItem.product}
        isSubmitting={isSubmitting}
        onClose={() => setModalType(null)}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
}
