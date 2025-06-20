/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseError } from "@/types";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { BedData } from "@/app/(Root)/admin/bed-management/_components/columns";

export type BedResponseType = {
  id: string;
  bed_id: string;
  room_no: string;
  patient_id: string | null;
  allocation_date_time: string | null;
  duration: number | null;
  ward_type: string; // 'general' or 'labour'
  status: 'occupied' | 'available';
};

export type BedAssignmentType = {
  bed_id: string;
  patient_id: string;
};

// Get all beds
export const useGetAllBeds = () => {
  return useQuery<ApiResponse<BedResponseType[]>, ApiResponseError>({
    queryKey: ["allBeds"],
    queryFn: async () => await getRequest({ url: "/admin/beds/" }),
  });
};

// Get beds by ward type
export const useGetBedsByWardType = (wardType: string) => {
  return useQuery<ApiResponse<BedResponseType[]>, ApiResponseError>({
    queryKey: ["bedsByWardType", wardType],
    queryFn: async () => 
      await getRequest({ url: `/admin/beds/ward/${wardType}/` }),
    enabled: !!wardType,
  });
};

// Get beds by room number
export const useGetBedsByRoomNo = (roomNo: string) => {
  return useQuery<ApiResponse<BedResponseType[]>, ApiResponseError>({
    queryKey: ["bedsByRoomNo", roomNo],
    queryFn: async () => 
      await getRequest({ url: `/admin/beds/room/${roomNo}/` }),
    enabled: !!roomNo && roomNo !== "all",
  });
};

// Assign bed to patient
export const useAssignBed = () => {
  return useMutation<ApiResponse<any>, ApiResponseError, BedAssignmentType>({
    mutationFn: async (payload) =>
      await postRequest({ url: "/admin/beds/assign/", payload }),
  });
};

// Create new ward/room
export const useCreateWard = () => {
  return useMutation<
    ApiResponse<any>, 
    ApiResponseError, 
    { name: string; ward_type: string }
  >({
    mutationFn: async (payload) =>
      await postRequest({ url: "/admin/wards/create/", payload }),
  });
};

// Map API response to UI model
export const mapBedResponseToUIModel = (bed: BedResponseType): BedData => {
  return {
    bedId: bed.bed_id,
    roomNo: bed.room_no,
    patientId: bed.patient_id,
    allocationDateTime: bed.allocation_date_time,
    duration: bed.duration,
  };
};