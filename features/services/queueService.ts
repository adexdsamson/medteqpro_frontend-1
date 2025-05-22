import { useMutation, useQuery } from '@tanstack/react-query';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/axiosInstance';

// Types
export type QueueEntry = {
  id?: string;
  counter: number;
  serialNumber: string;
  patientId: string;
  patientName?: string;
  roomAssigned: string;
  estimatedTime: string;
  createdAt?: string;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type ApiResponseError = {
  message: string;
  status: number;
};

// API functions
const getQueueEntries = async () => {
  // This would be replaced with the actual API endpoint
  const response = await getRequest('/api/queue');
  return response.data;
};

const addQueueEntry = async (entry: Omit<QueueEntry, 'id' | 'counter' | 'createdAt'>) => {
  // This would be replaced with the actual API endpoint
  const response = await postRequest('/api/queue', entry);
  return response.data;
};

const updateQueueEntry = async (entry: QueueEntry) => {
  // This would be replaced with the actual API endpoint
  const response = await putRequest(`/api/queue/${entry.id}`, entry);
  return response.data;
};

const removeQueueEntry = async (id: string) => {
  // This would be replaced with the actual API endpoint
  const response = await deleteRequest(`/api/queue/${id}`);
  return response.data;
};

// React Query hooks
export const useGetQueueEntries = () => {
  return useQuery<ApiResponse<QueueEntry[]>, ApiResponseError>({
    queryKey: ['queue'], 
    queryFn: getQueueEntries
  });
};

export const useAddQueueEntry = () => {
  return useMutation<
    ApiResponse<QueueEntry>,
    ApiResponseError,
    Omit<QueueEntry, 'id' | 'counter' | 'createdAt'>
  >({
    mutationFn: (entry) => addQueueEntry(entry)
  });
};

export const useUpdateQueueEntry = () => {
  return useMutation<ApiResponse<QueueEntry>, ApiResponseError, QueueEntry>({
    mutationFn: (entry) => updateQueueEntry(entry)
  });
};

export const useRemoveQueueEntry = () => {
  return useMutation<ApiResponse<void>, ApiResponseError, string>(
    {
      mutationFn: (id) => removeQueueEntry(id)
    }
  );
};