"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "@/lib/axiosInstance";
import { ApiResponseError } from "@/types";

/**
 * Drug entity embedded in a pickup record's order items.
 */
export interface PickupDrug {
  id: string;
  drug_name: string;
  drug_type: string;
  drug_price: string; // Represented as string in API example
}

/**
 * Order item within a drug order.
 */
export interface PickupOrderItem {
  id: string;
  drug: PickupDrug;
  quantity: number;
}

/**
 * Drug order information embedded in a pickup record.
 */
export interface PickupDrugOrder {
  id: string;
  patient: string; // Derived patient name
  pickup_date: string; // ISO datetime
  status: string; // e.g., 'pending_pickup' | 'picked_up' | 'cancelled'
  items: PickupOrderItem[];
  created_at?: string;
}

/**
 * Pickup record as returned by the API.
 */
export interface PickupRecord {
  id: string;
  drug_order: PickupDrugOrder;
  pickup_date: string; // ISO datetime
  patient: string;
  created_at: string;
  updated_at: string;
}

/**
 * Request payload for creating a pickup record.
 */
export interface CreatePickupPayload {
  drug_order_id: string;
  pickup_date?: string; // ISO datetime (optional; defaults to now if omitted)
}

/**
 * Request payload for updating a pickup record (partial updates supported).
 */
export type UpdatePickupPayload = Partial<
  Pick<CreatePickupPayload, "pickup_date">
>;

/**
 * Overview statistics for pickup management.
 */
export interface PickupOverviewStats {
  total_picked_up_orders: number;
  total_pending_pickup_orders: number;
  total_cancelled_orders: number;
}

// Respect axios baseURL (which already includes /api/v1/); do not start with a leading slash
const BASE = "drug-management/hospital/pickups/";

/**
 * List pickup records with optional filters.
 *
 * @param options Optional filters: start_date (YYYY-MM-DD), end_date (YYYY-MM-DD), search (string)
 * @returns React Query result with an array of PickupRecord
 * @example
 * const { data } = usePickupRecords({ start_date: "2025-09-01", end_date: "2025-09-30", search: "John" });
 */
export const usePickupRecords = (options?: {
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  return useQuery<PickupRecord[], ApiResponseError>({
    queryKey: ["pickup-records", options],
    queryFn: async () => {
      let url = BASE;
      const params: string[] = [];
      if (options?.start_date)
        params.push(`start_date=${encodeURIComponent(options.start_date)}`);
      if (options?.end_date)
        params.push(`end_date=${encodeURIComponent(options.end_date)}`);
      if (options?.search)
        params.push(`search=${encodeURIComponent(options.search)}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const res = await getRequest({ url });
      return res.data as unknown as PickupRecord[];
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch pickup overview statistics.
 *
 * @returns React Query result containing PickupOverviewStats
 * @example
 * const { data } = usePickupOverview();
 */
export const usePickupOverview = () => {
  return useQuery<PickupOverviewStats, ApiResponseError>({
    queryKey: ["pickup-overview"],
    queryFn: async () => {
      const res = await getRequest({ url: `${BASE}overview/` });
      return res.data as unknown as PickupOverviewStats;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new pickup record.
 *
 * @returns useMutation for creating a pickup. On success, invalidates pickup records and overview queries.
 * @example
 * const { mutateAsync } = useCreatePickup();
 * await mutateAsync({ drug_order_id: "uuid", pickup_date: new Date().toISOString() });
 */
export const useCreatePickup = () => {
  const qc = useQueryClient();
  return useMutation<PickupRecord, ApiResponseError, CreatePickupPayload>({
    mutationFn: async (payload) => {
      const res = await postRequest({ url: BASE, payload });
      return res.data as unknown as PickupRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pickup-records"] });
      qc.invalidateQueries({ queryKey: ["pickup-overview"] });
    },
  });
};

/**
 * Update an existing pickup record.
 *
 * @param pickupId ID of the pickup to update
 * @returns useMutation for updating the pickup. On success, invalidates pickup records and overview queries.
 * @example
 * const { mutateAsync } = useUpdatePickup("pickup-uuid");
 * await mutateAsync({ pickup_date: new Date().toISOString() });
 */
export const useUpdatePickup = (pickupId: string) => {
  const qc = useQueryClient();
  return useMutation<PickupRecord, ApiResponseError, UpdatePickupPayload>({
    mutationFn: async (payload) => {
      const res = await patchRequest({ url: `${BASE}${pickupId}/`, payload });
      return res.data as unknown as PickupRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pickup-records"] });
      qc.invalidateQueries({ queryKey: ["pickup-overview"] });
    },
  });
};

/**
 * Delete a pickup record.
 *
 * @returns useMutation for deleting a pickup by ID. On success, invalidates pickup records and overview queries.
 * @example
 * const { mutateAsync } = useDeletePickup();
 * await mutateAsync("pickup-uuid");
 */
export const useDeletePickup = () => {
  const qc = useQueryClient();
  return useMutation<void, ApiResponseError, string>({
    mutationFn: async (pickupId) => {
      await deleteRequest({ url: `${BASE}${pickupId}/` });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pickup-records"] });
      qc.invalidateQueries({ queryKey: ["pickup-overview"] });
    },
  });
};
