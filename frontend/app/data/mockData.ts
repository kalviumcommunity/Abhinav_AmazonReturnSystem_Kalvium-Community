export type ReturnStatus = "Pending" | "Approved" | "Rejected" | "Auto Approved";

export interface ReturnRequest {
  id: string;
  orderId: string;
  product: string;
  customer: string;
  requested: string;
  status: ReturnStatus;
}

export const statusFilters: Array<"All" | ReturnStatus> = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Auto Approved",
];

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
    orderId: "ORD-40921",
    product: "Wireless Bluetooth Headphones",
    customer: "Aarav Sharma",
    requested: "2026-08-18",
    status: "Pending",
  },
  {
    id: "RET-1002",
    orderId: "ORD-40856",
    product: "USB-C Charging Cable (3-pack)",
    customer: "Priya Patel",
    requested: "2026-08-17",
    status: "Approved",
  },
  {
    id: "RET-1003",
    orderId: "ORD-40834",
    product: "Laptop Stand - Adjustable",
    customer: "Rohan Gupta",
    requested: "2026-08-17",
    status: "Rejected",
  },
  {
    id: "RET-1004",
    orderId: "ORD-40798",
    product: "Mechanical Keyboard RGB",
    customer: "Sneha Reddy",
    requested: "2026-08-16",
    status: "Auto Approved",
  },
  {
    id: "RET-1005",
    orderId: "ORD-40765",
    product: "Phone Case - Silicone",
    customer: "Vikram Singh",
    requested: "2026-08-16",
    status: "Pending",
  },
  {
    id: "RET-1006",
    orderId: "ORD-40712",
    product: "Portable Power Bank 20000mAh",
    customer: "Ananya Joshi",
    requested: "2026-08-15",
    status: "Approved",
  },
  {
    id: "RET-1007",
    orderId: "ORD-40689",
    product: "Smart Watch Band",
    customer: "Karthik Nair",
    requested: "2026-08-14",
    status: "Auto Approved",
  },
];

export const allReturnRequests: ReturnRequest[] = [
  ...recentReturns,
  {
    id: "RET-1008",
    orderId: "ORD-40650",
    product: "Yoga Mat - Premium",
    customer: "Deepa Menon",
    requested: "2026-08-13",
    status: "Approved",
  },
  {
    id: "RET-1009",
    orderId: "ORD-40623",
    product: "LED Desk Lamp",
    customer: "Arjun Kapoor",
    requested: "2026-08-13",
    status: "Pending",
  },
  {
    id: "RET-1010",
    orderId: "ORD-40598",
    product: "Noise Cancelling Earbuds",
    customer: "Meera Iyer",
    requested: "2026-08-12",
    status: "Rejected",
  },
  {
    id: "RET-1011",
    orderId: "ORD-40567",
    product: "Backpack - Waterproof",
    customer: "Rahul Verma",
    requested: "2026-08-12",
    status: "Auto Approved",
  },
  {
    id: "RET-1012",
    orderId: "ORD-40534",
    product: "Wireless Mouse",
    customer: "Kavya Deshmukh",
    requested: "2026-08-11",
    status: "Approved",
  },
  {
    id: "RET-1013",
    orderId: "ORD-40510",
    product: "HDMI Cable 2m",
    customer: "Nikhil Rao",
    requested: "2026-08-11",
    status: "Pending",
  },
  {
    id: "RET-1014",
    orderId: "ORD-40489",
    product: "Stainless Steel Water Bottle",
    customer: "Tanvi Kulkarni",
    requested: "2026-08-10",
    status: "Rejected",
  },
  {
    id: "RET-1015",
    orderId: "ORD-40455",
    product: "Webcam HD 1080p",
    customer: "Siddharth Mehta",
    requested: "2026-08-10",
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
