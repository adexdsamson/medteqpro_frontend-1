'use client';

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

export interface RecentHospitals {
  hospital_id:     string;
  hospital_name:   string;
  admin_full_name: string;
  admin_email:     string;
  date_registered: Date;
  no_of_doctors:   number;
  state:           string;
  status:          string;
}


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
  recent_hospitals: Array<RecentHospitals>;
  recent_subscriptions: Array<{
    id: string;
    hospital_name: string;
    subscription_date: string;
    expiry_date: string;
    status: string;
  }>;
}

// Define types for Hospital Admin Dashboard based on API documentation
export interface HospitalAdminDashboardAnalytics {
  overview: {
    total_no_of_patients: number;
    total_no_of_doctors: number;
    total_no_of_staff: number;
    no_of_medicines: number;
    no_of_lab_tests: number;
    no_of_upcoming_appointments: number;
    no_of_wards: number;
    no_of_rooms: number;
    no_of_icus: number;
    no_of_beds: {
      total: number;
      no_occupied: number;
      no_available: number;
    };
  };
  analytics: {
    total_no_of_transactions: number;
    payment_medium_percentages: {
      cash: number;
      card: number;
      bank_transfer: number;
    };
  };
}

// Hook for fetching super admin dashboard analytics
export const useSuperAdminDashboard = () => {
  return useQuery<ApiResponse<DashboardAnalytics>, ApiResponseError>({
    queryKey: ["superadmin-dashboard"],
    queryFn: async () => await getRequest({ url: "/superadmin/dashboard/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Define types for Nurse Dashboard based on API documentation
export interface NurseDashboardAnalytics {
  no_of_patients: number;
  no_of_wound_care_patients: number;
  no_of_injections_administered: number;
  no_of_upcoming_appointments: number;
}

// Hook for fetching hospital admin dashboard analytics
export const useHospitalAdminDashboard = () => {
  return useQuery<ApiResponse<HospitalAdminDashboardAnalytics>, ApiResponseError>({
    queryKey: ["hospital-admin-dashboard"],
    queryFn: async () => await getRequest({ url: "/dashboard/hospital-admin/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching nurse dashboard analytics
export const useNurseDashboard = () => {
  return useQuery<ApiResponse<NurseDashboardAnalytics>, ApiResponseError>({
    queryKey: ["nurse-dashboard"],
    queryFn: async () => await getRequest({ url: "/dashboard/nurse/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
