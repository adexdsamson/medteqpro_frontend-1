'use client';

import React from "react";
// import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardHeaderProps {
  revenue?: number;
}

export function DashboardHeader({ revenue }: DashboardHeaderProps) {
  // Format the revenue with commas and decimal places
  const formattedRevenue = revenue
    ? revenue.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      })
    : "N0.00";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 sm:mb-6 gap-3 sm:gap-4">
      <div>
        {/* <Button className="bg-blue-800 hover:bg-blue-900">
          Register Hospital
        </Button> */}
      </div>
      <div className="flex flex-col items-start md:items-end">
        <span className="text-xs sm:text-sm text-muted-foreground">Revenue</span>
        {revenue !== undefined ? (
          <span className="text-xl sm:text-2xl font-bold">{formattedRevenue}</span>
        ) : (
          <Skeleton className="h-6 sm:h-8 w-32 sm:w-40" />
        )}
      </div>
    </div>
  );
}
