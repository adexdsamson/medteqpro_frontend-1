'use client';

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

// Lab Scientist Dashboard Analytics Types
export interface LabDashboardAnalytics {
  completed_tests: number;
  pending_tests: number;
  cancelled_tests: number;
  due_tests: number;
  upcoming_appointments: number;
}

// Lab Test Types
export interface LabTestType {
  id: string;
  test_name: string;
  test_type: 'hematology' | 'biochemistry' | 'microbiology' | 'immunology' | 'pathology' | 'radiology' | 'other';
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Lab Test for Lab Scientist
export interface LabTest {
  id: string;
  lab_no: string;
  patient: string;
  patient_name: string;
  ordered_by: string;
  ordered_by_name: string;
  test_type: string;
  test_type_name: string;
  entry_category: 'outpatient' | 'inpatient' | 'emergency';
  date_collected: string;
  specimen: string;
  specimen_id?: string;
  specimen_type?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  percentage_completed: number;
  test_date: string;
  notes?: string;
  lab_scientist?: string;
  lab_scientist_name?: string;
  result?: string;
  reporting_date?: string;
  created_at: string;
  updated_at: string;
}

// Upcoming Appointment for Lab Scientist
export interface UpcomingAppointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  test_type: string;
  status: string;
}

// Get Lab Scientist Dashboard Analytics
export const useGetLabDashboardAnalytics = () => {
  return useQuery<ApiResponse<LabDashboardAnalytics>, ApiResponseError>({
    queryKey: ['lab-dashboard-analytics'],
    queryFn: async () => {
      const response = await getRequest({
        url: 'dashboard/laboratory/'
      });
      return response;
    },
  });
};

// Get Lab Test Types
export const useGetLabTestTypes = (options?: {
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  return useQuery<ApiResponse<LabTestType[]>, ApiResponseError>({
    queryKey: ['lab-test-types', options],
    queryFn: async () => {
      let url = 'laboratory-management/test-types/';
      
      const queryParams = [];
      if (options?.page) queryParams.push(`page=${options.page}`);
      if (options?.page_size) queryParams.push(`page_size=${options.page_size}`);
      if (options?.search) queryParams.push(`search=${options.search}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      return response;
    },
  });
};

// Get Completed Lab Tests
export const useGetCompletedLabTests = (options?: {
  page?: number;
  page_size?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery<ApiResponse<LabTest[]>, ApiResponseError>({
    queryKey: ['completed-lab-tests', options],
    queryFn: async () => {
      let url = 'laboratory-management/results/';
      
      const queryParams = [];
      if (options?.page) queryParams.push(`page=${options.page}`);
      if (options?.page_size) queryParams.push(`page_size=${options.page_size}`);
      if (options?.search) queryParams.push(`search=${options.search}`);
      if (options?.start_date) queryParams.push(`start_date=${options.start_date}`);
      if (options?.end_date) queryParams.push(`end_date=${options.end_date}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      return response;
    },
  });
};

// Get Scheduled Lab Tests
export const useGetScheduledLabTests = (options?: {
  page?: number;
  page_size?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery<ApiResponse<LabTest[]>, ApiResponseError>({
    queryKey: ['scheduled-lab-tests', options],
    queryFn: async () => {
      let url = 'laboratory-management/scheduled/';
      
      const queryParams = [];
      if (options?.page) queryParams.push(`page=${options.page}`);
      if (options?.page_size) queryParams.push(`page_size=${options.page_size}`);
      if (options?.search) queryParams.push(`search=${options.search}`);
      if (options?.start_date) queryParams.push(`start_date=${options.start_date}`);
      if (options?.end_date) queryParams.push(`end_date=${options.end_date}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      return response;
    },
  });
};

// Get Draft Lab Tests
export const useGetDraftLabTests = () => {
  return useQuery<ApiResponse<LabTest[]>, ApiResponseError>({
    queryKey: ['draft-lab-tests'],
    queryFn: async () => {
      const response = await getRequest({
        url: 'laboratory-management/drafts/'
      });
      return response;
    },
  });
};

// Get Upcoming Appointments
export const useGetUpcomingAppointments = (options?: {
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  return useQuery<ApiResponse<UpcomingAppointment[]>, ApiResponseError>({
    queryKey: ['upcoming-appointments', options],
    queryFn: async () => {
      let url = 'dashboard/upcoming-appointments/';
      
      const queryParams = [];
      if (options?.start_date) queryParams.push(`start_date=${options.start_date}`);
      if (options?.end_date) queryParams.push(`end_date=${options.end_date}`);
      if (options?.search) queryParams.push(`search=${options.search}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      return response;
    },
  });
};

// Get Lab Test Detail
export const useGetLabTestDetail = (testId: string) => {
  return useQuery<ApiResponse<LabTest>, ApiResponseError>({
    queryKey: ['lab-test-detail', testId],
    queryFn: async () => {
      const response = await getRequest({
        url: `laboratory-management/tests/${testId}/`
      });
      return response;
    },
    enabled: !!testId,
  });
};

// Utility function to format date
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Utility function to get status color
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'in_progress':
      return 'text-blue-600 bg-blue-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'draft':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};