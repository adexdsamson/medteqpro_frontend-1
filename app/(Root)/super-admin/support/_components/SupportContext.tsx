/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  useSupportTickets, 
  useSupportTicketDetail, 
  useSendReply, 
  useDeleteMessage,
  formatMessageDate,
  SupportTicket,
  SupportMessage
} from "@/features/services/supportService";
import { useToastHandler } from "@/hooks/useToaster";

// Message type definition
export type MessageStatus = "read" | "unread";

export interface Message {
  id: number;
  sender: string;
  avatar: string;
  date: string;
  preview: string;
  status: MessageStatus;
  content?: string;
}

// Convert API ticket/message to UI message format
const convertToMessage = (ticket: SupportTicket, message?: SupportMessage): Message => {
  // Use the first part of the message or description as preview
  const previewText = message?.message || ticket.description;
  const preview = previewText.length > 50 ? `${previewText.substring(0, 50)}...` : previewText;
  
  return {
    id: parseInt(message?.id || ticket.id),
    sender: message?.sender_name || ticket.created_by_name,
    avatar: "/images/avatar1.png", // Default avatar
    date: formatMessageDate(message?.created_at || ticket.created_at),
    preview,
    status: "unread", // Default status, will be updated based on read/unread logic
    content: message?.message || ticket.description,
  };
};

// Sample message data for fallback
const initialMessages: Message[] = [];


export type FilterType = "all" | "unread" | "read";

// Context type definition
interface SupportContextType {
  messages: Message[];
  filteredMessages: Message[];
  selectedMessageId: number | null;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  selectMessage: (id: number) => void;
  markAsRead: (id: number) => void;
  deleteMessage: (id: number) => void;
  sendReply: (content: string) => void;
  loadMoreMessages: () => void;
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
}

// Create context
const SupportContext = createContext<SupportContextType | undefined>(undefined);

// Provider component
export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToastHandler();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [readMessageIds, setReadMessageIds] = useState<Set<number>>(new Set());
  const [_, setPage] = useState<number>(1);
  
  // Fetch support tickets from API
  const { 
    data: ticketsData, 
    isLoading: isTicketsLoading, 
    isError: isTicketsError 
  } = useSupportTickets();
  
  // Fetch selected ticket details when a ticket is selected
  const { 
    data: ticketDetailData,
    isLoading: isTicketDetailLoading,
  } = useSupportTicketDetail(
    selectedMessageId ? String(selectedMessageId) : null
  );
  
  // Mutations for API operations
  const sendReplyMutation = useSendReply();
  const deleteMessageMutation = useDeleteMessage();
  
  // Process tickets data when it's loaded
  useEffect(() => {
    if (ticketsData?.data?.data?.results) {
      const apiMessages: Message[] = ticketsData?.data?.data?.results?.map(ticket => {
        // Convert API ticket to UI message format
        return convertToMessage(ticket);
      });
      
      setMessages(apiMessages);
      
      // Select the first message if none is selected
      if (selectedMessageId === null && apiMessages.length > 0) {
        setSelectedMessageId(apiMessages[0].id);
      }
    }
  }, [ticketsData, selectedMessageId]);
  
  // Calculate filtered messages based on current filter
  const filteredMessages = messages.filter(message => {
    if (filter === "all") return true;
    const isRead = readMessageIds.has(message.id);
    return filter === "read" ? isRead : !isRead;
  });
  
  // Get count of unread messages
  const unreadCount = messages.filter(message => !readMessageIds.has(message.id)).length;

  // Select a message and mark it as read
  const selectMessage = (id: number) => {
    setSelectedMessageId(id);
    markAsRead(id);
  };

  // Mark a message as read
  const markAsRead = (id: number) => {
    setReadMessageIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  // Delete a message
  const deleteMessage = (id: number) => {
    if (!selectedMessageId) return;
    
    // Call API to delete the message
    deleteMessageMutation.mutate(
      { 
        ticketId: String(id), 
        messageId: ticketDetailData?.data.data?.messages?.[0]?.id || ""
      },
      {
        onSuccess: () => {
          toast.success("Message deleted", "The message has been successfully deleted.");
          
          // Update local state
          setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
          
          // Select the first message in the filtered list, or null if none
          if (selectedMessageId === id) {
            const nextMessage = filteredMessages.find(m => m.id !== id);
            setSelectedMessageId(nextMessage ? nextMessage.id : null);
          }
        },
        onError: (error) => {
          toast.error("Error", `Failed to delete message: ${error.message}`);
        }
      }
    );
  };

  // Send a reply
  const sendReply = (content: string) => {
    if (!selectedMessageId || !content.trim()) return;
    
    // Call API to send the reply
    sendReplyMutation.mutate(
      { ticketId: String(selectedMessageId), message: content },
      {
        onSuccess: () => {
          toast.success("Reply sent", "Your reply has been sent successfully.");
        },
        onError: (error) => {
          toast.error("Error", `Failed to send reply: ${error.message}`);
        }
      }
    );
  };

  // Load more messages
  const loadMoreMessages = () => {
    setPage(prev => prev + 1);
    // The actual loading is handled by the React Query hook with pagination
  };

  // Update selected message if current one is deleted or filtered out
  useEffect(() => {
    if (selectedMessageId === null && filteredMessages.length > 0) {
      setSelectedMessageId(filteredMessages[0].id);
    } else if (
      selectedMessageId !== null &&
      !filteredMessages.some(m => m.id === selectedMessageId) &&
      filteredMessages.length > 0
    ) {
      setSelectedMessageId(filteredMessages[0].id);
     }
  }, [selectedMessageId, messages, filter, readMessageIds]);

  // Context value
  const value: SupportContextType = {
    messages,
    filteredMessages,
    selectedMessageId,
    filter,
    setFilter,
    selectMessage,
    markAsRead,
    deleteMessage,
    sendReply,
    loadMoreMessages,
    unreadCount,
    isLoading: isTicketsLoading || isTicketDetailLoading,
    isError: isTicketsError,
  };

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
};

// Custom hook to use the support context
export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
};