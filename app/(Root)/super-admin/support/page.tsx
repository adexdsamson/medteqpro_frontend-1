import React from "react";
import SupportTabs from "./_components/SupportTabs";
import MessageList from "./_components/MessageList";
import MessageDetail from "./_components/MessageDetail";
import ReplyBox from "./_components/ReplyBox";
import { SupportProvider } from "./_components/SupportContext";

export default function SupportPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Support</h1>
      </div>

      <SupportProvider>
        <SupportTabs />
        
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5">
            <MessageList />
          </div>
          
          <div className="w-full md:w-3/5">
            <MessageDetail />
            <ReplyBox />
          </div>
        </div>
      </SupportProvider>
    </div>
  );
} 