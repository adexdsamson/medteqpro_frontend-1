"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useSupport } from "./SupportContext";

const MessageDetail = () => {
  const { messages, selectedMessageId, deleteMessage } = useSupport();

  // Find the selected message
  const selectedMessage = selectedMessageId 
    ? messages.find(message => message.id === selectedMessageId) 
    : null;

  if (!selectedMessage) {
    return (
      <div className="mb-6">
        <Card className="p-6 shadow-sm text-center text-gray-500">
          No message selected
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Card className="p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-base font-semibold">Message Details</h2>
          <button 
            className="text-red-500 hover:text-red-700"
            onClick={() => deleteMessage(selectedMessage.id)}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="prose max-w-none text-gray-700 text-sm">
          <p>{selectedMessage.content}</p>
        </div>
      </Card>
    </div>
  );
};

export default MessageDetail; 