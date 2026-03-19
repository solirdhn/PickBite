"use client";

import { useState } from "react";
import Image from "next/image";

interface Notification {
  id: string;
  type: "STAFF" | "ORDER" | "READY" | "SYSTEM";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "STAFF",
    title: "Staff Clock-In",
    message: "Sarah Jenkins clocked in for the morning shift.",
    time: "5 mins ago",
    unread: true,
    icon: "fa-user-clock",
  },
  {
    id: "2",
    type: "ORDER",
    title: "New Order Received",
    message: "Order #1205 from Emily Watson (Dine In) - total RM 48.50",
    time: "12 mins ago",
    unread: true,
    icon: "fa-shopping-bag",
  },
  {
    id: "3",
    type: "READY",
    title: "Order Ready",
    message: "Order #1203 for Khalid Ibrahim is now ready for pick-up.",
    time: "25 mins ago",
    unread: false,
    icon: "fa-check-circle",
  },
  {
    id: "4",
    type: "STAFF",
    title: "Staff Clock-Out",
    message: "Marcus Wong clocked out after the lunch rush.",
    time: "1 hour ago",
    unread: false,
    icon: "fa-sign-out-alt",
  },
  {
    id: "5",
    type: "SYSTEM",
    title: "System Update",
    message: "Your restaurant profile was recently updated.",
    time: "2 hours ago",
    unread: false,
    icon: "fa-info-circle",
  },
  {
    id: "6",
    type: "ORDER",
    title: "New Order Received",
    message: "Order #1204 from David Chen (Take Away) - total RM 32.00",
    time: "3 hours ago",
    unread: false,
    icon: "fa-shopping-bag",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: !n.unread } : n
    ));
  };

  const getIconClass = (type: string) => {
    switch (type) {
      case "STAFF": return "noti-staff";
      case "ORDER": return "noti-order";
      case "READY": return "noti-ready";
      default: return "noti-system";
    }
  };

  return (
    <main className="main-content notifications-page">
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
          <h1>Notifications</h1>
          <p className="text-muted">Stay updated with your restaurant&apos;s activity.</p>
        </section>
      </div>

      <div className="notifications-list-wrapper mt-1">
        <div className="notifications-header">
          <h3 className="m-0">Activity Feed</h3>
          {notifications.some(n => n.unread) && (
            <button className="btn-mark-read" onClick={markAllAsRead}>
              <i className="fas fa-check-double mr-1"></i> Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div 
                key={noti.id} 
                className={`notification-item ${noti.unread ? 'unread' : ''}`}
                onClick={() => toggleRead(noti.id)}
              >
                <div className={`noti-icon-box ${getIconClass(noti.type)}`}>
                  <i className={`fas ${noti.icon}`}></i>
                </div>
                <div className="noti-content">
                  <span className="noti-title">{noti.title}</span>
                  <span className="noti-message">{noti.message}</span>
                </div>
                <div className="noti-time">
                  {noti.time}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state text-center p-3 opacity-50">
              <i className="fas fa-bell-slash fs-xl mb-1"></i>
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
