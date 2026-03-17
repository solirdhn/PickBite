"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  type: 'Dine In' | 'Take Away';
  tableNumber?: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod?: string;
  time: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("pb_orders") || "[]");
    
    // Check if saved orders have the new structure or if we need to expand to 5 active orders or rename Nasi Lemak
    const needsReset = (savedOrders.length > 0 && typeof savedOrders[0].items === 'string') || 
                       savedOrders.filter((o: any) => o.status !== 'Completed').length < 3 ||
                       savedOrders.some((o: any) => o.items.some((i: any) => i.name === 'Nasi Lemak Special'));

    if (savedOrders.length === 0 || needsReset) {
      const initialOrders: Order[] = [
        { 
          id: "#PB-1001", 
          customer: "Alice Smith", 
          type: "Dine In",
          tableNumber: "05",
          items: [
            { name: "Nasi Lemak", quantity: 2, price: 12.0 },
            { name: "Teh Tarik", quantity: 1, price: 4.5 }
          ], 
          total: 28.5, 
          status: "Pending", 
          time: "10:30 AM" 
        },
        { 
          id: "#PB-1002", 
          customer: "John Doe", 
          type: "Take Away",
          items: [
            { name: "Nasi Lemak", quantity: 1, price: 12.5 }
          ], 
          total: 12.5, 
          status: "Preparing", 
          time: "10:45 AM" 
        },
        { 
          id: "#PB-1003", 
          customer: "Sarah Connor", 
          type: "Dine In",
          tableNumber: "12",
          items: [
            { name: "Teh Tarik Kaw", quantity: 3, price: 3.5 }
          ], 
          total: 10.5, 
          status: "Ready", 
          time: "11:00 AM" 
        },
        { 
          id: "#PB-1004", 
          customer: "Tony Stark", 
          type: "Dine In",
          tableNumber: "01",
          items: [
            { name: "Nasi Lemak", quantity: 3, price: 12.0 },
            { name: "Kopi O", quantity: 2, price: 3.0 }
          ], 
          total: 42.0, 
          status: "Pending", 
          time: "11:15 AM" 
        },
        { 
          id: "#PB-1005", 
          customer: "Peter Parker", 
          type: "Take Away",
          items: [
            { name: "Nasi Lemak", quantity: 2, price: 12.5 }
          ], 
          total: 25.0, 
          status: "Preparing", 
          time: "11:30 AM" 
        },
        { 
          id: "#PB-0999", 
          customer: "Bruce Wayne", 
          type: "Dine In",
          tableNumber: "02",
          items: [
            { name: "Nasi Lemak", quantity: 1, price: 12.0 },
            { name: "Teh Tarik", quantity: 2, price: 4.5 }
          ], 
          total: 21.0, 
          status: "Completed", 
          time: "09:45 AM" 
        },
        { 
          id: "#PB-0998", 
          customer: "Diana Prince", 
          type: "Take Away",
          items: [
            { name: "Teh Tarik Kaw", quantity: 4, price: 3.5 }
          ], 
          total: 14.0, 
          status: "Completed", 
          time: "09:15 AM" 
        },
      ];
      setOrders(initialOrders);
      localStorage.setItem("pb_orders", JSON.stringify(initialOrders));
    } else {
      setOrders(savedOrders);
    }
  }, []);

  const updateStatus = (orderId: string, newStatus: string) => {
    if (newStatus === "delete") {
      deleteOrder(orderId);
      return;
    }
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem("pb_orders", JSON.stringify(updated));
  };

  const deleteOrder = (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem("pb_orders", JSON.stringify(updated));
    if (selectedOrderId === orderId) setSelectedOrderId(null);
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
    <main className="main-content orders-page">
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
          <h1>Order Queue</h1>
          <p className="text-muted">Manage active customer orders and progress.</p>
        </section>
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
                  <div 
                    key={order.id} 
                    className={`card order-card-modern ${selectedOrderId === order.id ? "selected" : ""}`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <div className="order-id-section flex flex-column gap-02">
                      <div className="order-id-tag-simple">
                        {order.id}
                      </div>
                      <div className="order-type-badge-simple">
                        {order.type === 'Dine In' ? `Table ${order.tableNumber || '??'}` : 'Take Away'}
                      </div>
                    </div>

                    <div className="order-items-summary px-1 border-left border-right">
                      {order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}
                    </div>

                    <div className="order-meta-info text-center px-1 border-right">
                      <div className="fw-bold fs-md">RM {parseFloat(order.total.toString()).toFixed(2)}</div>
                      <div className="text-muted fs-xs mt-02">
                        <i className="far fa-clock"></i> {order.time}
                      </div>
                    </div>

                    <div className="order-actions-row flex flex-column gap-05 flex-align-end">
                      <span className={`badge-modern ${badgeClass}`}>{order.status}</span>
                      <select
                        id={`status-${order.id}`}
                        className="status-select-modern w-full"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        aria-label={`Change status for order ${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready for Pickup</option>
                        <option value="Completed">Complete Order</option>
                        <option disabled>──────────</option>
                        <option value="delete" className="text-danger">Delete Order</option>
                      </select>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Section: Sidebar (History or Details) */}
        <div className="orders-sidebar-container">
          {!selectedOrderId ? (
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
                      <div className="history-footer">
                        <span className="history-total">RM {parseFloat(order.total.toString()).toFixed(2)}</span>
                        <span className="fs-xs fw-bold text-muted">{order.type}</span>
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
          ) : (
            <div className="order-details-sidebar">
              {(() => {
                const selectedOrder = orders.find(o => o.id === selectedOrderId);
                if (!selectedOrder) return null;
                
                return (
                  <>
                    <div className="sidebar-header-modern details-header">
                      <button 
                        className="back-to-history-btn" 
                        onClick={() => setSelectedOrderId(null)}
                        aria-label="Back to order history"
                      >
                        <i className="fas fa-arrow-left"></i>
                      </button>
                      <div className="header-with-icon">
                        <div className="details-icon-box">
                          <i className="fas fa-receipt"></i>
                        </div>
                        <div>
                          <h3>Order Details</h3>
                          <p className="subtitle">{selectedOrder.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="details-body">
                      <div className="details-section">
                        <label>Customer</label>
                        <p className="details-value fw-bold">{selectedOrder.customer}</p>
                      </div>

                      <div className="details-section">
                        <label>Service Type</label>
                        <p className="details-value">
                          {selectedOrder.type === 'Dine In' 
                            ? `Dine In (Table ${selectedOrder.tableNumber || 'N/A'})` 
                            : 'Take Away'}
                        </p>
                      </div>

                      <div className="details-divider"></div>

                      <div className="details-section">
                        <label>Items</label>
                        <div className="details-items-list">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="details-item-row">
                              <span className="item-qty-name">
                                <span className="item-qty">{item.quantity}x</span>
                                <span className="item-name">{item.name}</span>
                              </span>
                              <span className="item-price">RM {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="details-divider"></div>

                      <div className="details-total-row">
                        <span>Total Amount</span>
                        <span className="total-amount">RM {parseFloat(selectedOrder.total.toString()).toFixed(2)}</span>
                      </div>
                      
                      <div className="details-footer-actions">
                         <div className="details-section">
                          <label>Status</label>
                          <div className={`details-status-badge ${selectedOrder.status.toLowerCase()}`}>
                            {selectedOrder.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
