export interface ReturnRequest {
  id: string;
  product: string;
  customer: string;
  requested: string;
  status: "Pending" | "Approved" | "Rejected" | "Auto Approved";
}

export interface SummaryCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

export interface DailyActivity {
  day: string;
  value: number;
}

export const summaryCards: SummaryCard[] = [
  {
    title: "Pending Returns",
    value: 24,
    icon: "⏳",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  {
    title: "Approved",
    value: 156,
    icon: "✅",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  {
    title: "Rejected",
    value: 12,
    icon: "❌",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
  {
    title: "Auto Approved",
    value: 89,
    icon: "⚡",
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.1)",
  },
];

export const recentReturns: ReturnRequest[] = [
  {
    id: "RET-1001",
    product: "Wireless Bluetooth Headphones",
    customer: "Aarav Sharma",
    requested: "2026-08-18",
    status: "Pending",
  },
  {
    id: "RET-1002",
    product: "USB-C Charging Cable (3-pack)",
    customer: "Priya Patel",
    requested: "2026-08-17",
    status: "Approved",
  },
  {
    id: "RET-1003",
    product: "Laptop Stand - Adjustable",
    customer: "Rohan Gupta",
    requested: "2026-08-17",
    status: "Rejected",
  },
  {
    id: "RET-1004",
    product: "Mechanical Keyboard RGB",
    customer: "Sneha Reddy",
    requested: "2026-08-16",
    status: "Auto Approved",
  },
  {
    id: "RET-1005",
    product: "Phone Case - Silicone",
    customer: "Vikram Singh",
    requested: "2026-08-16",
    status: "Pending",
  },
  {
    id: "RET-1006",
    product: "Portable Power Bank 20000mAh",
    customer: "Ananya Joshi",
    requested: "2026-08-15",
    status: "Approved",
  },
  {
    id: "RET-1007",
    product: "Smart Watch Band",
    customer: "Karthik Nair",
    requested: "2026-08-14",
    status: "Auto Approved",
  },
];

export const weeklyActivity: DailyActivity[] = [
  { day: "Mon", value: 18 },
  { day: "Tue", value: 25 },
  { day: "Wed", value: 15 },
  { day: "Thu", value: 32 },
  { day: "Fri", value: 22 },
  { day: "Sat", value: 10 },
  { day: "Sun", value: 8 },
];
