/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Define types for Doctor Dashboard based on API documentation
export interface DoctorDashboardAnalytics {
  my_patients: number;
  my_patient_visits: number;
  patients_observed: number;
  patients_admitted: number;
  no_of_upcoming_appointments: number;
}

// Define types for Doctor Diagnosis Analytics
export interface DiagnosisAnalytic {
  diagnosis: string;
  number_of_patients: number;
}

export interface DoctorDiagnosisAnalytics {
  diagnoses: DiagnosisAnalytic[];
}

// Hook for fetching doctor dashboard analytics
export const useDoctorDashboard = () => {
  return useQuery<ApiResponse<DoctorDashboardAnalytics>, ApiResponseError>({
    queryKey: ["doctor-dashboard"],
    queryFn: async () => await getRequest({ url: "/dashboard/doctor/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching doctor diagnosis analytics
export const useDoctorDiagnosisAnalytics = () => {
  return useQuery<ApiResponse<DoctorDiagnosisAnalytics>, ApiResponseError>({
    queryKey: ["doctor-diagnosis-analytics"],
    queryFn: async () => await getRequest({ url: "/dashboard/doctor/diagnosis-analytics/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching visitation frequency analytics
export const useVisitationFrequencyAnalytics = (filter?: 'daily' | 'monthly' | 'yearly') => {
  return useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ["visitation-frequency-analytics", filter],
    queryFn: async () => {
      let url = "/dashboard/visitation-frequency/";
      if (filter) {
        url += `?visitation_filter=${filter}`;
      }
      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching upcoming appointments with optional filters
export const useUpcomingAppointments = (options?: {
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  return useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ["upcoming-appointments", options],
    queryFn: async () => {
      let url = "/dashboard/upcoming-appointments/";
      
      const queryParams = [];
      if (options?.start_date) queryParams.push(`start_date=${options.start_date}`);
      if (options?.end_date) queryParams.push(`end_date=${options.end_date}`);
      if (options?.search) queryParams.push(`search=${options.search}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Define types for Pharmacist Dashboard based on API documentation
export interface PharmacistDashboardAnalytics {
  no_of_medicines?: number;
  medicine?: number;
  available_drugs?: number;
  out_of_stock_drugs?: number;
  volume_dispensed?: number;
  total_drug_sales?: number;
  transfers_card?: number;
  cash_payments?: number;
  upcoming_pickups?: number;
}

// Define types for Pharmacist Upcoming Pickups
export interface PharmacistPickup {
  id: string | number;
  pickup_date?: string;
  date?: string;
  scheduled_date?: string;
  pickup_time?: string;
  time?: string;
  patient_fullname?: string;
  patient_name?: string;
  patient?: string;
  status?: string;
}

// Pharmacist Dashboard hooks
export const usePharmacistDashboard = () => {
  return useQuery<ApiResponse<PharmacistDashboardAnalytics>, ApiResponseError>({
    queryKey: ["pharmacist-dashboard"],
    queryFn: async () => await getRequest({ url: "/dashboard/pharmacist/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePharmacistUpcomingPickups = (options?: {
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  return useQuery<ApiResponse<PharmacistPickup[]>, ApiResponseError>({
    queryKey: ["pharmacist-upcoming-pickups", options],
    queryFn: async () => {
      let url = "/dashboard/pharmacist/upcoming-drug-pickup-list/";

      const queryParams: string[] = [];
      if (options?.start_date) queryParams.push(`start_date=${options.start_date}`);
      if (options?.end_date) queryParams.push(`end_date=${options.end_date}`);
      if (options?.search) queryParams.push(`search=${options.search}`);

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
