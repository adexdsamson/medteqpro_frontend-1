/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { ApiResponseError } from "@/types";
import { PatientDetailResponse } from "@/app/(Root)/admin/patients/[patientId]/_components/types";

export type PatientListResponse = Pick<
  PatientDetailResponse,
  | "id"
  | "full_name"
  | "gender"
  | "age"
  | "created_at"
  | "patient_type"
  | "email"
  | "user_id"
>;

// Parameters for filtering patient list
export interface PatientListParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  patient_type?: string;
}

// Hook to fetch patient list
export const usePatientList = (params?: PatientListParams) => {
  return useQuery<PatientListResponse[], ApiResponseError>({
    queryKey: ["patients", params],
    queryFn: async () => {
      let url = "patient-management/patients/";

      // Add query parameters if provided
      const queryParams: string[] = [];
      if (params?.search) queryParams.push(`search=${params.search}`);
      if (params?.start_date)
        queryParams.push(`start_date=${params.start_date}`);
      if (params?.end_date) queryParams.push(`end_date=${params.end_date}`);
      if (params?.patient_type)
        queryParams.push(`patient_type=${params.patient_type}`);

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await getRequest({ url });

      // Transform the API response to match the PatientType format
      const patients = response.data.results as PatientListResponse[];
      return patients;
    },
  });
};

// Hook to fetch patients for appointment booking (simplified format)
export const usePatientsForAppointment = () => {
  return useQuery<{ value: string; label: string }[], ApiResponseError>({
    queryKey: ["patients-for-appointment"],
    queryFn: async () => {
      const response = await getRequest({
        url: "patient-management/patients/",
      });

      // Transform the API response to select options format
      const patients = response.data.results as PatientListResponse[];
      return patients.map((patient) => ({
        value: patient.id,
        label: patient.full_name,
      }));
    },
  });
};

// Hook to fetch a single patient by ID
export const usePatientDetails = (patientId: string) => {
  return useQuery<PatientDetailResponse, ApiResponseError>({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/`,
      });

      return response.data.data as unknown as PatientDetailResponse;
    },
    enabled: !!patientId, // Only run the query if patientId is provided
  });
};

// Hook to fetch detailed patient information
export const usePatientDetailedInfo = (patientId: string) => {
  return useQuery<PatientDetailResponse, ApiResponseError>({
    queryKey: ["patient-detailed", patientId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/`,
      });

      return response.data.data as PatientDetailResponse;
    },
    enabled: !!patientId,
  });
};

// Define family types
export interface FamilyResponse {
  id: string;
  family_name: string;
  no_of_members: number;
  created_at: string;
  updated_at: string;
}

export interface FamilyType {
  id: string;
  familyName: string;
  members: number;
  createdAt: string;
}

// Define the create patient payload type
export interface CreatePatientPayload {
  first_name: string;
  last_name: string;
  email?: string;
  middle_name?: string;
  address: string;
  city: string;
  state: string;
  phone_number: string;
  marital_status: string;
  date_of_birth: string;
  gender: string;
  height?: number;
  weight?: number;
  blood_group?: string;
  genotype?: string;
  employment_status: string;
  emergency_contact: {
    name: string;
    phone: string;
    address: string;
  };
  current_medications?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
  }>;
  allergies?: string;
  family_history?: string;
  hereditary_conditions?: string;
  chronic_conditions?: string;
  other_conditions?: string;
  surgical_history?: string;
  social_history?: {
    smoking?: string;
    alcohol?: string;
    drug_use?: string;
    exercise?: string;
    diet?: string;
  };
}

// Hook to fetch families list
export const useFamiliesList = () => {
  return useQuery<FamilyResponse[], ApiResponseError>({
    queryKey: ["families"],
    queryFn: async () => {
      const response = await getRequest({
        url: "patient-management/families/",
      });
      const families = response.data.results as FamilyResponse[];
      return families;
    },
  });
};

// Hook to create a new patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<any, ApiResponseError, CreatePatientPayload>({
    mutationFn: async (patientData: CreatePatientPayload) => {
      const response = await postRequest({
        url: "patient-management/patients/",
        payload: patientData,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch patient list
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Define create family payload type (API accepts only family_name)
export interface CreateFamilyPayload {
  family_name: string;
}

// Hook to create a new family
export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation<any, ApiResponseError, CreateFamilyPayload>({
    mutationFn: async (payload: CreateFamilyPayload) => {
      const response = await postRequest({
        url: "patient-management/families/",
        payload,
      });
      return response.data;
    },
    onSuccess: () => {
      // Refresh families list after create
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
};
