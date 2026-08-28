import { ReturnStatus, statusDisplayLabel } from "@/app/types";

const statusConfig: Record<ReturnStatus, { className: string }> = {
  PENDING: { className: "badge--pending" },
  APPROVED: { className: "badge--approved" },
  REJECTED: { className: "badge--rejected" },
  AUTO_APPROVED: { className: "badge--auto-approved" },
};

interface StatusBadgeProps {
  status: ReturnStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { className: "badge--pending" };
  return (
    <span className={`badge ${config.className}`}>
      {statusDisplayLabel[status] || status}
    </span>
  );
}
