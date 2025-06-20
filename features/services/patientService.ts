'use client';

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponseError } from "@/types";
import { format, parseISO } from 'date-fns';
import { PatientStatus, PatientType } from "@/app/(Root)/admin/patients/_components/patient-data";

// Define types based on the API response structure
export interface PatientResponse {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  created_at: string;
  patient_type: string;
  // Add other fields as needed based on the API response
}

// Parameters for filtering patient list
export interface PatientListParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  patient_type?: string;
}

// Transform API response to match the PatientType format used in the UI
const transformPatient = (patient: PatientResponse): PatientType => {
  // Determine patient status based on available data
  // Default to Active status, but this could be adjusted based on actual API data
  const status = PatientStatus.Active;

  // Format the created_at date to match the expected format in the UI
  const lastVisit = format(parseISO(patient.created_at), 'dd-MMM-yyyy');

  return {
    id: patient.id,
    patientId: patient.id,
    name: patient.full_name,
    gender: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) as "Male" | "Female" | "Other",
    age: patient.age,
    lastVisit,
    status,
    email: "", // These fields are not in the API response, but required by PatientType
    phone: "", // Add default values or leave empty
    address: "",
  };
};


// Hook to fetch patient list
export const usePatientList = (params?: PatientListParams) => {
  return useQuery<PatientType[], ApiResponseError>({
    queryKey: ['patients', params],
    queryFn: async () => {
      let url = 'patient-management/patients/';
      
      // Add query parameters if provided
      const queryParams: string[] = [];
      if (params?.search) queryParams.push(`search=${params.search}`);
      if (params?.start_date) queryParams.push(`start_date=${params.start_date}`);
      if (params?.end_date) queryParams.push(`end_date=${params.end_date}`);
      if (params?.patient_type) queryParams.push(`patient_type=${params.patient_type}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await getRequest({ url });
      
      // Transform the API response to match the PatientType format
      const patients = response.data.data.results as PatientResponse[];
      return patients.map(transformPatient);
    },
  });
};

// Hook to fetch a single patient by ID
export const usePatientDetails = (patientId: string) => {
  return useQuery<PatientType, ApiResponseError>({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/`
      });
      
      return transformPatient(response.data.data as unknown as PatientResponse);
    },
    enabled: !!patientId, // Only run the query if patientId is provided
  });
};