import React from "react";
import { SummaryCard as SummaryCardType } from "@/app/data/mockData";

interface SummaryCardProps {
  card: SummaryCardType;
}

function getCardIcon(title: string) {
  switch (title) {
    case "Pending Returns":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "Approved":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "Rejected":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "Auto Approved":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function SummaryCard({ card }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="summary-card__icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
        {getCardIcon(card.title)}
      </div>
      <div className="summary-card__content">
        <p className="summary-card__title">{card.title}</p>
        <p className="summary-card__value" style={{ color: card.color }}>{card.value}</p>
      </div>
    </div>
  );
}
