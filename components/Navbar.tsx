"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: "fas fa-th-large" },
    { name: "Orders", href: "/orders", icon: "fas fa-clipboard-list" },
    { name: "Menu", href: "/menu-management", icon: "fas fa-utensils" },
    { name: "Categories", href: "#", icon: "fas fa-tags" },
    { name: "Sales", href: "#", icon: "fas fa-chart-line" },
    { name: "Settings", href: "#", icon: "fas fa-cog" },
  ];

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
          <Link href="#" className="logout-btn" title="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
