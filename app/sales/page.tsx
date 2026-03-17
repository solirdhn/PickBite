"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SalesHistoryItem {
  date: string;
  orders: number;
  revenue: number;
}

export default function SalesPage() {
  const [salesData, setSalesData] = useState({
    totalSales: "RM 0.00",
    orderCount: 0,
    averageOrderValue: "RM 0.00",
  });

  const [history, setHistory] = useState<SalesHistoryItem[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const orders = JSON.parse(localStorage.getItem("pb_orders") || "[]");
    
    // Calculate basic sales metrics for today
    const totalRevenue = orders.reduce(
      (acc: number, curr: any) => acc + parseFloat(curr.total || 0),
      0
    );
    const orderCount = orders.length;
    const avgValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    setSalesData({
      totalSales: `RM ${totalRevenue.toFixed(2)}`,
      orderCount: orderCount,
      averageOrderValue: `RM ${avgValue.toFixed(2)}`,
    });

    // Generate Mock History for the last 4 days
    const mockHistory: SalesHistoryItem[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 4; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        
        const dateStr = d.toLocaleDateString('en-MY', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        });

        // Semi-random but realistic data
        const dailyOrders = Math.floor(Math.random() * 20) + 10; // 10-30 orders
        const dailyRevenue = dailyOrders * (Math.random() * 10 + 15); // Avg RM 15-25 per order

        mockHistory.push({
            date: i === 1 ? "Yesterday" : dateStr,
            orders: dailyOrders,
            revenue: dailyRevenue
        });
    }
    setHistory(mockHistory);
  }, []);

  return (
    <main className="main-content sales-page">
      <div className="welcome-header-container">
        <div className="dashboard-logo-large">
          <Image
            src="/PickBiteLogo.png"
            alt="PickBite Logo"
            width={276}
            height={139}
            priority
          />
        </div>
        <div className="welcome-divider"></div>
        <section className="welcome-section">
          <h1>Sales Analytics</h1>
          <p className="text-muted">Track your restaurant&apos;s financial performance and trends.</p>
        </section>
      </div>

      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Total Sales (Today)</div>
            <div className="stat-value-modern">{salesData.totalSales}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Total Orders (Today)</div>
            <div className="stat-value-modern">{salesData.orderCount}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-calculator"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Avg. Order Value</div>
            <div className="stat-value-modern">{salesData.averageOrderValue}</div>
          </div>
        </div>
      </div>

      <div className="grid-2-1 mt-20">
        <div className="card">
          <h3 className="mb-15">Sales History (Last 4 Days)</h3>
          <div className="modern-list">
            <div className="list-header-modern">
                <div className="col-info">Date</div>
                <div className="col-status">Orders</div>
                <div className="col-total">Revenue</div>
            </div>
            <div className="list-body-modern">
                {history.map((day, idx) => (
                    <div key={idx} className="list-row-modern">
                        <div className="col-info">
                            <div className="order-customer-name">{day.date}</div>
                        </div>
                        <div className="col-status">
                            <span className="status-badge-modern completed">
                                {day.orders} Orders
                            </span>
                        </div>
                        <div className="col-total">
                            <span className="order-total-value">RM {day.revenue.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="card">
            <h3 className="mb-15">Analytics Insights</h3>
            <div className="p-20 text-center text-muted border-dashed-modern">
                <i className="fas fa-lightbulb fs-xl opacity-10 mb-10 text-primary"></i>
                <p className="fs-sm">Trends show highest sales on weekends. Consider running promotions on weekdays!</p>
            </div>
        </div>
      </div>
    </main>
  );
}
