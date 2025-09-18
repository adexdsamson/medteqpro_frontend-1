'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { format, parseISO } from "date-fns";

// Define types based on the API response structure
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
  status: 'draft' | 'pending' | 'completed';
  percentage_completed: number;
  test_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LabTestDetail extends LabTest {
  results: LabTestResult[];
  patient_details: {
    id: string;
    name: string;
    age: string;
    gender: string;
    blood_group?: string;
  };
}

export interface LabTestResult {
  parameter: string;
  result: string;
  reference: string;
  unit: string;
  flag: 'High' | 'Low' | 'Normal';
}

// Function to format the date using date-fns
export const formatLabDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd-MMM-yy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Get all lab tests for a patient
export const useGetPatientLabTests = (patientId: string, options?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) => {
  return useQuery<ApiResponse<LabTest[]>, ApiResponseError>({
    queryKey: ['patient-lab-tests', patientId, options],
    queryFn: async () => {
      let url = `laboratory-management/patients/${patientId}/tests/`;
      
      // Add query parameters if provided
      const queryParams = [];
      if (options?.status) queryParams.push(`status=${options.status}`);
      if (options?.startDate) queryParams.push(`start_date=${options.startDate}`);
      if (options?.endDate) queryParams.push(`end_date=${options.endDate}`);
      if (options?.search) queryParams.push(`search=${options.search}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      return response;
    },
    enabled: !!patientId,
  });
};

// Get a specific lab test detail
export const useGetLabTestDetail = (testId: string) => {
  return useQuery<ApiResponse<LabTestDetail>, ApiResponseError>({
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

// Create lab test payload type based on API documentation
export interface CreateLabTestPayload {
  lab_no: string;
  ordered_by: string;
  test_type: string;
  entry_category: 'outpatient' | 'inpatient' | 'emergency';
  date_collected: string;
  specimen: string;
  status?: 'draft';
}

// Hook to create a new lab test for a patient
export const useCreateLabTest = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<LabTest>, ApiResponseError, { patientId: string; payload: CreateLabTestPayload }>({
    mutationFn: async ({ patientId, payload }) => {
      const response = await postRequest({
        url: `patient-management/patients/${patientId}/tests/create/`,
        payload,
      });
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch lab tests for the patient
      queryClient.invalidateQueries({ queryKey: ['patient-lab-tests', variables.patientId] });
    },
  });
};