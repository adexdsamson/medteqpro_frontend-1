'use client';

import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ApiResponseList } from "@/types";

// =====================
// Enums and Utility Types
// =====================
export enum DrugRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum DrugAdministrationStatus {
  SCHEDULED = 'scheduled',
  ADMINISTERED = 'administered',
  MISSED = 'missed',
  CANCELLED = 'cancelled'
}

export enum DrugOrderStatus {
  PENDING = 'pending',
  READY_FOR_PICKUP = 'ready_for_pickup',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ReconciliationStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  DISCREPANCY = 'discrepancy'
}

// Common filter options type
export type FilterOptions = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  drugType?: string;
  drugCategory?: string;
};

// Pagination options
export type PaginationOptions = {
  page?: number;
  page_size?: number;
};

// =====================
// Types from API docs
// =====================
export type Drug = {
  id: string;
  hospital: string;
  drug_name: string;
  drug_type: string;
  drug_category: string;
  drug_expiry_date: string;
  drug_price: number;
  quantity_in_stock: number;
  initial_stock_at_creation?: number;
  countdown_to_expiration: number;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type DrugAdministration = {
  id: string;
  patient_name: string;
  hospital: string;
  patient_id: string;
  drug: {
    id: string;
    drug_name: string;
    drug_type: string;
    drug_category: string;
    drug_expiry_date: string;
    drug_price: number;
    quantity_in_stock: number;
    countdown_to_expiration: number;
    created_at: string;
    updated_at: string;
    created_by: string;
  };
  dosage: string;
  frequency: string;
  date_administered: string;
  quantity_administered: number;
  status: DrugAdministrationStatus | string; // Allow string for backward compatibility
  administered_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type DrugRequest = {
  id: string;
  hospital: string;
  drug_name_requested: string;
  drug_type_requested?: string;
  drug_category_requested?: string;
  quantity_requested: number;
  status: DrugRequestStatus | string; // Allow string for backward compatibility
  requested_by: string;
  reason_for_request: string;
  quantity_in_stock_of_requested_drug?: number;
  created_at?: string;
  updated_at?: string;
};

export type RequestDrugPayload = {
  drug_name_requested: string;
  drug_type_requested: string;
  drug_category_requested: string;
  quantity_requested: number;
  reason_for_request: string;
};

export type ApproveDrugRequestPayload = {
  quantity_approved: number;
};

export type RejectDrugRequestPayload = {
  rejection_reason: string;
};

export type DrugOrderItem = {
  drug: {
    id: string;
    drug_name: string;
  };
  quantity: number;
};

export type DrugOrder = {
  id: string;
  patient: string; // patient id or name depending on API; displaying name if available on backend
  pickup_date: string;
  status: DrugOrderStatus | string; // Allow string for backward compatibility
  items: DrugOrderItem[];
};

export type DrugOrdersOverview = {
  total_completed_orders: number;
  total_pending_pickups: number;
  total_cancelled_pickups: number;
};

export type DrugReconciliation = {
  id: string;
  hospital: string;
  drug_name: string;
  drug_type?: string;
  drug_category?: string;
  expiry_date: string;
  delivery_date: string;
  quantity_invoiced: number;
  quantity_delivered: number;
  discrepancy?: number;
  status?: ReconciliationStatus | string; // Allow string for backward compatibility
  created_at: string;
  updated_at: string;
  created_by: string;
};

// =====================
// Queries
// =====================
export const useGetDrugs = (options?: PaginationOptions & Pick<FilterOptions, 'search' | 'drugType' | 'drugCategory'>) => {
  return useQuery<ApiResponseList<Drug[]>, ApiResponseError>({
    queryKey: ["drugs", options],
    queryFn: async () => {
      let url = `drug-management/hospital/drugs/`;
      const params: string[] = [];
      if (options?.page) params.push(`page=${options.page}`);
      if (options?.page_size) params.push(`page_size=${options.page_size}`);
      if (options?.search) params.push(`search=${encodeURIComponent(options.search)}`);
      if (options?.drugType) params.push(`drug_type=${encodeURIComponent(options.drugType)}`);
      if (options?.drugCategory) params.push(`drug_category=${encodeURIComponent(options.drugCategory)}`);
      if (params.length) url += `?${params.join("&")}`;

      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetDrugAdministrations = (options?: Pick<FilterOptions, 'search' | 'status'> & { date_from?: string; date_to?: string }) => {
  return useQuery<ApiResponseList<DrugAdministration[]>, ApiResponseError>({
    queryKey: ["drug-administrations", options],
    queryFn: async () => {
      let url = `drug-management/hospital/drug-administrations/`;
      const params: string[] = [];
      if (options?.date_from) params.push(`date_from=${options.date_from}`);
      if (options?.date_to) params.push(`date_to=${options.date_to}`);
      if (options?.search) params.push(`search=${encodeURIComponent(options.search)}`);
      if (options?.status) params.push(`status=${encodeURIComponent(options.status)}`);
      if (params.length) url += `?${params.join("&")}`;

      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetDrugRequests = (options?: FilterOptions & { date_from?: string; date_to?: string }) => {
  return useQuery<ApiResponseList<DrugRequest[]>, ApiResponseError>({
    queryKey: ["drug-requests", options],
    queryFn: async () => {
      let url = `drug-management/hospital/drug-requests/`;
      const params: string[] = [];
      if (options?.date_from) params.push(`date_from=${options.date_from}`);
      if (options?.date_to) params.push(`date_to=${options.date_to}`);
      if (options?.search) params.push(`search=${encodeURIComponent(options.search)}`);
      if (options?.status) params.push(`status=${encodeURIComponent(options.status)}`);
      if (options?.drugType) params.push(`drug_type=${encodeURIComponent(options.drugType)}`);
      if (options?.drugCategory) params.push(`drug_category=${encodeURIComponent(options.drugCategory)}`);
      if (params.length) url += `?${params.join("&")}`;

      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetDrugOrders = (options?: { patient_type?: string; status?: string; search?: string }) => {
  return useQuery<ApiResponseList<DrugOrder[]>, ApiResponseError>({
    queryKey: ["drug-orders", options],
    queryFn: async () => {
      let url = `drug-management/hospital/drug-orders/`;
      const params: string[] = [];
      if (options?.patient_type) params.push(`patient_type=${options.patient_type}`);
      if (options?.status) params.push(`status=${options.status}`);
      if (options?.search) params.push(`search=${encodeURIComponent(options.search)}`);
      if (params.length) url += `?${params.join("&")}`;

      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetDrugOrdersOverview = () => {
  return useQuery<ApiResponse<DrugOrdersOverview>, ApiResponseError>({
    queryKey: ["drug-orders-overview"],
    queryFn: async () => await getRequest({ url: `drug-management/hospital/drug-orders/overview/` }),
    refetchOnWindowFocus: false,
  });
};

export const useGetDrugReconciliations = (options?: Pick<FilterOptions, 'search' | 'status'> & { date_from?: string; date_to?: string }) => {
  return useQuery<ApiResponseList<DrugReconciliation[]>, ApiResponseError>({
    queryKey: ["drug-reconciliations", options],
    queryFn: async () => {
      let url = `drug-management/hospital/drug-reconciliations/`;
      const params: string[] = [];
      if (options?.date_from) params.push(`date_from=${options.date_from}`);
      if (options?.date_to) params.push(`date_to=${options.date_to}`);
      if (options?.search) params.push(`search=${encodeURIComponent(options.search)}`);
      if (options?.status) params.push(`status=${encodeURIComponent(options.status)}`);
      if (params.length) url += `?${params.join("&")}`;

      return await getRequest({ url });
    },
    refetchOnWindowFocus: false,
  });
};

// =====================
// Mutations
// =====================
export const useRequestDrug = () => {
  return useMutation<ApiResponse<DrugRequest>, ApiResponseError, RequestDrugPayload>({
    mutationKey: ["request-drug"],
    mutationFn: async (payload) =>
      await postRequest<RequestDrugPayload>({ url: `drug-management/hospital/drug-requests/`, payload }),
  });
};

export const useApproveDrugRequest = (requestId: string | null) => {
  return useMutation<ApiResponse<DrugRequest>, ApiResponseError, ApproveDrugRequestPayload>({
    mutationKey: ["approve-drug-request", requestId],
    mutationFn: async (payload) =>
      await postRequest<ApproveDrugRequestPayload>({ url: `drug-management/hospital/drug-requests/${requestId}/approve/`, payload }),
  });
};

export const useRejectDrugRequest = (requestId: string | null) => {
  return useMutation<ApiResponse<DrugRequest>, ApiResponseError, RejectDrugRequestPayload>({
    mutationKey: ["reject-drug-request", requestId],
    mutationFn: async (payload) =>
      await postRequest<RejectDrugRequestPayload>({ url: `drug-management/hospital/drug-requests/${requestId}/reject/`, payload }),
  });
};