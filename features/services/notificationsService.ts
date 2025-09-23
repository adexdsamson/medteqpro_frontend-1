import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";
import type { ApiResponse, ApiResponseError } from "@/types";
import type { AxiosResponse } from "axios";

/**
 * Notification entity returned by the notifications API.
 * @property {string|number} id - Unique identifier of the notification
 * @property {string} title - Notification title
 * @property {string} message - Notification body/preview message
 * @property {string} notification_type - Type or category (e.g., "info")
 * @property {boolean} is_read - Whether the notification has been read
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} [updated_at] - ISO timestamp of last update
 */
export interface Notification {
  id: string | number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Paginated response for notifications list as returned by the API.
 * Note: This endpoint is NOT wrapped in the global Api<T> envelope.
 * @property {number} count - Total count of notifications
 * @property {string|null} next - URL to next page (if any)
 * @property {string|null} previous - URL to previous page (if any)
 * @property {Notification[]} results - Array of notifications
 */
export type NotificationsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
};

/**
 * Statistics response structure for notifications.
 * This endpoint IS wrapped in Api<T> envelope.
 * @property {number} total - Total notifications
 * @property {number} unread - Unread notifications
 * @property {number} read - Read notifications
 */
export type NotificationStats = {
  total: number;
  unread: number;
  read: number;
};

/**
 * React Query keys for notifications feature.
 */
export const notificationsKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationsKeys.all, "list"] as const,
  stats: () => [...notificationsKeys.all, "stats"] as const,
  detail: (id: string | number) => [...notificationsKeys.all, "detail", String(id)] as const,
};

/**
 * Fetch notifications list with optional query parameters.
 * This endpoint returns an AxiosResponse<NotificationsListResponse>.
 *
 * @param {object} params - Optional query parameters (search, start_date, end_date, patient_type)
 * @returns {ReturnType<typeof useQuery>} React Query useQuery result
 * @example
 * const { data } = useNotificationsList();
 */
export const useNotificationsList = (params?: Record<string, string | number | boolean>) => {
  return useQuery<AxiosResponse<NotificationsListResponse>, ApiResponseError>({
    queryKey: params ? ([...notificationsKeys.list(), params] as const) : notificationsKeys.list(),
    queryFn: async () =>
      await getRequest({
        url: "/notifications/",
        config: params ? { params } : undefined,
      }),
  });
};

/**
 * Fetch notifications statistics (total, unread, read).
 * This endpoint is wrapped as Api<NotificationStats>.
 *
 * @returns {ReturnType<typeof useQuery>} React Query useQuery result
 * @example
 * const { data } = useNotificationStats();
 */
export const useNotificationStats = (options?: UseQueryOptions<ApiResponse<NotificationStats>, ApiResponseError>) => {
  return useQuery<ApiResponse<NotificationStats>, ApiResponseError>({
    queryKey: notificationsKeys.stats(),
    queryFn: async () => await getRequest({ url: "/notifications/stats/" }),
    ...(options ?? {}),
  });
};

/**
 * Fetch a single notification by id.
 * Wrapped in Api<Notification>.
 *
 * @param {string|number} id - Notification id
 * @returns {ReturnType<typeof useQuery>} React Query useQuery result
 */
export const useNotificationDetail = (id: string | number, options?: UseQueryOptions<ApiResponse<Notification>, ApiResponseError>) => {
  return useQuery<ApiResponse<Notification>, ApiResponseError>({
    queryKey: notificationsKeys.detail(id),
    queryFn: async () => await getRequest({ url: `/notifications/${id}/` }),
    enabled: !!id,
    ...(options ?? {}),
  });
};

/**
 * Mark all notifications as read.
 * Returns Api<{ count: number }>.
 *
 * @returns {ReturnType<typeof useMutation>} React Query useMutation result
 * @example
 * const { mutateAsync } = useMarkAllNotificationsRead();
 * await mutateAsync();
 */
export const useMarkAllNotificationsRead = () => {
  return useMutation<ApiResponse<{ count: number }>, ApiResponseError, void>({
    mutationKey: ["notifications", "mark-all-read"],
    mutationFn: async () => await postRequest({ url: "/notifications/mark-all-read/", payload: {} }),
  });
};

/**
 * Update a single notification (e.g., toggle is_read).
 * Returns Api<Notification>.
 *
 * @param {string|number} id - Notification id
 * @returns {ReturnType<typeof useMutation>} React Query useMutation result
 * @example
 * const { mutateAsync } = useUpdateNotification(1);
 * await mutateAsync({ is_read: true });
 */
export const useUpdateNotification = (id: string | number) => {
  return useMutation<ApiResponse<Notification>, ApiResponseError, Partial<Pick<Notification, "is_read">>>({
    mutationKey: ["notifications", "update", String(id)],
    mutationFn: async (payload) =>
      await patchRequest({ url: `/notifications/${id}/update/`, payload }),
  });
};

/**
 * Delete all notifications.
 *
 * @returns {ReturnType<typeof useMutation>} React Query useMutation result
 */
export const useDeleteAllNotifications = () => {
  return useMutation<AxiosResponse<unknown>, ApiResponseError, void>({
    mutationKey: ["notifications", "delete-all"],
    mutationFn: async () => await deleteRequest({ url: "/notifications/delete-all/" }),
  });
};