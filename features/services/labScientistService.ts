'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ApiResponseList } from "@/types";

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
  return useQuery<ApiResponseList<LabTestType[]>, ApiResponseError>({
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

// Create Lab Test (Laboratory Management)
/**
 * Payload for creating a Laboratory Management Test.
 * Maps directly to POST /laboratory-management/tests/ request body.
 * @typedef CreateLabManagementTestPayload
 * @property {string} lab_no - Laboratory number/identifier for the test order
 * @property {string} patient - Patient UUID
 * @property {string} ordered_by - UUID of the ordering doctor/user
 * @property {string} test_type - Lab test type UUID
 * @property {('outpatient'|'inpatient'|'emergency')} entry_category - Entry category of the test
 * @property {string} date_collected - ISO date string for collection date
 * @property {string} specimen - Specimen description
 * @property {string} [specimen_id] - Optional specimen identifier/barcode
 * @property {('blood'|'urine'|'stool'|'saliva'|'tissue'|'swab'|'other')} [specimen_type] - Optional specimen type
 * @property {('draft'|'pending')} [status] - Initial status of the test
 * @property {number} [percentage_completed] - Progress percentage (0-100)
 * @property {string} test_date - ISO date string for scheduled test date
 * @property {string} [notes] - Additional notes
 * @property {string} [diagnosis_report] - Optional diagnosis report text
 */
export interface CreateLabManagementTestPayload {
  lab_no: string;
  patient: string; // patient UUID
  ordered_by: string; // doctor/user UUID
  test_type: string; // lab test type UUID
  entry_category: 'outpatient' | 'inpatient' | 'emergency';
  date_collected: string; // ISO string
  specimen: string; // e.g., "Serum"
  specimen_id?: string;
  specimen_type?: 'blood' | 'urine' | 'stool' | 'saliva' | 'tissue' | 'swab' | 'other';
  status?: 'draft' | 'pending';
  percentage_completed?: number; // 0 - 100
  test_date: string; // ISO string (can be future for scheduled)
  notes?: string;
  diagnosis_report?: string;
}

/**
 * React Query mutation to create a Laboratory Management Test.
 * Invalidates scheduled and draft lab tests on success to refresh the UI lists.
 * @returns Mutation object with mutate/mutateAsync helpers
 * @example
 * const { mutateAsync } = useCreateLabManagementTest();
 * await mutateAsync(payload);
 */
export const useCreateLabManagementTest = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<LabTest>, ApiResponseError, CreateLabManagementTestPayload>({
    mutationFn: async (payload) => {
      const response = await postRequest({
        url: 'laboratory-management/tests/',
        payload,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate lists so UI refreshes
      queryClient.invalidateQueries({ queryKey: ['scheduled-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['draft-lab-tests'] });
    },
  });
};

// -------------------------------------------
// Lab Tests - Update, Complete, Delete
// -------------------------------------------

/**
 * Payload for updating a Lab Test via PATCH /laboratory-management/tests/:test_id/update/
 * Only include fields that need to be updated.
 * @typedef UpdateLabManagementTestPayload
 * @property {string} [lab_scientist]
 * @property {('draft'|'pending'|'in_progress'|'completed'|'cancelled')} [status]
 * @property {number} [percentage_completed]
 * @property {string} [notes]
 */
export interface UpdateLabManagementTestPayload {
  lab_scientist?: string;
  status?: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  percentage_completed?: number;
  notes?: string;
}

/**
 * Hook to update a Lab Test.
 * @param testId - Lab test UUID
 * @returns React Query mutation for updating a lab test
 * @example
 * const { mutateAsync } = useUpdateLabManagementTest(testId);
 * await mutateAsync({ status: 'in_progress', percentage_completed: 50 });
 */
export const useUpdateLabManagementTest = (testId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LabTest>, ApiResponseError, UpdateLabManagementTestPayload>({
    mutationFn: async (payload) => {
      const response = await patchRequest({
        url: `laboratory-management/tests/${testId}/update/`,
        payload,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['draft-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['completed-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['lab-test-detail', testId] });
    },
  });
};

/**
 * Payload for completing a Lab Test via PATCH /laboratory-management/tests/:test_id/complete/
 * @typedef CompleteLabManagementTestPayload
 * @property {string} result - Result text/summary
 * @property {string} reporting_date - ISO date string
 * @property {string} [lab_scientist]
 * @property {string} [notes]
 */
export interface CompleteLabManagementTestPayload {
  result: string;
  reporting_date: string;
  lab_scientist?: string;
  notes?: string;
}

/**
 * Hook to complete a Lab Test.
 * @param testId - Lab test UUID
 * @returns React Query mutation for completing a lab test
 */
export const useCompleteLabManagementTest = (testId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LabTest>, ApiResponseError, CompleteLabManagementTestPayload>({
    mutationFn: async (payload) => {
      const response = await patchRequest({
        url: `laboratory-management/tests/${testId}/complete/`,
        payload,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['draft-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['completed-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['lab-test-detail', testId] });
    },
  });
};

/**
 * Hook to delete a Lab Test via DELETE /laboratory-management/tests/:test_id/update/
 * @param testId - Lab test UUID
 * @returns React Query mutation for deleting a lab test
 */
export const useDeleteLabManagementTest = (testId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, ApiResponseError, void>({
    mutationFn: async () => {
      const response = await deleteRequest({
        url: `laboratory-management/tests/${testId}/update/`,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['draft-lab-tests'] });
      queryClient.invalidateQueries({ queryKey: ['completed-lab-tests'] });
    },
  });
};

// -------------------------------------------
// Lab Test Types - Update, Delete
// -------------------------------------------

/**
 * Payload for updating a Lab Test Type via PATCH /laboratory-management/test-types/:type_id/
 * Only include fields to update.
 */
export interface UpdateLabTestTypePayload {
  test_name?: string;
  test_type?: 'hematology' | 'biochemistry' | 'microbiology' | 'immunology' | 'pathology' | 'radiology' | 'other';
  description?: string;
  is_active?: boolean;
}

/**
 * Hook to update a Lab Test Type.
 * @param typeId - Lab test type UUID
 */
export const useUpdateLabTestType = (typeId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LabTestType>, ApiResponseError, UpdateLabTestTypePayload>({
    mutationFn: async (payload) => {
      const response = await patchRequest({
        url: `laboratory-management/test-types/${typeId}/`,
        payload,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-test-types'] });
    },
  });
};

/**
 * Hook to delete a Lab Test Type.
 * @param typeId - Lab test type UUID
 */
export const useDeleteLabTestType = (typeId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, ApiResponseError, void>({
    mutationFn: async () => {
      const response = await deleteRequest({
        url: `laboratory-management/test-types/${typeId}/`,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-test-types'] });
    },
  });
};


/**
 * Allowed filter values for Lab Test Analytics endpoint.
 * @example
 * const filter: LabTestAnalyticsFilter = 'monthly';
 */
export type LabTestAnalyticsFilter = 'daily' | 'monthly' | 'yearly';

/**
 * React Query hook to fetch Lab Test Analytics for the Lab Scientist dashboard.
 * Uses GET dashboard/laboratory/test-analytics/ with optional filter query.
 *
 * Contract is not documented in detail; this hook returns the API response as-is.
 * Consumers should access the payload via `response?.data?.data`.
 *
 * @param {LabTestAnalyticsFilter} [filter] - Frequency filter: daily, monthly, or yearly
 * @returns {import("@tanstack/react-query").UseQueryResult<ApiResponse<any>, ApiResponseError>} React Query result containing the raw API response
 * @example
 * const { data } = useGetLabTestAnalytics('yearly');
 */
export const useGetLabTestAnalytics = (filter?: LabTestAnalyticsFilter) => {
  return useQuery<ApiResponse<unknown>, ApiResponseError>({
    queryKey: ['lab-test-analytics', filter],
    queryFn: async () => {
      let url = 'dashboard/laboratory/test-analytics/';
      if (filter) {
        url += `?filter=${filter}`;
      }
      const response = await getRequest({ url });
      return response;
    },
  });
};