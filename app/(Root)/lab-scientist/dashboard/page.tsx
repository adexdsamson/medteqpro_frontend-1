'use client';

import React from "react";
import Subheader from "../../../../layouts/Subheader";
import {
  StatsCards,
  TestChart,
  UpcomingAppointments,
} from "./_components";
import { useGetLabDashboardAnalytics } from "@/features/services/labScientistService";
import { Skeleton } from "@/components/ui/skeleton";

const LabScientistDashboard = () => {
  const { data: analyticsData, isLoading, error } = useGetLabDashboardAnalytics();

  if (error) {
    return (
      <>
        <Subheader title="Dashboard" />
        <div className="p-6">
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load dashboard data. Please try again.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Subheader title="Dashboard" />
      <div className="p-6 lg:max-w-7xl mx-auto h-full">
        {/* Header with session info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">00:00 End Session</span>
          </div>
          <div className="text-sm text-gray-600">
            Select Date
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <StatsCards data={analyticsData?.data.data} />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <TestChart />
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="lg:col-span-1">
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <UpcomingAppointments />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LabScientistDashboard;