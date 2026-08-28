"use client";

import { DailyActivity } from "@/app/types";

interface ReturnActivityChartProps {
  data: DailyActivity[];
}

export default function ReturnActivityChart({ data }: ReturnActivityChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="activity-chart">
      <div className="activity-chart__header">
        <h3 className="activity-chart__title">Return Activity</h3>
        <span className="activity-chart__subtitle">Last 7 days</span>
      </div>
      <div className="activity-chart__body">
        {data.map((item) => {
          const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={item.day} className="activity-chart__bar-group">
              <div className="activity-chart__bar-container">
                <div
                  className="activity-chart__bar"
                  style={{ height: `${heightPercent}%` }}
                >
                  <span className="activity-chart__bar-value">{item.value}</span>
                </div>
              </div>
              <span className="activity-chart__bar-label">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
