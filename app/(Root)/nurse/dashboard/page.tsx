'use client';

import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/app/(Root)/_components/StatCard";
import Subheader from "@/app/(Root)/_components/Subheader";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PatientsIcon } from "@/components/icons/PatientsIcon";
import { WoundCareIcon } from "@/components/icons/WoundCareIcon";
import { InjectionsIcon } from "@/components/icons/InjectionsIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { useNurseDashboard } from "@/features/services/dashboardService";
import { useToastHandler } from "@/hooks/useToaster";

const data = [
  { month: "Jan", visits: 450 },
  { month: "Feb", visits: 350 },
  { month: "Mar", visits: 320 },
  { month: "Apr", visits: 350 },
  { month: "May", visits: 450 },
  { month: "Jun", visits: 380 },
  { month: "Jul", visits: 350 },
  { month: "Aug", visits: 500 },
  { month: "Sep", visits: 420 },
  { month: "Oct", visits: 380 },
  { month: "Nov", visits: 450 },
  { month: "Dec", visits: 350 }
];

const NurseDashboard = () => {
  const toast = useToastHandler();
  const { data: dashboardData, isLoading, error } = useNurseDashboard();

  // Handle error state
  React.useEffect(() => {
    if (error) {
      toast.error("Error", error?.message ?? "Failed to load dashboard data");
    }
  }, [error, toast]);

  // Extract analytics data
  const analytics = dashboardData?.data?.data;

  return (
    <>
    <Subheader title="Dashboard"/>
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
    

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<PatientsIcon className="h-5 w-5 text-[#118795]" />}
          title="Patients"
          value={isLoading ? "--" : analytics?.no_of_patients ?? 0}
        />

        <StatCard
          icon={<WoundCareIcon className="h-5 w-5 text-[#118795]" />}
          title="Wound Care Patient"
          value={isLoading ? "--" : analytics?.no_of_wound_care_patients ?? 0}
        />

        <StatCard
          icon={<InjectionsIcon className="h-5 w-5 text-[#118795]" />}
          title="Injections Administered"
          value={isLoading ? "--" : analytics?.no_of_injections_administered ?? 0}
        />

        <StatCard
          icon={<CalendarIcon className="h-5 w-5 text-[#118795]" />}
          title="Upcoming Appointment"
          value={isLoading ? "--" : analytics?.no_of_upcoming_appointments ?? 0}
        />
      </div>

      <div className="flex gap-6 mb-6">
        <Card className="p-6 shadow-sm border-0 flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="bg-[#F9F9F9] cursor-pointer font-medium text-xs p-1 rounded-md">
                View Table
              </button>
              <button className="bg-white border cursor-pointer font-medium border-[#F1F4F8] text-xs p-1 rounded-sm">
                Compare
              </button>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                Daily
              </button>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
                Monthly
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                Yearly
              </button>
            </div>
          </div>

          <div className="w-full">
            <ChartContainer
              config={{
                visits: {
                  color: "#118795",
                  label: "Patient Visits",
                },
              }}
              className="min-h-[400px] w-full"
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                    stroke="#6B728"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                    stroke="#6B7280"
                  />
                  <Bar
                    dataKey="visits"
                    radius={[4, 4, 0, 0]}
                    fill="var(--color-visits)"
                    // className="fill-chart-bar"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
        <Card className="p-6 shadow-sm border-0 max-w-[320px]">
         <h2 className="text-sm sm:text-base font-medium text-center mb-4 sm:mb-6">Upcoming Appointments</h2>
          
          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
            <div className="flex items-center justify-center gap-4 sm:gap-10 w-full mb-2">
              <h3 className="text-sm sm:text-base font-medium">18 Feb 2024</h3>
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
          </div>
            <p className="text-gray-600 text-xs sm:text-sm px-2 sm:px-0">
              Hi Doctor Ayo, you have an appointment scheduled for this date.
            </p>

          <div className="flex items-center justify-between mt-6 sm:mt-8 px-2 sm:px-0">
            <button className="text-blue-500 hover:text-blue-600 text-sm sm:text-base touch-manipulation min-h-[44px] flex items-center">Prev</button>
            <div className="text-xs sm:text-sm text-gray-500">1/4</div>
            <button className="text-blue-500 hover:text-blue-600 text-sm sm:text-base touch-manipulation min-h-[44px] flex items-center">Next</button>
          </div>
         </Card>
      </div>
    </div>
    </>
  );
};

export default NurseDashboard;