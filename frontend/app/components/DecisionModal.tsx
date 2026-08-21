"use client";

import { useState, useEffect } from "react";

interface DecisionModalProps {
  isOpen: boolean;
  type: "approve" | "reject" | null;
  returnId: string;
  customer: string;
  product: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmApprove: () => void;
  onConfirmReject: (reason: string) => void;
}

const quickReasons = [
  "Item outside 30-day return policy window",
  "Item returned in damaged/altered condition",
  "Missing original packaging, tags, or accessories",
  "Serial number mismatch with original shipment",
  "Item is non-returnable per category policy",
];

export default function DecisionModal({
  isOpen,
  type,
  returnId,
  customer,
  product,
  isSubmitting,
  onClose,
  onConfirmApprove,
  onConfirmReject,
}: DecisionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen, type]);

  if (!isOpen || !type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "approve") {
      onConfirmApprove();
    } else {
      if (!reason.trim()) {
        setError("Please provide a reason for rejecting this return request.");
        return;
      }
      onConfirmReject(reason.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header__title-group">
            <span
              className={`modal-header__icon ${
                type === "approve"
                  ? "modal-header__icon--approve"
                  : "modal-header__icon--reject"
              }`}
            >
              {type === "approve" ? "✓" : "✕"}
            </span>
            <div>
              <h2 id="modal-title" className="modal-title">
                {type === "approve"
                  ? "Approve Return Request"
                  : "Reject Return Request"}
              </h2>
              <p className="modal-subtitle">
                Return ID: <strong>{returnId}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-summary">
              <div className="modal-summary__row">
                <span className="modal-summary__label">Product</span>
                <span className="modal-summary__value">{product}</span>
              </div>
              <div className="modal-summary__row">
                <span className="modal-summary__label">Customer</span>
                <span className="modal-summary__value">{customer}</span>
              </div>
            </div>

            {type === "approve" ? (
              <p className="modal-text">
                Are you sure you want to approve this return request? Once
                approved, the return authorization will be issued to the customer.
              </p>
            ) : (
              <div className="modal-form-group">
                <label htmlFor="rejection-reason" className="modal-label">
                  Rejection Reason <span className="modal-required">*</span>
                </label>
                <p className="modal-hint">
                  Specify why this return request cannot be accepted. This explanation
                  will be recorded in the audit log and shared with the customer.
                </p>

                <div className="modal-quick-reasons">
                  <span className="modal-quick-reasons__label">Quick templates:</span>
                  <div className="modal-quick-reasons__pills">
                    {quickReasons.map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        className="modal-quick-pill"
                        onClick={() => {
                          setReason(qr);
                          setError("");
                        }}
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="rejection-reason"
                  rows={4}
                  className={`modal-textarea ${error ? "modal-textarea--error" : ""}`}
                  placeholder="Type or select a detailed rejection reason..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isSubmitting}
                />
                {error && <span className="modal-error-msg">{error}</span>}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn modal-btn--secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`modal-btn ${
                type === "approve"
                  ? "modal-btn--approve"
                  : "modal-btn--reject"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : type === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
