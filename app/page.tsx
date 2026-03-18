"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Order {
  id: string;
  customer: string;
  status: string;
  total: string;
  type?: string;
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
            <div className="stat-label-modern">Total Orders</div>
            <div className="stat-value-modern">{stats.totalOrders}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Today&apos;s Revenue</div>
            <div className="stat-value-modern">{stats.totalRevenue}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Pending Orders</div>
            <div className="stat-value-modern">{stats.pendingOrders}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Menu Items</div>
            <div className="stat-value-modern">{stats.totalMenuItems}</div>
          </div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <h3 className="mb-15">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
          <div className="modern-list">
            <div className="list-header-modern">
               <div className="col-info">Order Details</div>
               <div className="col-status">Status</div>
               <div className="col-total">Total</div>
            </div>
            <div className="list-body-modern">
              {recentOrders.map((order) => (
                <div key={order.id} className="list-row-modern">
                  <div className="col-info">
                    <div className="order-customer-name">{order.id}</div>
                    <div className="order-id-subtext">{order.type || "Dine In"}</div>
                  </div>
                  <div className="col-status">
                    <span className={`status-badge-modern ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="col-total">
                    <span className="order-total-value">RM {parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
        <div className="card qr-merchant-card">
          <h3 className="mb-15 text-center">Merchant QR</h3>
          <div className="qr-content-wrapper">
            <div className="qr-image-container">
              <Image 
                src="/merchant_qr.png" 
                alt="Merchant QR" 
                width={200} 
                height={200}
                className="qr-image-style"
              />
            </div>
            <div className="qr-instruction-box">
              <i className="fas fa-qrcode mr-2"></i>
              <span>Scan to do a payment</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
