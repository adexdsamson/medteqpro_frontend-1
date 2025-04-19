"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupport, type FilterType } from "./SupportContext";

const SupportTabs = () => {
  const { filter, setFilter, unreadCount } = useSupport();

  return (
    <div>
      <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)} className="w-auto">
        <TabsList className="grid grid-cols-3 w-auto max-w-[400px]">
          <TabsTrigger value="all" className="px-8">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="px-8">
            <div className="flex items-center">
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 bg-gray-200 text-gray-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="read" className="px-8">
            Read
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SupportTabs; 