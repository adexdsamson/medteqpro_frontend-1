import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

/**
 * Availability item returned by the API for a doctor's weekly schedule.
 * Uses no_of_slots to indicate how many appointment slots exist between start and end times.
 * @property {number} id Unique identifier
 * @property {string} day_of_week Day name (e.g., Monday)
 * @property {string} start_time Start time (HH:mm:ss)
 * @property {string} end_time End time (HH:mm:ss)
 * @property {number} [no_of_slots] Number of slots within the window (optional until backend guarantees presence)
 * @property {boolean} is_available Whether the day is available for booking
 */
export type AvailabilityItem = {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  no_of_slots?: number;
  is_available: boolean;
};

/**
 * Payload to create a single availability entry (slot-based model).
 * @property {string} day_of_week Day name (e.g., Monday)
 * @property {string} start_time Start time (HH:mm:ss)
 * @property {string} end_time End time (HH:mm:ss)
 * @property {number} no_of_slots Number of slots within the window
 */
export type CreateAvailabilityItem = {
  day_of_week: string;
  start_time: string;
  end_time: string;
  no_of_slots: number;
};

/** Request body for creating availability (single or bulk). */
export type CreateAvailabilityRequest =
  | CreateAvailabilityItem
  | CreateAvailabilityItem[];

/**
 * Payload to update an availability entry (slot-based model).
 * All fields optional for partial updates.
 * @property {string} [start_time]
 * @property {string} [end_time]
 * @property {number} [no_of_slots]
 */
export type UpdateAvailabilityRequest = {
  start_time?: string;
  end_time?: string;
  no_of_slots?: number;
};

/** Toggle availability request body for a given day. */
export type ToggleAvailabilityRequest = {
  day_of_week: string;
  is_available: boolean;
};

const AVAILABILITY_URL = "/auth/settings/availability/";

/**
 * Fetch all availability entries for the current doctor.
 * @returns React Query useQuery result with list of AvailabilityItem
 */
export const useGetAvailability = () => {
  return useQuery<ApiResponse<AvailabilityItem[]>, ApiResponseError>({
    queryKey: ["getAvailability"],
    queryFn: async () => await getRequest({ url: AVAILABILITY_URL }),
  });
};

/**
 * Create availability settings (single or bulk).
 * @returns React Query useMutation for creating availability; response may be a single item or an array
 */
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AvailabilityItem | AvailabilityItem[]>,
    ApiResponseError,
    CreateAvailabilityRequest
  >({
    mutationKey: ["createAvailability"],
    mutationFn: async (payload) =>
      await postRequest({ url: AVAILABILITY_URL, payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAvailability"] });
    },
  });
};

/**
 * Update availability for a specific day using query parameter `day_of_week`.
 * @returns React Query useMutation for updating a day's availability.
 */
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AvailabilityItem>,
    ApiResponseError,
    { day_of_week: string; payload: UpdateAvailabilityRequest }
  >({
    mutationKey: ["updateAvailability"],
    mutationFn: async ({ day_of_week, payload }) =>
      await patchRequest({
        url: `${AVAILABILITY_URL}?day_of_week=${encodeURIComponent(day_of_week)}`,
        payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAvailability"] });
    },
  });
};

/**
 * Toggle availability state for a given day.
 * @returns React Query useMutation for toggling a day's availability.
 */
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AvailabilityItem>,
    ApiResponseError,
    ToggleAvailabilityRequest
  >({
    mutationKey: ["toggleAvailability"],
    mutationFn: async (payload) =>
      await patchRequest({ url: `${AVAILABILITY_URL}toggle/`, payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAvailability"] });
    },
  });
};