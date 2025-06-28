'use client';

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

// Define types based on the API response structure
export interface DashboardAnalytics {
  total_revenue: number;
  total_staff_count: number;
  hospital_analytics: {
    total_hospitals: number;
    active_hospitals: number;
    inactive_hospitals: number;
    top_hospitals: Array<{
      name: string;
      percentage_of_total_patients: number;
    }>;
    other_hospitals: {
      name: string;
      percentage_of_total_patients: number;
    };
  };
  recent_hospitals: Array<{
    id: string;
    name: string;
    admin: {
      email: string;
      first_name: string;
      last_name: string;
    };
    no_of_doctors: string;
    state: string;
    city: string;
    address: string;
    created_at: string;
    status: string;
  }>;
  recent_subscriptions: Array<{
    id: string;
    hospital_name: string;
    subscription_date: string;
    expiry_date: string;
    status: string;
  }>;
}

// Hook for fetching dashboard analytics
export const useSuperAdminDashboard = () => {
  return useQuery<ApiResponse<DashboardAnalytics>, ApiResponseError>({
    queryKey: ["superadmin-dashboard"],
    queryFn: async () => await getRequest({ url: "/superadmin/dashboard/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
