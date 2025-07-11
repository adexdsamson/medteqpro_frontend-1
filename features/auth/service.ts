import { useMutation } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, User } from "@/types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
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