"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

// Types based strictly on docs/api_docs.txt for auth/settings/availability/
// POST body: { day_of_week: string, start_time: string, end_time: string, duration_minutes: number }
// PATCH body: { start_time?: string, end_time?: string, duration_minutes?: number } with query ?day_of_week=Monday
// Response example includes: id, day_of_week, start_time, end_time, duration_minutes, is_available

export type AvailabilityItem = {
  id: number;
  day_of_week: string;
  start_time: string; // "HH:mm:ss"
  end_time: string;   // "HH:mm:ss"
  duration_minutes: number;
  is_available: boolean;
};

export type CreateAvailabilityRequest = {
  day_of_week: string;
  start_time: string; // "HH:mm:ss"
  end_time: string;   // "HH:mm:ss"
  duration_minutes: number;
};

export type UpdateAvailabilityRequest = {
  start_time?: string; // "HH:mm:ss"
  end_time?: string;   // "HH:mm:ss"
  duration_minutes?: number;
};

const AVAILABILITY_URL = "/auth/settings/availability/";

export const useGetAvailability = () => {
  return useQuery<ApiResponse<AvailabilityItem[]>, ApiResponseError>({
    queryKey: ["getAvailability"],
    queryFn: async () => await getRequest({ url: AVAILABILITY_URL }),
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<AvailabilityItem>, ApiResponseError, CreateAvailabilityRequest>({
    mutationKey: ["createAvailability"],
    mutationFn: async (payload) => await postRequest({ url: AVAILABILITY_URL, payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAvailability"] });
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AvailabilityItem>,
    ApiResponseError,
    { day_of_week: string; payload: UpdateAvailabilityRequest }
  >({
    mutationKey: ["updateAvailability"],
    mutationFn: async ({ day_of_week, payload }) =>
      await patchRequest({ url: `${AVAILABILITY_URL}?day_of_week=${encodeURIComponent(day_of_week)}`, payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAvailability"] });
    },
  });
};