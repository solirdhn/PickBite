"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("pb_auth") === "true";
    const isLoginPage = pathname === "/login";

    if (!isAuth && !isLoginPage) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner"></div>
      </div>
    );
  }

  return <>{children}</>;
}
