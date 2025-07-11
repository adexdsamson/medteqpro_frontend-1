/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseError } from "@/types";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";
import { BedData } from "@/app/(Root)/admin/bed-management/_components/columns";

// Ward response type based on API documentation
export type WardResponseType = {
  id: string;
  name: string;
  ward_type: string;
  no_of_beds: number;
  no_of_occupied_beds: number;
  no_of_available_beds: number;
  beds?: BedResponseType[]; // Optional - only present in single ward GET endpoint
};

// Bed response type based on API documentation
export type BedResponseType = {
  id: string;
  ward: string;
  bed_number: string;
  room_number: string;
  patient: string | null;
  patient_fullname_if_occupied: string | null;
  status: 'occupied' | 'available';
  date_allocated: string | null;
  expected_end_date: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
};

// Bed assignment payload type
export type BedAssignmentType = {
  patient_id: string;
  expected_end_date: string;
};

// Ward creation payload type
export type WardCreationType = {
  name: string;
  ward_type: string;
};

// Bed creation payload type
export type BedCreationType = {
  bed_number: string;
  room_number: string;
};

// Get all wards (this returns ward information, not individual beds)
export const useGetAllWards = () => {
  return useQuery<ApiResponse<WardResponseType[]>, ApiResponseError>({
    queryKey: ["allWards"],
    queryFn: async () => await getRequest({ url: "/bed-management/wards/" }),
  });
};

// Get specific ward with beds
export const useGetWard = (wardId: string) => {
  return useQuery<ApiResponse<WardResponseType>, ApiResponseError>({
    queryKey: ["ward", wardId],
    queryFn: async () => 
      await getRequest({ url: `/bed-management/wards/${wardId}/` }),
    enabled: !!wardId,
  });
};

// Get beds in a specific ward
export const useGetBedsInWard = (wardId: string) => {
  return useQuery<ApiResponse<{
    data: BedResponseType[];
    total_beds: number;
    available_beds: number;
    occupied_beds: number;
  }>, ApiResponseError>({
    queryKey: ["bedsInWard", wardId],
    queryFn: async () => 
      await getRequest({ url: `/bed-management/wards/${wardId}/beds/` }),
    enabled: !!wardId,
  });
};

// Assign bed to patient
export const useAssignBed = (wardId: string, bedId: string) => {
  return useMutation<ApiResponse<BedResponseType>, ApiResponseError, BedAssignmentType>({
    mutationFn: async (payload) =>
      await postRequest({ 
        url: `/bed-management/wards/${wardId}/beds/${bedId}/assign/`, 
        payload 
      }),
  });
};

// Release bed
export const useReleaseBed = (wardId: string, bedId: string) => {
  return useMutation<ApiResponse<BedResponseType>, ApiResponseError, void>({
    mutationFn: async () =>
      await postRequest({ 
        url: `/bed-management/wards/${wardId}/beds/${bedId}/release/`, 
        payload: {} 
      }),
  });
};

// Create new ward
export const useCreateWard = () => {
  return useMutation<ApiResponse<WardResponseType>, ApiResponseError, WardCreationType>({
    mutationFn: async (payload) =>
      await postRequest({ url: "/bed-management/wards/", payload }),
  });
};

// Create bed in ward
export const useCreateBedInWard = (wardId: string) => {
  return useMutation<ApiResponse<BedResponseType>, ApiResponseError, BedCreationType>({
    mutationFn: async (payload) =>
      await postRequest({ 
        url: `/bed-management/wards/${wardId}/beds/`, 
        payload 
      }),
  });
};

// Update ward
export const useUpdateWard = (wardId: string) => {
  return useMutation<ApiResponse<WardResponseType>, ApiResponseError, Partial<WardCreationType>>({
    mutationFn: async (payload) =>
      await patchRequest({ 
        url: `/bed-management/wards/${wardId}/`, 
        payload
      }),
  });
};

// Delete ward
export const useDeleteWard = (wardId: string) => {
  return useMutation<ApiResponse<any>, ApiResponseError, void>({
    mutationFn: async () =>
      await deleteRequest({ 
        url: `/bed-management/wards/${wardId}/`
      }),
  });
};

// Map API response to UI model
export const mapBedResponseToUIModel = (bed: BedResponseType): BedData => {
  return {
    bedId: bed.bed_number,
    roomNo: bed.room_number,
    patientId: bed.patient,
    allocationDateTime: bed.date_allocated,
    duration: bed.duration,
  };
};

// Helper function to get all beds from all wards (for backward compatibility)
// Hook to get all beds from all wards
export const useGetAllBeds = () => {
  const { data: wardsResponse, isLoading: wardsLoading, error: wardsError } = useGetAllWards();
  
  return useQuery<ApiResponse<BedResponseType[]>, ApiResponseError>({
    queryKey: ["allBeds", wardsResponse?.data?.data?.map(w => w.id)],
    queryFn: async () => {
      if (!wardsResponse?.data?.data) {
        throw new Error("No wards data available");
      }
      
      const allBeds: BedResponseType[] = [];
      
      // Fetch beds for each ward
      for (const ward of wardsResponse.data.data) {
        try {
          const bedsResponse = await getRequest({ 
            url: `/bed-management/wards/${ward.id}/beds/` 
          });
          
          if (bedsResponse.data?.data && Array.isArray(bedsResponse.data.data)) {
            allBeds.push(...bedsResponse.data.data);
          }
        } catch (error) {
          console.error(`Failed to fetch beds for ward ${ward.id}:`, error);
          // Continue with other wards even if one fails
        }
      }
      
      // Return a proper ApiResponse structure by making a mock axios response
      const mockAxiosResponse = {
        data: {
          status: true,
          message: "All beds retrieved successfully",
          data: allBeds
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any
      };
      
      return mockAxiosResponse;
    },
    enabled: !!wardsResponse?.data?.data && !wardsLoading && !wardsError,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};