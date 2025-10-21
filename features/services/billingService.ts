/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest } from "@/lib/axiosInstance";
import { ApiListResponse, ApiResponse, ApiResponseError } from "@/types";

// Define types based on the API response structure
export interface BillResponse {
  id: string;
  patient_id: string;
  patient_fullname: string;
  purpose: string;
  total_amount: string;
  min_deposit: string;
  payment_method: string;
  status: string;
  amount_paid: string;
  remaining_amount: string;
  created_at: string;
  updated_at: string;
  comments?: string;
  drugs?: Array<{
    drug_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export interface CreateBillPayload {
  patient_id: string;
  purpose: string; // "drug", "lab_test", "treatment"
  total_amount: string;
  min_deposit?: string;
  payment_method?: string;
  comments?: string;
  drugs?: Array<{
    drug?: string;
    quantity?: number;
  }>;
}

export interface BillListParams {
  status?: string; // "pending", "cancelled", "completed"
  search?: string;
  patient_id?: string;
}

export interface PayBillPayload {
  amount: string;
  payment_method: string; // "cash", "pos", "paystack", "transfer"
}

export interface TransactionResponse {
  id: string;
  patient_id: string;
  patient_name: string;
  bill_id: string;
  bill_amount: string;
  amount: string;
  transaction_date: string;
  bill_purpose: string;
  payment_method: string;
  status: string;
  reference_number: string;
}

// Hook to get list of bills
export const useBillsList = (params?: BillListParams) => {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);
  if (params?.patient_id) queryParams.append("patient_id", params.patient_id);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/bill-management/bills/?${queryString}`
    : "/bill-management/bills/";

  return useQuery<ApiListResponse<BillResponse[]>, ApiResponseError>({
    queryKey: ["billsList", params],
    queryFn: async () => await getRequest({ url }),
  });
};

// Hook to get bill details
export const useBillDetails = (billId: string) => {
  return useQuery<
    ApiResponse<{ bill: BillResponse; transactions: TransactionResponse[] }>,
    ApiResponseError
  >({
    queryKey: ["billDetails", billId],
    queryFn: async () =>
      await getRequest({ url: `/bill-management/bills/${billId}/` }),
    enabled: !!billId,
  });
};

// Hook to create a new bill
export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<BillResponse>,
    ApiResponseError,
    CreateBillPayload
  >({
    mutationKey: ["createBill"],
    mutationFn: async (payload) =>
      await postRequest({ url: "/bill-management/bills/", payload }),
    onSuccess: () => {
      // Invalidate and refetch bills list
      queryClient.invalidateQueries({ queryKey: ["billsList"] });
    },
  });
};

// Hook to pay a bill
export const usePayBill = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<any>,
    ApiResponseError,
    { billId: string; payload: PayBillPayload }
  >({
    mutationKey: ["payBill"],
    mutationFn: async ({ billId, payload }) =>
      await postRequest({
        url: `/bill-management/bills/${billId}/pay/`,
        payload,
      }),
    onSuccess: (_, variables) => {
      // Invalidate and refetch bill details and bills list
      queryClient.invalidateQueries({
        queryKey: ["billDetails", variables.billId],
      });
      queryClient.invalidateQueries({ queryKey: ["billsList"] });
      queryClient.invalidateQueries({ queryKey: ["billTransactions"] });
    },
  });
};

// Hook to cancel a bill
export const useCancelBill = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiResponseError, string>({
    mutationKey: ["cancelBill"],
    mutationFn: async (billId) =>
      await postRequest({
        url: `/bill-management/bills/${billId}/cancel/`,
        payload: {},
      }),
    onSuccess: (_, billId) => {
      // Invalidate and refetch bill details and bills list
      queryClient.invalidateQueries({ queryKey: ["billDetails", billId] });
      queryClient.invalidateQueries({ queryKey: ["billsList"] });
    },
  });
};

// Hook to get bill transactions
export const useBillTransactions = (params?: {
  bill_id?: string;
  purpose?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.bill_id) queryParams.append("bill_id", params.bill_id);
  if (params?.purpose) queryParams.append("purpose", params.purpose);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/bill-management/transactions/?${queryString}`
    : "/bill-management/transactions/";

  return useQuery<ApiResponse<TransactionResponse[]>, ApiResponseError>({
    queryKey: ["billTransactions", params],
    queryFn: async () => await getRequest({ url }),
  });
};

// Hook to update bill status (PATCH /bill-management/bills/:bill_id/)
export const useUpdateBillStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<BillResponse>,
    ApiResponseError,
    { billId: string; status: string }
  >({
    mutationKey: ["updateBillStatus"],
    mutationFn: async ({ billId, status }) =>
      await patchRequest({
        url: `/bill-management/bills/${billId}/`,
        payload: { status },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["billDetails", variables.billId] });
      queryClient.invalidateQueries({ queryKey: ["billsList"] });
    },
  });
};
