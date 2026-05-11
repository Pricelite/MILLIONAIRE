"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "./api";

export function useDashboardStats(enabled: boolean) {
  return useQuery({
    queryKey: ["dashboard-stats"],
    enabled,
    queryFn: async () => {
      const { data } = await api.get("/analytics/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("restomaster:accessToken") ?? ""}`
        }
      });
      return data as {
        revenue: number;
        ordersCount: number;
        averageOrderValue: number;
      };
    }
  });
}
