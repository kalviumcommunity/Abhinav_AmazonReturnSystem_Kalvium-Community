import { ReturnRequest } from "@/app/data/mockData";

interface RecentReturnsTableProps {
  returns: ReturnRequest[];
}

const statusConfig: Record<ReturnRequest["status"], { className: string }> = {
  Pending: { className: "badge--pending" },
  Approved: { className: "badge--approved" },
  Rejected: { className: "badge--rejected" },
  "Auto Approved": { className: "badge--auto-approved" },
};

export default function RecentReturnsTable({ returns }: RecentReturnsTableProps) {
  return (
    <div className="recent-returns">
      <div className="recent-returns__header">
        <h3 className="recent-returns__title">Recent Return Requests</h3>
        <a href="#" className="recent-returns__view-all">View All →</a>
      </div>
      <div className="recent-returns__table-wrapper">
        <table className="recent-returns__table">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Requested</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((item) => (
              <tr key={item.id}>
                <td className="recent-returns__id">{item.id}</td>
                <td>{item.product}</td>
                <td>{item.customer}</td>
                <td>{item.requested}</td>
                <td>
                  <span className={`badge ${statusConfig[item.status].className}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
