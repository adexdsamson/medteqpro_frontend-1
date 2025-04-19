"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useSupport } from "./SupportContext";

const ReplyBox = () => {
  const [message, setMessage] = useState("");
  const { selectedMessageId, sendReply } = useSupport();

  const handleSendMessage = () => {
    if (message.trim() && selectedMessageId) {
      sendReply(message);
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="p-4">
        <Textarea
          placeholder="Your message"
          className="min-h-[100px] resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!selectedMessageId}
        />
      </div>
      <div className="flex justify-end p-4 pt-0">
        <Button 
          onClick={handleSendMessage} 
          disabled={!message.trim() || !selectedMessageId}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Send
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ReplyBox; 