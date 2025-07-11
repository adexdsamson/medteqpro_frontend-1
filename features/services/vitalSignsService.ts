/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponseError } from "@/types";

// Define types for vital signs based on API documentation
export interface VitalSignsPayload {
  body_temperature: number;
  pulse_rate: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  oxygen_saturation: number;
  respiration_rate?: number;
  weight?: number;
}

export interface VitalSignsResponse {
  id: string;
  body_temperature: number;
  pulse_rate: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  oxygen_saturation: number;
  respiration_rate?: number;
  weight?: number;
  created_at: string;
  updated_at: string;
}

// Hook to fetch vital signs for a patient
export const usePatientVitalSigns = (patientId: string) => {
  return useQuery<VitalSignsResponse[], ApiResponseError>({
    queryKey: ['vital-signs', patientId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/vital-signs/`
      });
      return response.data.results || response.data.data || [];
    },
    enabled: !!patientId,
  });
};

// Hook to get a specific vital signs record
export const useVitalSignsDetails = (patientId: string, vitalSignsId: string) => {
  return useQuery<VitalSignsResponse, ApiResponseError>({
    queryKey: ['vital-signs', patientId, vitalSignsId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/vital-signs/${vitalSignsId}/`
      });
      return response.data.data || response.data;
    },
    enabled: !!patientId && !!vitalSignsId,
  });
};

// Hook to add new vital signs
export const useAddVitalSigns = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, ApiResponseError, { patientId: string; data: VitalSignsPayload }>({
    mutationFn: async ({ patientId, data }) => {
      const response = await postRequest({
        url: `patient-management/patients/${patientId}/vital-signs/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch vital signs for this patient
      queryClient.invalidateQueries({ queryKey: ['vital-signs', variables.patientId] });
    },
  });
};

// Hook to update vital signs
export const useUpdateVitalSigns = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, ApiResponseError, { patientId: string; vitalSignsId: string; data: Partial<VitalSignsPayload> }>({
    mutationFn: async ({ patientId, vitalSignsId, data }) => {
      const response = await patchRequest({
        url: `patient-management/patients/${patientId}/vital-signs/${vitalSignsId}/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch vital signs
      queryClient.invalidateQueries({ queryKey: ['vital-signs', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['vital-signs', variables.patientId, variables.vitalSignsId] });
    },
  });
};

// Hook to delete vital signs
export const useDeleteVitalSigns = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, ApiResponseError, { patientId: string; vitalSignsId: string }>({
    mutationFn: async ({ patientId, vitalSignsId }) => {
      const response = await deleteRequest({
        url: `patient-management/patients/${patientId}/vital-signs/${vitalSignsId}/`
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch vital signs for this patient
      queryClient.invalidateQueries({ queryKey: ['vital-signs', variables.patientId] });
    },
  });
};