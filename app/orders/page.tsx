"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: string;
  time: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("pb_orders") || "[]");
    if (savedOrders.length === 0) {
      const initialOrders = [
        { id: "#PB-1001", customer: "Alice Smith", items: "Nasi Lemak Special x2, Teh Tarik x1", total: 28.5, status: "Pending", time: "10:30 AM" },
        { id: "#PB-1002", customer: "John Doe", items: "Nasi Lemak Special x1", total: 12.5, status: "Preparing", time: "10:45 AM" },
        { id: "#PB-1003", customer: "Sarah Connor", items: "Teh Tarik Kaw x3", total: 10.5, status: "Ready", time: "11:00 AM" },
      ];
      setOrders(initialOrders);
      localStorage.setItem("pb_orders", JSON.stringify(initialOrders));
    } else {
      setOrders(savedOrders);
    }
  }, []);

  const updateStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem("pb_orders", JSON.stringify(updated));
  };

  const activeOrders = orders.filter((o) => o.status !== "Completed");
  const completedOrders = orders.filter((o) => o.status === "Completed");

  const mainTabs = [
    { label: "All Active", value: "all" },
    { label: "Pending", value: "Pending" },
    { label: "Preparing", value: "Preparing" },
    { label: "Ready", value: "Ready" },
  ];

  const activeFilteredOrders = filter === "all" 
    ? activeOrders 
    : activeOrders.filter((o) => o.status === filter);

  return (
    <main className="main-content">
      <div className="section-header-modern">
        <div>
          <h1 className="h2">Order Queue</h1>
          <p className="text-muted">Manage active customer orders and progress.</p>
        </div>
      </div>

      <div className="active-switch-container">
        <div className="tab-list-modern">
          {mainTabs.map((tab) => (
            <div
              key={tab.value}
              className={`tab-item-modern ${filter === tab.value ? "active" : ""}`}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      <div className="orders-page-grid">
        {/* Left Section: Active Queue */}
        <div className="orders-queue-section">
          <div id="ordersContainer">
            {activeFilteredOrders.length === 0 ? (
              <div className="card empty-orders-modern">
                <i className="fas fa-clipboard-list"></i>
                <p>No active orders found.</p>
              </div>
            ) : (
              activeFilteredOrders.map((order) => {
                let badgeClass = "badge-pending";
                if (order.status === "Preparing") badgeClass = "badge-preparing";
                if (order.status === "Ready") badgeClass = "badge-ready";

                return (
                  <div key={order.id} className="card order-card-modern">
                    <div className="order-main-info">
                      <div className="order-id-tag">{order.id}</div>
                      <div className="customer-info">
                        <div className="customer-name">{order.customer}</div>
                        <div className="order-items-summary">{order.items}</div>
                      </div>
                    </div>
                    
                    <div className="order-meta-info">
                      <div className="order-amount">RM {parseFloat(order.total.toString()).toFixed(2)}</div>
                      <div className="order-time-badge">
                        <i className="far fa-clock"></i> {order.time}
                      </div>
                    </div>

                    <div className="order-actions-row">
                      <span className={`badge-modern ${badgeClass}`}>{order.status}</span>
                      <select
                        className="status-select-modern"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready for Pickup</option>
                        <option value="Completed">Complete Order</option>
                      </select>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Section: History Sidebar */}
        <div className="orders-history-sidebar">
          <div className="sidebar-header-modern">
            <div className="header-with-icon">
              <div className="history-icon-box">
                <i className="fas fa-history"></i>
              </div>
              <div>
                <h3>Order History</h3>
                <p className="subtitle">Recently completed</p>
              </div>
            </div>
          </div>

          <div className="history-feed">
            {completedOrders.length === 0 ? (
              <div className="empty-history">
                <p>No history yet.</p>
              </div>
            ) : (
              completedOrders.sort((a, b) => b.time.localeCompare(a.time)).map((order) => (
                <div key={order.id} className="history-item">
                  <div className="history-item-top">
                    <span className="history-id">{order.id}</span>
                    <span className="history-time">{order.time}</span>
                  </div>
                  <div className="history-customer">{order.customer}</div>
                  <div className="history-footer">
                    <span className="history-total">RM {parseFloat(order.total.toString()).toFixed(2)}</span>
                    <span className="history-status">
                      <i className="fas fa-check-circle"></i> Done
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button className="view-all-history-btn">
            View All Activity
          </button>
        </div>
      </div>
    </main>
  );
}
