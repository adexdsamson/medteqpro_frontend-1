import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postRequest, getRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, User } from "@/types";
import { storeFunctions } from "@/store/authSlice";
import { PermissionCategory } from "@/lib/permissions";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
  permissions: Record<PermissionCategory | string, boolean>;
};

export type ForgotPasswordCredentials = {
  email: string;
};

export type ResetPasswordCredentials = {
  token: string;
  user_id: string;
  new_password: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
  status: boolean;
};

export type ConfirmOTPCredentials = {
  email: string;
  otp: string;
};

export type ConfirmOTPResponse = {
  message: string;
  status: boolean;
  token?: string;
  user_id?: string;
};

export type SetPasswordCredentials = {
  uid: string;
  token: string;
  password: string;
};

export type SetPasswordResponse = {
  message: string;
  status: boolean;
};

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

export const useLogin = () => {
  return useMutation<ApiResponse<LoginResponse>, ApiResponseError, LoginCredentials>({
    mutationKey: ["login"],
    mutationFn: async (credentials) => 
      await postRequest({ url: "/auth/login/", payload: credentials }),
  });
};

export const useForgotPassword = () => {
  return useMutation<ApiResponse<ForgotPasswordResponse>, ApiResponseError, ForgotPasswordCredentials>({
    mutationKey: ["forgot-password"],
    mutationFn: async (credentials) => 
      await postRequest({ url: "/auth/password/reset-otp/", payload: credentials }),
  });
};

export const useResetPassword = () => {
  return useMutation<ApiResponse<ResetPasswordResponse>, ApiResponseError, ResetPasswordCredentials>({
    mutationKey: ["reset-password"],
    mutationFn: async (credentials) => 
      await postRequest({ url: "/auth/password/reset/", payload: credentials }),
  });
};

export const useConfirmOTP = () => {
  return useMutation<ApiResponse<ConfirmOTPResponse>, ApiResponseError, ConfirmOTPCredentials>({
    mutationKey: ["confirm-otp"],
    mutationFn: async (credentials) => 
      await postRequest({ url: "/auth/password/reset-confirm/", payload: credentials }),
  });
};

export const useSetPassword = () => {
  return useMutation<ApiResponse<SetPasswordResponse>, ApiResponseError, SetPasswordCredentials>({
    mutationKey: ["set-password"],
    mutationFn: async (credentials) => 
      await postRequest({ url: "/hospital-admin/staff/set-password/", payload: credentials }),
  });
};

// Get user profile from Auth folder
export const useGetUserProfile = () => {
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  
  return useQuery<ApiResponse<UserProfile>, ApiResponseError>({
    queryKey: ["auth-profile", userRole],
    queryFn: async () => await getRequest({ url: "/auth/user/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user // Only run query if user is available
  });
};

// Update user profile from Auth folder
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { user } = storeFunctions.getState();
  const userRole = user?.role || "hospital_admin";
  
  return useMutation<ApiResponse<UserProfile>, ApiResponseError, UpdateProfilePayload>({
    mutationKey: ["auth-updateProfile", userRole],
    mutationFn: async (payload) => 
      await patchRequest({ url: "/auth/user/", payload }),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["auth-profile", userRole] });
      // Also invalidate the profile service cache if it exists
      queryClient.invalidateQueries({ queryKey: ["profile", userRole] });
    },
  });
};