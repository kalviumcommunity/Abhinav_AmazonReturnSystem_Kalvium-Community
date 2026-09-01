"use client";

import { useEffect, useState, useMemo } from "react";
import TopNav from "@/app/components/TopNav";
import Sidebar from "@/app/components/Sidebar";
import SummaryCard from "@/app/components/SummaryCard";
import ReturnActivityChart from "@/app/components/ReturnActivityChart";
import QuickActions from "@/app/components/QuickActions";
import RecentReturnsTable from "@/app/components/RecentReturnsTable";
import { getAllReturns } from "@/app/services/returnsService";
import { useAuth } from "@/app/context/AuthContext";
import { ReturnRequest, SummaryCardData, DailyActivity } from "@/app/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllReturns();
        setReturns(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate summary card counts from real data
  const summaryCards: SummaryCardData[] = useMemo(() => {
    const pending = returns.filter((r) => r.status === "PENDING").length;
    const approved = returns.filter((r) => r.status === "APPROVED").length;
    const rejected = returns.filter((r) => r.status === "REJECTED").length;
    const autoApproved = returns.filter((r) => r.status === "AUTO_APPROVED").length;

    return [
      {
        title: "Pending Returns",
        value: pending,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        title: "Approved",
        value: approved,
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
      {
        title: "Rejected",
        value: rejected,
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
      },
      {
        title: "Auto Approved",
        value: autoApproved,
        color: "#6366f1",
        bgColor: "rgba(99, 102, 241, 0.1)",
      },
    ];
  }, [returns]);

  // Calculate 7-day activity from real createdAt values
  const weeklyActivity: DailyActivity[] = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: Record<string, number> = {};

    // Initialize the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = dayNames[d.getDay()];
      counts[label] = 0;
    }

    // Count returns created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    for (const r of returns) {
      const created = new Date(r.createdAt);
      if (created >= sevenDaysAgo) {
        const label = dayNames[created.getDay()];
        if (label in counts) {
          counts[label]++;
        }
      }
    }

    // Return in order (last 7 days)
    const result: DailyActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = dayNames[d.getDay()];
      // Only add if not already added (handles duplicate day names)
      if (!result.find((x) => x.day === label)) {
        result.push({ day: label, value: counts[label] || 0 });
      }
    }
    return result;
  }, [returns]);

  // Most recent 7 returns for the table
  const recentReturns = useMemo(() => {
    return [...returns]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 7);
  }, [returns]);

  const displayName = user?.name || "Seller";

  return (
    <div className="dashboard-layout">
      <TopNav />
      <div className="dashboard-layout__body">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-main__header">
            <h1 className="dashboard-main__title">Seller Dashboard</h1>
            <p className="dashboard-main__welcome">
              Welcome back, <strong>{displayName}</strong>! Here&apos;s your
              return management overview.
            </p>
          </div>

          {loading ? (
            <div className="returns-loading">
              <div className="returns-loading__spinner" />
              <p>Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="return-detail__not-found">
              <h1>Error</h1>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="summary-cards-grid">
                {summaryCards.map((card) => (
                  <SummaryCard key={card.title} card={card} />
                ))}
              </div>

              {/* Activity + Quick Actions */}
              <div className="dashboard-middle">
                <ReturnActivityChart data={weeklyActivity} />
                <QuickActions pendingCount={summaryCards[0].value as number} />
              </div>

              {/* Recent Returns Table */}
              <RecentReturnsTable returns={recentReturns} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
