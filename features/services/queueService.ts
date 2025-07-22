/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/axiosInstance';
import { format } from 'date-fns';

// Types
export type QueueEntry = {
  id: string;
  patient_id: string;
  patient_fullname: string;
  patient_gender: string;
  assigned_hospital_staff_fullname: string;
  estimated_waiting_time: number;
  status: string;
  priority: string;
  purpose: string;
  created_at: string;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: boolean;
};

export type ApiResponseError = {
  message: string;
  status: number;
};

export type AddQueueEntryRequest = {
  patient: string;
  hospital_staff: string;
  purpose: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  estimated_waiting_time: number;
};

// API functions
const getQueueEntries = async () => {
  const response = await getRequest({
    url: 'queue-management/'
  });
  return response.data;
};

const getQueueOverview = async () => {
  const response = await getRequest({
    url: 'queue-management/overview/'
  });
  return response.data;
};

const addQueueEntry = async (entry: AddQueueEntryRequest) => {
  const response = await postRequest({
    url: 'queue-management/add-patient/',
    payload: entry
  });
  return response.data;
};

const updateQueueStatus = async ({ queue_id, status }: { queue_id: string; status: string }) => {
  const response = await putRequest({
    url: `queue-management/update-status/${queue_id}/`,
    payload: { status }
  });
  return response.data;
};

const removeQueueEntry = async (id: string) => {
  const response = await deleteRequest({
    url: `queue-management/${id}/`
  });
  return response.data;
};

// Helper function to format dates using date-fns
export const formatQueueDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

// React Query hooks
export const useGetQueueEntries = () => {
  return useQuery<ApiResponse<QueueEntry[]>, ApiResponseError>({
    queryKey: ['queue'], 
    queryFn: getQueueEntries
  });
};

export const useGetQueueOverview = () => {
  return useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ['queueOverview'], 
    queryFn: getQueueOverview
  });
};

export const useAddQueueEntry = () => {
  return useMutation<
    ApiResponse<AddQueueEntryRequest>,
    ApiResponseError,
    AddQueueEntryRequest
  >({
    mutationFn: (entry) => addQueueEntry(entry)
  });
};

export const useUpdateQueueStatus = () => {
  return useMutation<ApiResponse<any>, ApiResponseError, { queue_id: string; status: string }>({
    mutationFn: (params) => updateQueueStatus(params)
  });
};

export const useRemoveQueueEntry = () => {
  return useMutation<ApiResponse<void>, ApiResponseError, string>(
    {
      mutationFn: (id) => removeQueueEntry(id)
    }
  );
};