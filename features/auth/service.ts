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

export const useLogin = () => {
  return useMutation<ApiResponse<LoginResponse>, ApiResponseError, LoginCredentials>({
    mutationKey: ["login"],
    mutationFn: async (credentials) => 
      await postRequest("/auth/login/", credentials),
  });
};