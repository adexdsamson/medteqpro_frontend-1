"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSupport } from "./SupportContext";

const MessageList = () => {
  const { filteredMessages, selectedMessageId, selectMessage, loadMoreMessages } = useSupport();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {filteredMessages.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No messages found
        </div>
      ) : (
        <>
          <div className="divide-y">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedMessageId === message.id ? "bg-blue-50" : ""
                }`}
                onClick={() => selectMessage(message.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={message.avatar}
                      alt={message.sender}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">{message.sender}</p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          Date: {message.date}
                        </span>
                        {message.status === "unread" && (
                          <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-sm">
                            Unread
                          </span>
                        )}
                        {message.status === "read" && (
                          <span className="ml-2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded-sm">
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center p-4 border-t">
            <Button 
              variant="outline" 
              className="text-gray-600"
              onClick={loadMoreMessages}
            >
              Load more
              <svg className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none">
                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageList; 