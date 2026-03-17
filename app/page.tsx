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
    const menuItems = JSON.parse(localStorage.getItem("pb_menu_data") || "[]");
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
    <main className="main-content dashboard-page">
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
          <h1>
            Welcome back,{" "}
            <span className="text-primary">Bite Bistro</span>!
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

      <div className="grid-2-1">
        <div className="card">
          <h3 className="mb-15">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-center border-bottom text-muted fs-sm">
                  <th className="p-2">ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-bottom">
                    <td className="p-2 fw-semibold">{order.id}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">
                      <span className="fs-xs fw-bold text-primary">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2 fw-bold">
                      RM {parseFloat(order.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <h3 className="mb-15">Popular Items</h3>
          {popularItems.length === 0 ? (
            <p className="text-muted">Add menu items first.</p>
          ) : (
            <div className="flex-column gap-1">
              {popularItems.map((item, index) => (
                <div key={index} className="flex-between flex-align-center">
                  <span>{item.name}</span>
                  <span className="btn-primary fs-sm badge-pill">
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
