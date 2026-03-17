"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SalesPage() {
  const [salesData, setSalesData] = useState({
    totalSales: "RM 0.00",
    orderCount: 0,
    averageOrderValue: "RM 0.00",
  });

  useEffect(() => {
    // Load data from localStorage
    const orders = JSON.parse(localStorage.getItem("pb_orders") || "[]");
    
    // Calculate basic sales metrics
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
            <div className="stat-label-modern">Total Sales</div>
            <div className="stat-value-modern">{salesData.totalSales}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Total Orders</div>
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

      <div className="card mt-20">
        <h3 className="mb-15">Sales Performance Overview</h3>
        <div className="p-30 text-center text-muted border-dashed-modern">
          <i className="fas fa-chart-area fs-xl opacity-10 mb-10"></i>
          <p>Detailed sales charts and analytics are coming soon.</p>
        </div>
      </div>
    </main>
  );
}
