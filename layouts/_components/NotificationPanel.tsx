"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Shape of a notification item displayed in the panel
 */
export interface NotificationItemData {
  id: string;
  title: string;
  message: string;
  timestamp: string; // pre-formatted time string e.g. "Yesterday, 11:23am"
  isNew?: boolean;
}

/**
 * Individual notification row component.
 * Renders the title, preview message, timestamp and actions.
 *
 * @param {object} props - Component props
 * @param {NotificationItemData} props.item - Notification data to render
 * @param {(id: string) => void} props.onRemove - Callback to remove the item
 * @returns {JSX.Element} Rendered notification row
 * @example
 * <NotificationRow item={item} onRemove={handleRemove} />
 */
function NotificationRow({
  item,
  onRemove,
}: {
  item: NotificationItemData;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-sm font-semibold text-gray-900",
              item.isNew && ""
            )}
          >
            {item.title}
          </p>
          {item.isNew ? (
            <span
              className="inline-flex h-2 w-2 rounded-full bg-red-500"
              aria-hidden
            />
          ) : null}
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate max-w-[32ch] sm:max-w-[56ch]">
          {item.message}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-xs sm:text-sm text-red-500 hover:underline mt-1"
        >
          Remove
        </button>
      </div>
      <div className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap ml-2">
        {item.timestamp}
      </div>
    </div>
  );
}

/**
 * Notification panel content rendered inside the AppHeader popover.
 * Provides tabs for "New" and "All Notifications", a "Mark all as read" action,
 * and a scrollable list of notification items.
 *
 * - Pure UI implementation. No API calls here. Integrate later via props.
 * - If `items` prop is not provided, the panel shows a small demo list.
 *
 * @param {object} props - Component props
 * @param {NotificationItemData[]} [props.items] - Optional list of notifications to render
 * @returns {JSX.Element} Rendered notification panel content
 * @example
 * <NotificationPanel />
 */
export function NotificationPanel({
  items,
  onMarkAllAsRead,
}: {
  items?: NotificationItemData[];
  onMarkAllAsRead?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"new" | "all">("new");

  const initialItems = useMemo<NotificationItemData[]>(
    () =>
      items ?? [
        {
          id: "1",
          title: "You have a new message form Dr. Nkechi",
          message:
            "This is a remainder to follow up on patient 2345, Please...",
          timestamp: "Yesterday, 11:23am",
          isNew: true,
        },
        {
          id: "2",
          title: "You have a new message form Dr. Nkechi",
          message:
            "This is a remainder to follow up on patient 2345, Please...",
          timestamp: "1, Jun 24, 11:23am",
          isNew: true,
        },
        {
          id: "3",
          title: "You have a new message form Dr. Nkechi",
          message:
            "This is a remainder to follow up on patient 2345, Please...",
          timestamp: "1, Jun 24, 11:23am",
        },
      ],
    [items]
  );

  const [list, setList] = useState<NotificationItemData[]>(initialItems);

  const newCount = list.filter((n) => n.isNew).length;
  const visibleList = activeTab === "new" ? list.filter((n) => n.isNew) : list;

  const markAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
      return;
    }
    setList((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  const handleRemove = (id: string) => {
    setList((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          Notifications
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsRead}
          className="text-xs sm:text-sm h-8"
        >
          Mark all as read
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-5 py-3 flex items-center gap-4 border-b">
        <button
          type="button"
          className={cn(
            "relative text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 pb-1",
            activeTab === "new" && "text-gray-900"
          )}
          onClick={() => setActiveTab("new")}
        >
          <span className="inline-flex items-center gap-1">
            New
            <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px]">
              {newCount}
            </span>
          </span>
          {activeTab === "new" && (
            <span className="absolute left-0 -bottom-[2px] h-[2px] w-full bg-gray-900" />
          )}
        </button>
        <button
          type="button"
          className={cn(
            "relative text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 pb-1",
            activeTab === "all" && "text-gray-900"
          )}
          onClick={() => setActiveTab("all")}
        >
          All Notifications
          {activeTab === "all" && (
            <span className="absolute left-0 -bottom-[2px] h-[2px] w-full bg-gray-900" />
          )}
        </button>
      </div>

      {/* List */}
      <ScrollArea className="max-h-[360px]">
        <div className="px-4 sm:px-5 py-2">
          {visibleList.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            visibleList.map((item) => (
              <React.Fragment key={item.id}>
                <NotificationRow item={item} onRemove={handleRemove} />
                <div className="h-px bg-gray-100" />
              </React.Fragment>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default NotificationPanel;
