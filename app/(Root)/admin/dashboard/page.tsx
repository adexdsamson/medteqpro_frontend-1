/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Subheader from "../../../../layouts/Subheader";
import { H3, Large, Lead, P, Small } from "@/components/ui/Typography";
import Image from "next/image";
import Overview from "./_components/Overview";
import HospitalManager from "./_components/HospitalManager";
import DoctorsMonitor from "./_components/DoctorsMonitor";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  useHospitalAdminDashboard,
  useVisitationFrequencyAnalytics,
} from "@/features/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";

// Bar chart config (single series)
const chartConfig = {
  value: {
    label: "Visits",
    color: "#16C2D5",
  },
} satisfies ChartConfig;

// Colors for payment medium pie chart
const PIE_COLORS = ["#16C2D5", "#23B5D3", "#55DDE0"]; // teal/cyan palette

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useHospitalAdminDashboard();
  const [visitFilter, setVisitFilter] = useState<
    "daily" | "monthly" | "yearly"
  >("monthly");
  const { data: visitationData } = useVisitationFrequencyAnalytics(visitFilter);

  const barChartData = useMemo(() => {
    const rawContainer =
      (visitationData?.data as { data?: unknown } | undefined)?.data ??
      visitationData?.data;

    if (Array.isArray(rawContainer)) {
      return (rawContainer as any[]).map((item, idx) => ({
        name: item.label || item.month || item.name || `${idx + 1}`,
        value: Number(item.value ?? item.count ?? item.visits ?? 0),
      }));
    }

    if (rawContainer && typeof rawContainer === "object") {
      const obj = rawContainer as Record<string, unknown>;
      return Object.keys(obj).map((k) => ({
        name: k,
        value: Number(obj[k] as number),
      }));
    }

    return [];
  }, [visitationData]);

  // Payment analytics prepared before any early return to satisfy hooks rule
  const totalTransactions =
    dashboardData?.data?.data?.analytics?.total_no_of_transactions || 0;
  const cashPercentage =
    dashboardData?.data?.data?.analytics?.payment_medium_percentages?.cash || 0;
  const cardPercentage =
    dashboardData?.data?.data?.analytics?.payment_medium_percentages?.card || 0;
  const bankTransferPercentage =
    dashboardData?.data?.data?.analytics?.payment_medium_percentages
      ?.bank_transfer || 0;

  const mediumPieData = useMemo(
    () => [
      { name: "Transfer", value: bankTransferPercentage, percentage: bankTransferPercentage, fill: PIE_COLORS[0] },
      { name: "Card", value: cardPercentage, percentage: cardPercentage, fill: PIE_COLORS[1] },
      { name: "Cash", value: cashPercentage, percentage: cashPercentage, fill: PIE_COLORS[2] },
    ],
    [bankTransferPercentage, cardPercentage, cashPercentage]
  );

  const pieRenderData = useMemo(() => {
    const total = mediumPieData.reduce((sum, d) => sum + Number(d.value || 0), 0);
    if (total > 0) return mediumPieData;
    // Use placeholder slices to render a visible ring when all percentages are 0
    return mediumPieData.map((d) => ({ ...d, value: 1 }));
  }, [mediumPieData]);

  if (error) {
    return (
      <>
        <Subheader title="Dashboard" />
        <div className="px-6 mt-6">
          <div className="text-center py-10">
            <P className="text-red-500">
              Failed to load dashboard data. Please try again.
            </P>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Subheader title="Dashboard" />
      <div className="px-6 mt-6 space-y-5">
        <div className="bg-[#F9F9F9] flex justify-between p-5">
          <div>
            <Image
              height={60}
              width={60}
              src={"/assets/admin-dashboard/chrome-icon.svg"}
              alt="money-svg"
            />
          </div>
          <div className="text-right">
            <Small>Total Transactions</Small>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mb-2" />
            ) : (
              <H3>{totalTransactions}</H3>
            )}
          </div>
        </div>

        <Overview data={dashboardData?.data?.data} isLoading={isLoading} />

        <HospitalManager
          data={dashboardData?.data?.data}
          isLoading={isLoading}
        />

        {/* Hospital Facilities Overview */}
        <div className="mb-5">
          <Large className="text-lg">Hospital Facilities</Large>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
            <Card className="w-full">
              <CardContent>
                <Large>Wards</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>
                        {dashboardData?.data?.data?.overview?.no_of_wards || 0}
                      </Lead>
                      <P>Total Wards</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Rooms</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>
                        {dashboardData?.data?.data?.overview?.no_of_rooms || 0}
                      </Lead>
                      <P>Total Rooms</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>ICUs</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>
                        {dashboardData?.data?.data?.overview?.no_of_icus || 0}
                      </Lead>
                      <P>ICU Units</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Lab Tests</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>
                        {dashboardData?.data?.data?.overview?.no_of_lab_tests ||
                          0}
                      </Lead>
                      <P>Available Tests</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bed Management Overview */}
        <div className="mb-5">
          <Large className="text-lg">Bed Management</Large>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <Card className="w-full">
              <CardContent>
                <Large>Total Beds</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>
                        {dashboardData?.data?.data?.overview?.no_of_beds
                          ?.total || 0}
                      </Lead>
                      <P>Total Beds</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Occupied Beds</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead className="text-red-500">
                        {dashboardData?.data?.data?.overview?.no_of_beds
                          ?.no_occupied || 0}
                      </Lead>
                      <P>Occupied</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Available Beds</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead className="text-green-500">
                        {dashboardData?.data?.data?.overview?.no_of_beds
                          ?.no_available || 0}
                      </Lead>
                      <P>Available</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <Card className="w-full">
            <CardContent>
              <Tabs
                value={visitFilter}
                onValueChange={(v) => setVisitFilter(v as typeof visitFilter)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 bg-gray-200 rounded-md">
                      <Small>View Table</Small>
                    </div>
                    <div className="p-2.5 bg-white border rounded-md">
                      <Small>Compare</Small>
                    </div>
                  </div>

                  <TabsList className="">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="monthly" className="group">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value={visitFilter}>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full"
                  >
                    <BarChart accessibilityLayer data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Bar
                        dataKey="value"
                        fill="var(--color-value)"
                        radius={[4, 4, 0, 0]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <DoctorsMonitor />
        </div>

        <div className="mb-5">
          <Large className="text-lg">All Payment Breakdown</Large>

          {/* Refactored: single card with pie chart and legend */}
          <Card className="w-full max-w-2xl mt-5">
            <CardContent className="p-4 sm:p-6">
              <Large>Breakdown By Medium</Large>
              <div className="border-t border-gray-200 py-4 space-y-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <Lead>{totalTransactions}</Lead>
                    <P>Transaction Volume</P>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-44 w-44 rounded-full" />
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <PieChart width={220} height={220} className="sm:w-[240px] sm:h-[240px]">
                      <Pie
                        data={pieRenderData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(p) => `${Math.round(p?.payload?.percentage ?? 0)}%`}
                      >
                        {pieRenderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill as string} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                )}

                <div className="space-y-2">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      ))
                    : mediumPieData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: d.fill as string }}
                          />
                          <Small>
                            {d.name} - {Math.round(d.percentage ?? 0)}%
                           </Small>
                        </div>
                      ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
