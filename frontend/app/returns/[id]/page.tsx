import Link from "next/link";
import TopNav from "@/app/components/TopNav";
import Sidebar from "@/app/components/Sidebar";
import StatusBadge from "@/app/components/StatusBadge";
import { allReturnRequests } from "@/app/data/mockData";

interface ReturnDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReturnDetailPage({ params }: ReturnDetailPageProps) {
  const { id } = await params;
  const returnItem = allReturnRequests.find((r) => r.id === id);

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
                <p>The return request <strong>{id}</strong> does not exist.</p>
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
            <span className="return-detail__breadcrumb-current">{returnItem.id}</span>
          </div>

          <div className="return-detail">
            {/* Header */}
            <div className="return-detail__header">
              <div>
                <h1 className="return-detail__title">
                  Return Request {returnItem.id}
                </h1>
                <p className="return-detail__subtitle">
                  Submitted on {returnItem.requested}
                </p>
              </div>
              <StatusBadge status={returnItem.status} />
            </div>

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
                  <span className="return-detail__value">{returnItem.orderId}</span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Request Date</span>
                  <span className="return-detail__value">{returnItem.requested}</span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Status</span>
                  <span className="return-detail__value">
                    <StatusBadge status={returnItem.status} />
                  </span>
                </div>
              </div>

              <div className="return-detail__card">
                <h3 className="return-detail__card-title">Product Details</h3>
                <div className="return-detail__field">
                  <span className="return-detail__label">Product</span>
                  <span className="return-detail__value">{returnItem.product}</span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Customer</span>
                  <span className="return-detail__value">{returnItem.customer}</span>
                </div>
                <div className="return-detail__field">
                  <span className="return-detail__label">Reason</span>
                  <span className="return-detail__value return-detail__value--muted">
                    Not available (placeholder)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="return-detail__actions">
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
