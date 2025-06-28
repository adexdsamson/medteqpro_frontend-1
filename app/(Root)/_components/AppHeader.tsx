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

export function AppHeader() {
  // Use our custom hook to access the current module configuration
  const { userProfile, } = useModule();

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
    <header className="p-4 border-b bg-white">
      <div className="container mx-auto flex justify-between items-center">

        {/* Date display and Notification */}
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="text-[#16C2D5]" />
          <span className="text-sm font-semibold">{getCurrentDate()}</span>
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src={"https://avatar.iran.liara.run/public/35"}
                    alt={userProfile?.first_name}
                  />
                  <AvatarFallback>{userProfile?.first_name?.substring?.(0, 2)?.toUpperCase?.()}</AvatarFallback>
                </Avatar>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium">Hi, {userProfile?.first_name + " " + userProfile?.last_name}</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.role}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                storeFunctions.getState().setReset();
                router.push("/sign-in");
              }}>
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
