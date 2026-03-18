"use client";

import { usePathname } from "next/navigation";

interface LayoutShellProps {
  navbar: React.ReactNode;
  children: React.ReactNode;
}

export default function LayoutShell({ navbar, children }: LayoutShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && navbar}
      {children}
    </>
  );
}
