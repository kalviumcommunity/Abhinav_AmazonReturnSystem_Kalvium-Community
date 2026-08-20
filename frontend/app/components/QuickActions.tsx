"use client";

import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  onClick?: () => void;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: "Review Pending Returns",
      description: "24 returns awaiting review",
      color: "#f59e0b",
      href: "/returns?status=Pending",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
          <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="9" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Export Return Report",
      description: "Download CSV or PDF report",
      color: "#10b981",
      onClick: () => {
        alert("Export Return Report: CSV report generated (mock data).");
      },
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "View All Requests",
      description: "Browse complete return history",
      color: "#6366f1",
      href: "/returns",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="quick-actions">
      <h3 className="quick-actions__title">Quick Actions</h3>
      <div className="quick-actions__list">
        {actions.map((action) => {
          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className="quick-actions__btn">
                <span className="quick-actions__btn-icon" style={{ color: action.color }}>
                  {action.icon}
                </span>
                <div className="quick-actions__btn-text">
                  <span className="quick-actions__btn-label">{action.label}</span>
                  <span className="quick-actions__btn-desc">{action.description}</span>
                </div>
                <svg className="quick-actions__btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            );
          }

          return (
            <button key={action.label} onClick={action.onClick} className="quick-actions__btn">
              <span className="quick-actions__btn-icon" style={{ color: action.color }}>
                {action.icon}
              </span>
              <div className="quick-actions__btn-text">
                <span className="quick-actions__btn-label">{action.label}</span>
                <span className="quick-actions__btn-desc">{action.description}</span>
              </div>
              <svg className="quick-actions__btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
