import { ReturnRequest } from "@/app/data/mockData";
import StatusBadge from "@/app/components/StatusBadge";
import Link from "next/link";

interface RecentReturnsTableProps {
  returns: ReturnRequest[];
}

export default function RecentReturnsTable({ returns }: RecentReturnsTableProps) {
  return (
    <div className="recent-returns">
      <div className="recent-returns__header">
        <h3 className="recent-returns__title">Recent Return Requests</h3>
        <Link href="/returns" className="recent-returns__view-all">View All →</Link>
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
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
