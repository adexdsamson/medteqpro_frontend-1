'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, putRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponseError } from "@/types";
import { format, parseISO } from 'date-fns';

// Define types based on the API response structure
export interface PrescriptionResponse {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient: string;
}

export interface CreatePrescriptionRequest {
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
}

export interface UpdatePrescriptionRequest {
  medicine_name?: string;
  dosage?: string;
  frequency?: string;
  duration?: number;
  notes?: string;
}

export interface PrescriptionListParams {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  medicine_name?: string;
}

// Transform API response to a more UI-friendly format
export interface PrescriptionType {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
}

const transformPrescription = (prescription: PrescriptionResponse): PrescriptionType => {
  return {
    id: prescription.id,
    medicineName: prescription.medicine_name,
    dosage: prescription.dosage,
    frequency: prescription.frequency,
    duration: prescription.duration,
    notes: prescription.notes,
    createdAt: prescription.created_at,
    updatedAt: prescription.updated_at,
    formattedCreatedAt: format(parseISO(prescription.created_at), 'dd MMM yyyy, HH:mm'),
    formattedUpdatedAt: format(parseISO(prescription.updated_at), 'dd MMM yyyy, HH:mm'),
  };
};

// Hook to get prescriptions for a specific patient
export const useGetPatientPrescriptions = (patientId: string, params?: PrescriptionListParams) => {
  return useQuery<PrescriptionType[], ApiResponseError>({
    queryKey: ['patient-prescriptions', patientId, params],
    queryFn: async () => {
      let url = `patient-management/patients/${patientId}/prescription-reports/`;
      
      // Add query parameters if provided
      const queryParams: string[] = [];
      if (params?.page) queryParams.push(`page=${params.page}`);
      if (params?.page_size) queryParams.push(`page_size=${params.page_size}`);
      if (params?.start_date) queryParams.push(`start_date=${params.start_date}`);
      if (params?.end_date) queryParams.push(`end_date=${params.end_date}`);
      if (params?.medicine_name) queryParams.push(`medicine_name=${params.medicine_name}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      
      // Transform the API response
      const prescriptions = response.data?.results || [];
      return prescriptions;
    },
    enabled: !!patientId,
  });
};

// Hook to get a specific prescription
export const useGetPrescription = (patientId: string, prescriptionId: string) => {
  return useQuery<PrescriptionType, ApiResponseError>({
    queryKey: ['prescription', patientId, prescriptionId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/prescription-reports/${prescriptionId}/`
      });
      
      return transformPrescription(response.data.data as PrescriptionResponse);
    },
    enabled: !!patientId && !!prescriptionId,
  });
};

// Hook to create a new prescription
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, data }: { patientId: string; data: CreatePrescriptionRequest }) => {
      const response = await postRequest({
        url: `patient-management/patients/${patientId}/prescription-reports/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch prescriptions for this patient
      queryClient.invalidateQueries({ queryKey: ['patient-prescriptions', variables.patientId] });
    },
  });
};

// Hook to update a prescription
export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, prescriptionId, data }: { 
      patientId: string; 
      prescriptionId: string; 
      data: UpdatePrescriptionRequest 
    }) => {
      const response = await putRequest({
        url: `patient-management/patients/${patientId}/prescription-reports/${prescriptionId}/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch prescriptions
      queryClient.invalidateQueries({ queryKey: ['patient-prescriptions', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['prescription', variables.patientId, variables.prescriptionId] });
    },
  });
};

// Hook to delete a prescription
export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, prescriptionId }: { patientId: string; prescriptionId: string }) => {
      const response = await deleteRequest({
        url: `patient-management/patients/${patientId}/prescription-reports/${prescriptionId}/`
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch prescriptions for this patient
      queryClient.invalidateQueries({ queryKey: ['patient-prescriptions', variables.patientId] });
    },
  });
};