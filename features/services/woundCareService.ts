"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ApiResponseList } from "@/types";

// Define types based on the API response structure from documentation
export interface WoundRecord {
  id: string;
  patient: {
    id: string;
    full_name: string;
    gender: string;
    date_of_birth: string;
    age: number;
    created_at: string;
    patient_type: string;
  };
  patient_fullname: string;
  hospital: string;
  recorded_by: string;
  recorded_by_name: string | null;
  ora_status: string;
  date_recorded: string;
  description_tags: string[];
  affecting_factors_tags: string[];
  previous_treatment: string;
  size_in_mm: number;
  width: number;
  depth: number;
  wound_bed_assessment: string;
  exudate_amount: string;
  consistency: string;
  odour: string;
  infection_signs_tags: string[];
  edges_description_tags: string[];
  wound_condition_overall: string;
  edge_condition_overall: string;
  treatment_plan: string;
  dressing_type: string;
  dressing_change_reason: string;
  dressing_frequency: string;
  follow_up_needed: boolean;
  follow_up_date: string;
  follow_up_notes: string;
  created_at: string;
  updated_at: string;
}

// Interface for creating wound records
export interface CreateWoundRecordPayload {
  patient_id: string;
  date_recorded: string;
  description_tags: string[];
  affecting_factors_tags: string[];
  previous_treatment: string;
  size_in_mm: string;
  width: string;
  depth: string;
  wound_bed_assessment: string;
  exudate_amount: string;
  consistency: string;
  odour: string;
  infection_signs_tags: string[];
  edges_description_tags: string[];
  wound_condition_overall: string;
  edge_condition_overall: string;
  treatment_plan: string;
  dressing_type: string;
  dressing_change_reason: string;
  dressing_frequency: string;
  follow_up_needed: string;
  follow_up_date: string;
  follow_up_notes: string;
}

// Type for updating wound records
export type UpdateWoundRecordPayload = Partial<CreateWoundRecordPayload>;

// Transform wound record for UI display
export const transformWoundRecord = (record: WoundRecord): {
  id: string;
  patientName: string;
  oraStatus: "Referred" | "Admitted";
  regDateTime: string;
} => {
  // Map API status to UI status
  const mapStatus = (status: string): "Referred" | "Admitted" => {
    switch (status.toLowerCase()) {
      case 'referred':
      case 'pending':
      case 'open':
      case 'unknown':
        return 'Referred';
      case 'admitted':
      case 'active':
      case 'in_progress':
        return 'Admitted';
      default:
        return 'Referred'; // Default fallback
    }
  };

  return {
    id: record.id,
    patientName: record.patient_fullname,
    oraStatus: mapStatus(record.ora_status),
    regDateTime: new Date(record.date_recorded).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', '')
  };
};

// Hook to fetch wound records list
export const useWoundRecords = () => {
  return useQuery<WoundRecord[], ApiResponseError>({
    queryKey: ['wound-records'],
    queryFn: async () => {
      const response = await getRequest({
        url: '/woundcare-management/wounds/'
      }) as ApiResponseList<WoundRecord[]>;
      // Handle different possible response structures
      const data = response?.data?.results || [];
      // Ensure we return an array
      return Array.isArray(data) ? data : [];
    },
  });
};

// Hook to fetch a specific wound record
export const useWoundRecord = (woundId: string) => {
  return useQuery<WoundRecord, ApiResponseError>({
    queryKey: ['wound-record', woundId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/woundcare-management/wounds/${woundId}/`
      });
      return response.data.data;
    },
    enabled: !!woundId,
  });
};

// Hook to create a new wound record
export const useCreateWoundRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<WoundRecord>,
    ApiResponseError,
    CreateWoundRecordPayload
  >({
    mutationFn: async (payload) =>
      await postRequest({
        url: '/woundcare-management/wounds/',
        payload
      }),
    onSuccess: () => {
      // Invalidate and refetch wound records list
      queryClient.invalidateQueries({ queryKey: ['wound-records'] });
    },
  });
};

// Hook to update a wound record
export const useUpdateWoundRecord = (woundId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<WoundRecord>,
    ApiResponseError,
    UpdateWoundRecordPayload
  >({
    mutationFn: async (payload) =>
      await patchRequest({
        url: `/woundcare-management/wounds/${woundId}/`,
        payload
      }),
    onSuccess: () => {
      // Invalidate and refetch wound records
      queryClient.invalidateQueries({ queryKey: ['wound-records'] });
      queryClient.invalidateQueries({ queryKey: ['wound-record', woundId] });
    },
  });
};

// Hook to delete a wound record
export const useDeleteWoundRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<{ message: string }>,
    ApiResponseError,
    string
  >({
    mutationFn: async (woundId) =>
      await deleteRequest({
        url: `/woundcare-management/wounds/${woundId}/`
      }),
    onSuccess: () => {
      // Invalidate and refetch wound records list
      queryClient.invalidateQueries({ queryKey: ['wound-records'] });
    },
  });
};