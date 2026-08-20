import { ReturnRequest } from "@/app/data/mockData";

const statusConfig: Record<ReturnRequest["status"], { className: string }> = {
  Pending: { className: "badge--pending" },
  Approved: { className: "badge--approved" },
  Rejected: { className: "badge--rejected" },
  "Auto Approved": { className: "badge--auto-approved" },
};

interface StatusBadgeProps {
  status: ReturnRequest["status"];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${statusConfig[status].className}`}>
      {status}
    </span>
  );
}
