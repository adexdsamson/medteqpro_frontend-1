"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, Calendar, LogOut, Settings, User } from "lucide-react";
import { useModule } from "@/hooks/useModule";
import { storeFunctions } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationPanel } from "@/layouts/_components/NotificationPanel";

export function AppHeader() {
  // Use our custom hook to access the current module configuration
  const { userProfile } = useModule();

  const router = useRouter();

  // Get current date in the format: Monday, 2 April 2024
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="px-3 py-3 sm:px-4 sm:py-4 border-b bg-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Date display and Notification */}
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
          <Calendar className="text-[#16C2D5] h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm font-semibold hidden sm:inline">
            {getCurrentDate()}
          </span>
          <span className="text-xs font-semibold sm:hidden">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          {/* Notification Bell */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative ml-1 sm:ml-2 h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
                aria-label="Open notifications"
              >
                <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                  2
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="p-0 w-[420px] sm:w-[520px] mr-2 sm:mr-0"
            >
              <NotificationPanel />
            </PopoverContent>
          </Popover>
        </div>

        {/* User Profile */}
        <div className="flex items-center">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer touch-manipulation p-1 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={"https://avatar.iran.liara.run/public/35"}
                    alt={userProfile?.first_name}
                  />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {userProfile?.first_name
                      ?.substring?.(0, 2)
                      ?.toUpperCase?.()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium truncate max-w-[120px] lg:max-w-none">
                    Hi, {userProfile?.first_name + " " + userProfile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px] lg:max-w-none">
                    {userProfile?.role}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 sm:w-56 mr-2 sm:mr-0"
            >
              <DropdownMenuLabel className="text-sm">
                <div className="md:hidden">
                  <p className="font-medium truncate">
                    {userProfile?.first_name + " " + userProfile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground font-normal truncate">
                    {userProfile?.role}
                  </p>
                </div>
                <div className="hidden md:block">My Account</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="touch-manipulation py-3 sm:py-2">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="touch-manipulation py-3 sm:py-2">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="touch-manipulation py-3 sm:py-2 text-red-600 focus:text-red-600"
                onClick={() => {
                  storeFunctions.getState().setReset();
                  router.push("/sign-in");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
