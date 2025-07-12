'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { storeFunctions } from "@/store/authSlice";

// Define types based on the API response structure from documentation
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number?: string;
  specialization?: string;
  role: string;
  date_registered: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone_number?: string;
  specialization?: string;
}

// Helper function to get the correct profile endpoint based on user role
// Based on API documentation analysis, all roles currently use hospital-admin/profile endpoint
const getProfileEndpoint = (userRole: string): string => {
  switch (userRole) {
    case "superadmin":
      // No specific superadmin/profile endpoint found in API docs
      // Using hospital-admin/profile as fallback
      return "/hospital-admin/profile/";
    case "hospital_admin":
      return "/hospital-admin/profile/";
    case "doctor":
      return "/hospital-admin/profile/";
    case "nurse":
      return "/hospital-admin/profile/";
    case "patient":
      // No mobile/patient/profile endpoint found in API docs
      // Only mobile/patient/test-results and mobile/patient/medications exist
      // Using hospital-admin/profile as fallback
      return "/hospital-admin/profile/";
    case "pharmacy":
      return "/hospital-admin/profile/";
    case "lab_scientist":
      return "/hospital-admin/profile/";
    case "front_desk":
      return "/hospital-admin/profile/";
    default:
      return "/hospital-admin/profile/";
  }
};

// Get user profile
export const useGetProfile = () => {
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  const endpoint = getProfileEndpoint(userRole);
  
  return useQuery<ApiResponse<UserProfile>, ApiResponseError>({
    queryKey: ["profile", userRole],
    queryFn: async () => await getRequest({ url: endpoint }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      ...data,
      data: {
        ...data.data,
        data: data.data.data // Extract the nested data from Api<UserProfile>
      }
    }),
    enabled: !!user // Only run query if user is available
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  const endpoint = getProfileEndpoint(userRole);
  
  return useMutation<ApiResponse<UserProfile>, ApiResponseError, UpdateProfilePayload>({
    mutationKey: ["updateProfile", userRole],
    mutationFn: async (payload) => 
      await patchRequest({ url: endpoint, payload }),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", userRole] });
    },
  });
};