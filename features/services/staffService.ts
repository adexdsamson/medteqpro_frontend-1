"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

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

export interface StaffListParams {
  search?: string;
  role?: "superadmin" | "admin" | "support";
}

// Hook for fetching staff list
export const useStaffList = (params?: StaffListParams) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  if (params?.role) {
    queryParams.append('role', params.role);
  }
  
  const queryString = queryParams.toString();
  const url = `/superadmin/staff/${queryString ? `?${queryString}` : ''}`;
  
  return useQuery<ApiResponse<StaffMember[]>, ApiResponseError>({
    queryKey: ["staff-list", params],
    queryFn: async () => await getRequest(url),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};