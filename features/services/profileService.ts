'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, patchRequest, postRequest } from "@/lib/axiosInstance";
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

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface FileUploadResponse {
  file_url: string;
  file_name: string;
  file_size: number;
  file_extension: string;
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

// Change user password
export const useChangePassword = () => {
  return useMutation<ApiResponse<{ message: string }>, ApiResponseError, ChangePasswordPayload>({
    mutationKey: ["changePassword"],
    mutationFn: async (payload) => 
      await patchRequest({ url: "/auth/password/update/", payload }),
  });
};

/**
 * Upload file to the server
 * @returns React Query mutation for file upload
 */
export const useUploadFile = () => {
  return useMutation<ApiResponse<FileUploadResponse>, ApiResponseError, File>({
    mutationKey: ["uploadFile"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      return await postRequest({ 
        url: "/core/upload/", 
        payload: formData,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      });
    },
  });
};

/**
 * Update profile picture by uploading file and updating profile
 * @returns React Query mutation for profile picture update
 */
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  const endpoint = getProfileEndpoint();
  
  return useMutation<ApiResponse<UserProfile>, ApiResponseError, File>({
    mutationKey: ["updateProfilePicture", userRole],
    mutationFn: async (file: File) => {
      // First upload the file
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadResponse = await postRequest({ 
        url: "/core/upload/", 
        payload: formData,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      }) as ApiResponse<FileUploadResponse>;
      
      // Then update the profile with the file URL
      const profilePayload: UpdateProfilePayload = {
        avatar: uploadResponse.data.data.file_url
      };
      
      return await patchRequest({ url: endpoint, payload: profilePayload });
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", userRole] });
    },
  });
};