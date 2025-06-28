'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, deleteRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ApiList } from "@/types";
import { format } from "date-fns";

// Define types based on the API response structure
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_by: string;
  created_by_name: string;
  created_by_email: string;
  hospital: string;
  hospital_name: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  messages_count: number;
  latest_message_date: string;
}

export interface SupportMessage {
  id: string;
  message: string;
  sender: string;
  sender_email: string;
  sender_name: string;
  sender_role: string;
  attachment: string | null;
  attachment_name: string | null;
  created_at: string;
}

export interface SupportTicketWithMessages extends SupportTicket {
  messages: SupportMessage[];
}

// Format date from API to display format
export const formatMessageDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "dd-MMM-yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Hook for fetching all support tickets
export const useSupportTickets = (filters?: { status?: string; priority?: string; search?: string }) => {
  let queryString = "";
  if (filters) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.search) params.append("search", filters.search);
    queryString = params.toString() ? `?${params.toString()}` : "";
  }

  return useQuery<ApiResponse<ApiList<SupportTicket[]>>, ApiResponseError>({
    queryKey: ["support-tickets", filters],
    queryFn: async () => await getRequest({ url: `/support/tickets/${queryString}` }),
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching a specific ticket with messages
export const useSupportTicketDetail = (ticketId: string | null) => {
  return useQuery<ApiResponse<SupportTicketWithMessages>, ApiResponseError>({
    queryKey: ["support-ticket", ticketId],
    queryFn: async () => await getRequest({ url: `/support/tickets/${ticketId}/` }),
    enabled: !!ticketId, // Only run query if ticketId is provided
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching messages for a specific ticket
export const useSupportTicketMessages = (ticketId: string | null) => {
  return useQuery<ApiResponse<SupportMessage[]>, ApiResponseError>({
    queryKey: ["support-messages", ticketId],
    queryFn: async () => await getRequest({ url: `/support/tickets/${ticketId}/messages/` }),
    enabled: !!ticketId, // Only run query if ticketId is provided
    refetchOnWindowFocus: false,
  });
};

// Hook for sending a reply to a ticket
export const useSendReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<SupportMessage>,
    ApiResponseError,
    { ticketId: string; message: string }
  >({
    mutationFn: async ({ ticketId, message }) => {
      return await postRequest({
        url: `/support/tickets/${ticketId}/messages/`,
        payload: { message },
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the messages query to update the UI
      queryClient.invalidateQueries({ queryKey: ["support-messages", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};

// Hook for deleting a message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<void>,
    ApiResponseError,
    { ticketId: string; messageId: string }
  >({
    mutationFn: async ({ ticketId, messageId }) => {
      return await deleteRequest({
        url: `/support/tickets/${ticketId}/messages/${messageId}/`,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the messages query to update the UI
      queryClient.invalidateQueries({ queryKey: ["support-messages", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.ticketId] });
    },
  });
};

// Hook for creating a new ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<SupportTicket>,
    ApiResponseError,
    { subject: string; description: string; priority: string }
  >({
    mutationFn: async (ticketData) => {
      return await postRequest({
        url: "/support/tickets/",
        payload: ticketData,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the tickets list
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};

// Hook for updating ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ApiResponse<SupportTicket>,
    ApiResponseError,
    { ticketId: string; status: string }
  >({
    mutationFn: async ({ ticketId, status }) => {
      return await putRequest({
        url: `/support/tickets/${ticketId}/change-status/`,
        payload: { status },
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the ticket and tickets list
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};