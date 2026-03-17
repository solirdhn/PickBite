import { NextResponse } from "next/server";

export async function GET() {
  // In a real system, this would fetch from a database (PostgreSQL, MongoDB, etc.)
  // For now, we return mock data that matches the dashboard's needs.
  
  const stats = {
    totalOrders: 156,
    totalRevenue: "RM 2,450.00",
    pendingOrders: 8,
    totalMenuItems: 24,
    recentOrders: [
       { id: "#PB-2001", customer: "Michael Chen", status: "Pending", total: "RM 45.00" },
       { id: "#PB-2002", customer: "Sarah Lee", status: "Preparing", total: "RM 12.50" }
    ]
  };

  return NextResponse.json(stats);
}
