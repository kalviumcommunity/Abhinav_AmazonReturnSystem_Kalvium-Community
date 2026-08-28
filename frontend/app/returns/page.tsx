"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNav from "@/app/components/TopNav";
import Sidebar from "@/app/components/Sidebar";
import StatusBadge from "@/app/components/StatusBadge";
import { getAllReturns } from "@/app/services/returnsService";
import {
  ReturnRequest,
  ReturnStatus,
  statusFilters,
  statusDisplayLabel,
} from "@/app/types";

type FilterValue = "All" | ReturnStatus;

function ReturnsContent() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as ReturnStatus) || "All";

  const [allReturns, setAllReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterValue>(
    statusFilters.includes(initialStatus as FilterValue) ? initialStatus : "All"
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllReturns();
        setAllReturns(data);
      } catch (err: any) {
        setError(err.message || "Failed to load return requests.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredReturns = useMemo(() => {
    let results = allReturns;

    // Filter by status
    if (activeFilter !== "All") {
      results = results.filter((r) => r.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.orderId.toLowerCase().includes(query) ||
          r.product.toLowerCase().includes(query) ||
          r.customer.toLowerCase().includes(query)
      );
    }

    return results;
  }, [allReturns, searchQuery, activeFilter]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allReturns.length };
    for (const r of allReturns) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, [allReturns]);

  if (loading) {
    return (
      <main className="dashboard-main">
        <div className="returns-loading">
          <div className="returns-loading__spinner" />
          <p>Loading return requests...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-main">
        <div className="return-detail__not-found">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      {/* Page Header */}
      <div className="dashboard-main__header">
        <h1 className="dashboard-main__title">Return Requests</h1>
        <p className="dashboard-main__welcome">
          View and manage all return requests from your customers.
        </p>
      </div>

      {/* Toolbar: Search + Filters */}
      <div className="returns-toolbar">
        <div className="returns-search">
          <svg className="returns-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by Return ID, Order ID, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="returns-search__input"
          />
          {searchQuery && (
            <button
              className="returns-search__clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="returns-filters">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              className={`returns-filters__btn ${
                activeFilter === filter ? "returns-filters__btn--active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "All" ? "All" : statusDisplayLabel[filter]}
              <span className="returns-filters__count">
                {filterCounts[filter] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="returns-results-info">
        <span>
          Showing <strong>{filteredReturns.length}</strong> of{" "}
          <strong>{allReturns.length}</strong> return requests
        </span>
      </div>

      {/* Table */}
      <div className="returns-table-card">
        <div className="recent-returns__table-wrapper">
          {filteredReturns.length > 0 ? (
            <table className="recent-returns__table">
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((item) => (
                  <tr key={item.id}>
                    <td className="recent-returns__id">{item.id}</td>
                    <td className="returns-table__order-id">{item.orderId}</td>
                    <td>{item.product}</td>
                    <td>{item.customer}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <Link
                        href={`/returns/${item.id}`}
                        className="returns-table__view-btn"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="returns-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="returns-empty__title">No results found</p>
              <p className="returns-empty__desc">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ReturnsPage() {
  return (
    <div className="dashboard-layout">
      <TopNav />
      <div className="dashboard-layout__body">
        <Sidebar />
        <Suspense fallback={<div className="dashboard-main">Loading return requests...</div>}>
          <ReturnsContent />
        </Suspense>
      </div>
    </div>
  );
}
