'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { storeFunctions } from "@/store/authSlice";

// Define types based on the API response structure from Auth documentation
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

// Unified profile service that uses Auth folder endpoints for all user roles
// Based on API documentation: GET /auth/user/ and PATCH /auth/user/

// Get user profile - works for all user roles
export const useGetUserProfile = () => {
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  
  return useQuery<ApiResponse<UserProfile>, ApiResponseError>({
    queryKey: ["userProfile", userRole],
    queryFn: async () => await getRequest({ url: "/auth/user/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user, // Only run query if user is available
    retry: 2,
    retryDelay: 1000,
  });
};

// Update user profile - works for all user roles
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  
  return useMutation<ApiResponse<UserProfile>, ApiResponseError, UpdateProfilePayload>({
    mutationKey: ["updateUserProfile", userRole],
    mutationFn: async (payload) => 
      await patchRequest({ url: "/auth/user/", payload }),
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["userProfile", userRole] });
      
      // Update the auth store with new user data if needed
      if (data?.data) {
        const currentState = storeFunctions.getState();
        if (currentState.user) {
          storeFunctions.setState({
          ...currentState,
          user: {
            ...currentState.user,
            first_name: data.data.data.first_name,
            last_name: data.data.data.last_name,
            phone_number: data.data.data.phone_number ?? null,
          }
        });
        }
      }
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
};

// Role-specific profile hooks for backward compatibility and specific use cases

// Admin profile management
export const useAdminProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Doctor profile management
export const useDoctorProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Nurse profile management
export const useNurseProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Patient profile management
export const usePatientProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Pharmacy profile management
export const usePharmacyProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Lab Scientist profile management
export const useLabScientistProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Front Desk profile management
export const useFrontDeskProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Super Admin profile management
export const useSuperAdminProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Generic profile hook that can be used by any role
export const useProfile = () => {
  return {
    getProfile: useGetUserProfile,
    updateProfile: useUpdateUserProfile,
  };
};

// Export types for use in components
// Note: Types are already exported above, no need to re-export