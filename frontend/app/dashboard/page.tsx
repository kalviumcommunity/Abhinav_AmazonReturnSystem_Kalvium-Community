import TopNav from "@/app/components/TopNav";
import Sidebar from "@/app/components/Sidebar";
import SummaryCard from "@/app/components/SummaryCard";
import ReturnActivityChart from "@/app/components/ReturnActivityChart";
import QuickActions from "@/app/components/QuickActions";
import RecentReturnsTable from "@/app/components/RecentReturnsTable";
import {
  summaryCards,
  recentReturns,
  weeklyActivity,
} from "@/app/data/mockData";

export default function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <TopNav />
      <div className="dashboard-layout__body">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-main__header">
            <h1 className="dashboard-main__title">Seller Dashboard</h1>
            <p className="dashboard-main__welcome">
              Welcome back, <strong>Abhinav</strong>! Here&apos;s your return management overview.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards-grid">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} card={card} />
            ))}
          </div>

          {/* Activity + Quick Actions */}
          <div className="dashboard-middle">
            <ReturnActivityChart data={weeklyActivity} />
            <QuickActions />
          </div>

          {/* Recent Returns Table */}
          <RecentReturnsTable returns={recentReturns} />
        </main>
      </div>
    </div>
  );
}
