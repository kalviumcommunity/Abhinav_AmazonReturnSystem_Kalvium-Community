import { SummaryCard as SummaryCardType } from "@/app/data/mockData";

interface SummaryCardProps {
  card: SummaryCardType;
}

export default function SummaryCard({ card }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="summary-card__icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
        <span>{card.icon}</span>
      </div>
      <div className="summary-card__content">
        <p className="summary-card__title">{card.title}</p>
        <p className="summary-card__value" style={{ color: card.color }}>{card.value}</p>
      </div>
    </div>
  );
}
