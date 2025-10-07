'use client';

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

// Define types based on the API response structure from documentation
export interface HospitalReportOverview {
  total_hospitals: number;
  total_doctors: number;
  total_patients: number;
  total_revenue: number;
  date_of_report: string;
}

export interface HospitalListItem {
  id: string;
  hospital_name: string;
  no_of_doctors: number;
  no_of_patients: number;
  date_registered: string;
  no_of_months_subscribed: number;
  total_amount_paid: number | null;
}

export interface PaginatedHospitalReportsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: boolean;
    message: string;
    data: HospitalListItem[];
  };
}

export interface SubscriptionHistory {
  subscription_plan: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface HospitalDetailedReport {
  hospital_name: string;
  no_of_doctors: number;
  no_of_patients: number;
  total_amount_paid: number;
  date_of_report: string;
  subscription_history: SubscriptionHistory[];
}

// Hook to get hospital reports overview
export const useGetHospitalReportsOverview = () => {
  return useQuery<ApiResponse<HospitalReportOverview>, ApiResponseError>({
    queryKey: ['hospital-reports-overview'],
    queryFn: async () => {
      const response = await getRequest({
        url: '/superadmin/reports/overview/'
      });
      return response;
    }
  });
};

// Hook to get hospital list for reports
export const useGetHospitalReportsList = () => {
  return useQuery<PaginatedHospitalReportsResponse, ApiResponseError>({
    queryKey: ['hospital-reports-list'],
    queryFn: async () => {
      const response = await getRequest({
        url: '/superadmin/reports/hospitals/'
      });
      return response.data;
    }
  });
};

// Hook to get detailed hospital report by ID
export const useGetHospitalDetailedReport = (hospitalId: string) => {
  return useQuery<ApiResponse<HospitalDetailedReport>, ApiResponseError>({
    queryKey: ['hospital-detailed-report', hospitalId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/superadmin/reports/hospitals/${hospitalId}/`
      });
      return response;
    },
    enabled: !!hospitalId, // Only run query if hospitalId is provided
  });
};