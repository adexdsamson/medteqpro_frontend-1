"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ApiResponseList } from "@/types";

// Define types based on the API response structure from documentation
export interface StaffMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: "superadmin" | "admin" | "support";
  is_active: boolean;
  is_staff: boolean;
}

// Hospital staff member interface based on API response
export interface HospitalStaffMember {
  id: string;
  full_name: string;
  email: string;
  role: "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist";
  specialization: string | null;
  phone_number: string | null;
  hospital: string;
  date_registered: string;
  status: "active" | "inactive" | "on_leave" | "suspended";
}

export interface StaffListParams {
  search?: string;
  role?: "superadmin" | "admin" | "support";
}

// Hospital staff list params
export interface HospitalStaffListParams {
  search?: string;
  role?: "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist";
}

// Interface for hospital staff creation
export interface CreateHospitalStaffPayload {
  email: string;
  first_name: string;
  last_name: string;
  role: "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist";
}

export interface CreateHospitalStaffResponse {
  email: string;
  role: string;
  hospital: string;
}

// Interface for updating hospital staff
export interface UpdateHospitalStaffPayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  role?: "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist";
}

// Interface for updating staff work status
export interface UpdateStaffWorkStatusPayload {
  status: "active" | "inactive" | "on_leave" | "suspended";
  reason?: string;
  start_date?: string;
  end_date?: string;
}

// Hook for fetching staff list
export const useStaffList = (params?: StaffListParams) => {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.role) {
    queryParams.append("role", params.role);
  }

  const queryString = queryParams.toString();
  const url = `/superadmin/staff/${queryString ? `?${queryString}` : ""}`;

  return useQuery<ApiResponse<StaffMember[]>, ApiResponseError>({
    queryKey: ["staff-list", params],
    queryFn: async () => await getRequest({ url }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching hospital staff list
export const useHospitalStaffList = (params?: HospitalStaffListParams) => {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.role) {
    queryParams.append("role", params.role);
  }

  const queryString = queryParams.toString();
  const url = `/hospital-admin/staff/${queryString ? `?${queryString}` : ""}`;

  return useQuery<
    ApiResponseList<HospitalStaffMember[]>,
    ApiResponseError
  >({
    queryKey: ["hospital-staff-list", params],
    queryFn: async () => await getRequest({ url }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating hospital staff
export const useCreateHospitalStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CreateHospitalStaffResponse>,
    ApiResponseError,
    CreateHospitalStaffPayload
  >({
    mutationFn: async (payload) =>
      await postRequest({
        url: "/hospital-admin/staff/invite/",
        payload,
      }),
    onSuccess: () => {
      // Invalidate and refetch hospital staff list
      queryClient.invalidateQueries({ queryKey: ["hospital-staff-list"] });
    },
  });
};

// Hook for updating hospital staff details
export const useUpdateHospitalStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<HospitalStaffMember>,
    ApiResponseError,
    { staffId: string; payload: UpdateHospitalStaffPayload }
  >({
    mutationFn: async ({ staffId, payload }) =>
      await patchRequest({
        url: `/hospital-admin/staff/${staffId}/`,
        payload,
      }),
    onSuccess: () => {
      // Invalidate and refetch hospital staff list
      queryClient.invalidateQueries({ queryKey: ["hospital-staff-list"] });
    },
  });
};

// Hook for updating staff work status
export const useUpdateStaffWorkStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ message: string }>,
    ApiResponseError,
    { staffId: string; payload: UpdateStaffWorkStatusPayload }
  >({
    mutationFn: async ({ staffId, payload }) =>
      await patchRequest({
        url: `/hospital-admin/staff/${staffId}/work-status/`,
        payload,
      }),
    onSuccess: () => {
      // Invalidate and refetch hospital staff list
      queryClient.invalidateQueries({ queryKey: ["hospital-staff-list"] });
    },
  });
};

// Map position to API role
export const mapPositionToRole = (
  position: string
): "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist" => {
  const lowerPosition = position.toLowerCase();

  if (lowerPosition.includes("doctor") || lowerPosition.includes("physician")) {
    return "doctor";
  }
  if (lowerPosition.includes("nurse")) {
    return "nurse";
  }
  if (
    lowerPosition.includes("front") ||
    lowerPosition.includes("desk") ||
    lowerPosition.includes("reception")
  ) {
    return "front_desk";
  }
  if (lowerPosition.includes("lab") || lowerPosition.includes("scientist")) {
    return "lab_scientist";
  }
  if (lowerPosition.includes("pharmac")) {
    return "pharmacist";
  }

  // Default to front_desk for admin staff or unknown positions
  return "front_desk";
};
