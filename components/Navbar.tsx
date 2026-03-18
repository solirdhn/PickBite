"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/", icon: "fas fa-th-large" },
    { name: "Orders", href: "/orders", icon: "fas fa-clipboard-list" },
    { name: "Menu", href: "/menu-management", icon: "fas fa-utensils" },
    { name: "Sales", href: "/sales", icon: "fas fa-chart-line" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("pb_auth");
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="page-branding">
        <h1 className="page-brand-name">PickBite</h1>
      </div>
      <div className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <i className={item.icon}></i>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="nav-right">
        <div className="user-profile">
          <span className="user-name">Bite Bistro Merchant</span>
          <div className="user-avatar">BB</div>
          <Link
            href="/settings"
            className={`settings-btn-nav ${pathname === "/settings" ? "active" : ""}`}
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </Link>
          <button className="notification-btn" title="Notifications">
            <i className="fas fa-bell"></i>
          </button>
          <button className="logout-btn" title="Logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
