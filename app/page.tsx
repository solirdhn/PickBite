"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Order {
  id: string;
  customer: string;
  status: string;
  total: string;
}

interface MenuItem {
  name: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: "RM 0.00",
    pendingOrders: 0,
    totalMenuItems: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const menuItems = JSON.parse(localStorage.getItem("pb_menu") || "[]");
    const orders = JSON.parse(localStorage.getItem("pb_orders") || "[]");

    // Calculate Stats
    const totalOrders = orders.length;
    const totalMenuItems = menuItems.length;
    const revenue = orders.reduce(
      (acc: number, curr: Order) => acc + parseFloat(curr.total),
      0
    );
    const pendingOrders = orders.filter((o: Order) => o.status === "Pending").length;

    setStats({
      totalOrders,
      totalRevenue: `RM ${revenue.toFixed(2)}`,
      pendingOrders,
      totalMenuItems,
    });

    setRecentOrders(orders.slice(-5).reverse());
    setPopularItems(menuItems.slice(0, 3));
  }, []);

  return (
    <main className="main-content">
      <div className="welcome-header-container">
        <div className="dashboard-logo-large">
          <Image 
            src="/PickBiteLogo.png" 
            alt="PickBite Logo" 
            width={256} 
            height={129}
            priority
          />
        </div>
        <div className="welcome-divider"></div>
        <section className="welcome-section">
          <h1>
            Welcome back,{" "}
            <span style={{ color: "var(--pb-primary)" }}>Bite Bistro</span>!
          </h1>
          <p>Here&apos;s what happening with your restaurant today.</p>
        </section>
      </div>

      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{stats.totalOrders}</div>
            <div className="stat-label-modern">Total Orders</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{stats.totalRevenue}</div>
            <div className="stat-label-modern">Today&apos;s Revenue</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{stats.pendingOrders}</div>
            <div className="stat-label-modern">Pending Orders</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-value-modern">{stats.totalMenuItems}</div>
            <div className="stat-label-modern">Menu Items</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ marginBottom: "1.5rem" }}>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No orders yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Customer</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <td style={{ padding: "12px", fontWeight: 600 }}>{order.id}</td>
                    <td style={{ padding: "12px" }}>{order.customer}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--pb-primary)",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontWeight: 700 }}>
                      RM {parseFloat(order.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: "1.5rem" }}>Popular Items</h3>
          {popularItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>Add menu items first.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {popularItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{item.name}</span>
                  <span
                    className="btn-primary"
                    style={{
                      padding: "2px 10px",
                      fontSize: "0.8rem",
                      borderRadius: "4px",
                    }}
                  >
                    Popular
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
