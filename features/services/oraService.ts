"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ApiResponseList } from "@/types";

export interface ORARecordListItem {
  id: string;
  patient_id: string;
  patient_fullname: string;
  ora_type: string;
  date_registered: string;
}

export interface CreateORARecordPayload {
  patient: string;
  ora_type: "observed" | "admitted" | "referred" | string;
  reason: string;
  hours_observed?: number;
  referrer_hospital?: string | null;
  referrer_department?: string | null;
}

export interface ORARecordDetail {
  id: string;
  ora_type: string;
  hospital_name: string;
  reason: string;
  hours_observed: number | null;
  referrer_hospital: string | null;
  referrer_department: string | null;
  date_created: string;
  doctor_name: string;
  patient_details: {
    id: string;
    full_name: string;
    phone_number: string | null;
  };
}

export type PaginationOptions = {
  page?: number;
  page_size?: number;
  search?: string;
};

export const useGetORARecords = (options?: PaginationOptions) => {
  return useQuery<{ results: ORARecordListItem[]; count: number }, ApiResponseError>({
    queryKey: ["ora-records", options?.page, options?.page_size, options?.search],
    queryFn: async () => {
      const params: string[] = [];
      if (options?.page) params.push(`page=${options.page}`);
      if (options?.page_size) params.push(`page_size=${options.page_size}`);
      if (options?.search) params.push(`search=${encodeURIComponent(options.search)}`);
      const query = params.length ? `?${params.join("&")}` : "";
      const response = (await getRequest({
        url: `/ora-management/records/${query}`,
      })) as ApiResponseList<ORARecordListItem[]>;
      const data = response?.data;
      return { results: data?.results || [], count: data?.count || 0 };
    },
  });
};

export const useGetORARecordDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<ORARecordDetail, ApiResponseError>({
    queryKey: ["ora-record-detail", id],
    queryFn: async () => {
      const response = await getRequest({ url: `/ora-management/records/${id}/` });
      return response.data?.data as ORARecordDetail;
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
};

export const useCreateORARecord = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ORARecordDetail>, ApiResponseError, CreateORARecordPayload>({
    mutationFn: async (payload) =>
      await postRequest({ url: `/ora-management/records/`, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ora-records"] });
    },
  });
};

export const useDeleteORARecord = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ message?: string }>, ApiResponseError, string>({
    mutationFn: async (id) => await deleteRequest({ url: `/ora-management/records/${id}/` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ora-records"] });
    },
  });
};