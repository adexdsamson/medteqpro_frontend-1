"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

// Sample message data
const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Greenlife",
    avatar: "/images/avatar1.png",
    date: "22-Apr-2024",
    preview: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    status: "unread",
    content: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sociis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse namconsectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
  {
    id: 2,
    sender: "Greenlife",
    avatar: "/images/avatar1.png",
    date: "22-Apr-2024",
    preview: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    status: "read",
    content: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sociis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse namconsectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
  {
    id: 3,
    sender: "Dr Salami",
    avatar: "/images/avatar2.png",
    date: "22-Apr-2024",
    preview: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    status: "read",
    content: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sociis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse namconsectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
  {
    id: 4,
    sender: "Dr Salami",
    avatar: "/images/avatar2.png",
    date: "22-Apr-2024",
    preview: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    status: "read",
    content: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sociis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse namconsectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
  {
    id: 5,
    sender: "Dr Salami",
    avatar: "/images/avatar2.png",
    date: "22-Apr-2024",
    preview: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    status: "read",
    content: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sociis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse namconsectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
];

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
}

// Create context
const SupportContext = createContext<SupportContextType | undefined>(undefined);

// Provider component
export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(1);
  const [filter, setFilter] = useState<FilterType>("all");
  
  // Calculate filtered messages based on current filter
  const filteredMessages = messages.filter(message => {
    if (filter === "all") return true;
    return message.status === filter;
  });
  
  // Get count of unread messages
  const unreadCount = messages.filter(message => message.status === "unread").length;

  // Select a message and mark it as read
  const selectMessage = (id: number) => {
    setSelectedMessageId(id);
    markAsRead(id);
  };

  // Mark a message as read
  const markAsRead = (id: number) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, status: "read" } : message
      )
    );
  };

  // Delete a message
  const deleteMessage = (id: number) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
    if (selectedMessageId === id) {
      // Select the first message in the filtered list, or null if none
      const nextMessage = filteredMessages.find(m => m.id !== id);
      setSelectedMessageId(nextMessage ? nextMessage.id : null);
    }
  };

  // Send a reply (would connect to API in real app)
  const sendReply = (content: string) => {
    console.log(`Replying to message #${selectedMessageId}: ${content}`);
    // In a real app, this would send the reply to the API
  };

  // Load more messages (would connect to API in real app)
  const loadMoreMessages = () => {
    console.log("Loading more messages...");
    // In a real app, this would fetch more messages from the API
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
  }, [selectedMessageId, filteredMessages]);

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