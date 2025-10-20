/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

export interface DiagnosisRecord {
  id: string;
  created_at: string;
  recorded_by: string;
  diagnosis: string;
  note?: string;
  hasNote: boolean;
}

/**
 * Payload for creating a new diagnostic report
 * Based on API documentation
 */
export interface CreateDiagnosticReportPayload {
  diagnosis: string;
  follow_up_date: string;
  notes?: string;
}

/**
 * Hook to fetch patient diagnostic reports
 * @param patientId - The patient ID to fetch reports for
 */
export const usePatientDiagnosticReports = (patientId: string) => {
  return useQuery<DiagnosisRecord[], ApiResponseError>({
    queryKey: ['diagnostic-reports', patientId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/diagnosis-reports/`
      });
      return response.data.results || response.data.data || [];
    },
    enabled: !!patientId,
  });
};

/**
 * Hook to create a new diagnostic report
 * Automatically invalidates and refetch the diagnostic reports list
 */
export const useCreateDiagnosticReport = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<any>,
    ApiResponseError,
    { patientId: string; payload: CreateDiagnosticReportPayload }
  >({
    mutationFn: async ({ patientId, payload }) => {
      const response = await postRequest({
        url: `patient-management/patients/${patientId}/diagnosis-reports/`,
        payload,
      });
      return response;
    },
    onSuccess: (_, { patientId }) => {
      // Invalidate and refetch diagnostic reports for this patient
      queryClient.invalidateQueries({
        queryKey: ['diagnostic-reports', patientId],
      });
    },
  });
};