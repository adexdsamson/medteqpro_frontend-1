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
  is_active: boolean;
  is_staff: boolean;
  avatar?: string;
  hospital?: {
    id: string;
    name: string;
    email?: string;
    phone_number?: string;
    state: string;
    city: string;
    address: string;
    avatar?: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface UpdateProfilePayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone_number?: string;
  specialization?: string;
  avatar?: string;
}

// Helper function to get the correct profile endpoint based on user role
// Based on API documentation analysis, all roles use the /auth/user/ endpoint
const getProfileEndpoint = (): string => {
  // All user roles use the same /auth/user/ endpoint for profile operations
  // as specified in the Auth section of the API documentation
  return "/auth/user/";
};

// Get user profile
export const useGetProfile = () => {
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  const endpoint = getProfileEndpoint();
  
  return useQuery<ApiResponse<UserProfile>, ApiResponseError>({
    queryKey: ["profile", userRole],
    queryFn: async () => await getRequest({ url: endpoint }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user // Only run query if user is available
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  const endpoint = getProfileEndpoint();
  
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