"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useAuthStore } from "@/lib/auth-store";

type AppRole = "SUPER_ADMIN" | "MANAGER" | "WAITER" | "CASHIER" | "DRIVER" | "CUSTOMER";

const ACL: Record<string, AppRole[]> = {
  "/dashboard/pos": ["SUPER_ADMIN", "MANAGER", "CASHIER"],
  "/dashboard/kitchen": ["SUPER_ADMIN", "MANAGER", "WAITER"],
  "/dashboard/settings": ["SUPER_ADMIN", "MANAGER"],
  "/dashboard/analytics": ["SUPER_ADMIN", "MANAGER"]
};

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const role = (user?.role ?? "MANAGER") as AppRole;

  const allowed = useMemo(() => {
    const rule = ACL[pathname ?? ""];
    if (!rule) return true;
    return rule.includes(role);
  }, [pathname, role]);

  useEffect(() => {
    const token = localStorage.getItem("restomaster:accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!allowed) {
      router.replace("/dashboard");
    }
  }, [allowed, router]);

  return <>{children}</>;
}
