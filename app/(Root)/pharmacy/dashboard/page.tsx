"use client";

import React, { useMemo } from "react";
import Subheader from "../../_components/Subheader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../_components/StatCard";
import { H3, Large, P, Small } from "@/components/ui/Typography";
import {
  Pill,
  Package,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Calendar,
} from "lucide-react";
import { getFormatCurrency } from "@/lib/utils";
import SessionTimer from "../../admin/queuing-system/_components/SessionTimer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePharmacistDashboard,
  usePharmacistUpcomingPickups,
} from "@/features/services/dashboardService";
import type {
  PharmacistDashboardAnalytics,
  PharmacistPickup,
} from "@/features/services/dashboardService";
import { SEOWrapper } from "@/components/SEO";

// Helper to extract error message safely
function getErrorMessage(e: unknown, fallback: string) {
  if (typeof e === "string") return e;
  if (
    e &&
    typeof e === "object" &&
    "message" in (e as Record<string, unknown>)
  ) {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
}

// Helper to safely get list data from API responses of varying shapes
function getResults<T>(resp: unknown): T[] {
  if (!resp || typeof resp !== "object") return [];
  const outer = resp as { data?: unknown };
  const dataField = outer.data;

  // Case: outer is AxiosResponse and dataField is Api<T> with inner data array
  if (
    typeof dataField === "object" &&
    dataField !== null &&
    "data" in (dataField as Record<string, unknown>)
  ) {
    const inner = (dataField as { data?: unknown }).data as unknown;
    if (Array.isArray(inner)) return (inner as T[]) ?? [];
    if (
      typeof inner === "object" &&
      inner !== null &&
      "results" in (inner as Record<string, unknown>) &&
      Array.isArray((inner as { results?: unknown }).results)
    ) {
      return ((inner as { results?: unknown }).results as T[]) ?? [];
    }
  }

  // Case: dataField itself has results array
  if (
    typeof dataField === "object" &&
    dataField !== null &&
    "results" in (dataField as Record<string, unknown>) &&
    Array.isArray((dataField as { results?: unknown }).results)
  ) {
    return ((dataField as { results?: unknown }).results as T[]) ?? [];
  }

  // Case: dataField itself is array
  if (Array.isArray(dataField)) return (dataField as T[]) ?? [];

  return [];
}

// UI mapping type for pickups list rendering
interface DrugPickupUI {
  id: string;
  date: string;
  time: string;
  patient: string;
  status: string;
}

const PharmacyDashboard = () => {
  // Fetch pharmacy dashboard data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
    error: dashboardErr,
  } = usePharmacistDashboard();
  const {
    data: pickupsData,
    isLoading: pickupsLoading,
    isError: pickupsError,
    error: pickupsErr,
  } = usePharmacistUpcomingPickups();

  // Transform pickup data using the getResults helper
  const upcomingPickups = useMemo(() => {
    const pickups = getResults<PharmacistPickup>(pickupsData);
    return pickups.map(
      (pickup): DrugPickupUI => ({
        id: String(pickup.id || ""),
        date: pickup.pickup_date || pickup.date || pickup.scheduled_date || "",
        time: pickup.pickup_time || pickup.time || "",
        patient:
          pickup.patient_fullname ||
          pickup.patient_name ||
          pickup.patient ||
          "",
        status: pickup.status || "pending",
      })
    );
  }, [pickupsData]);

  // Extract analytics data from API response and handle safe property access
  const analytics: PharmacistDashboardAnalytics | undefined =
    dashboardData?.data?.data;

  // Revenue section values (fallback to 0 if API doesn't provide these fields)
  const revenueData = {
    totalDrugSales: analytics?.total_drug_sales ?? 0,
    transfersAndCard: analytics?.transfers_card ?? 0,
    cashPayments: analytics?.cash_payments ?? 0,
  };

  // For pickup counts - using API if available, fallback to counting upcomingPickups
  const pickupsCount = analytics?.upcoming_pickups ?? upcomingPickups.length;

  // Next pickup details from upcomingPickups array
  const nextPickup = upcomingPickups[0];
  const nextPickupDate = nextPickup?.date || "No upcoming pickups";
  const nextPickupMessage = nextPickup
    ? `Next pickup scheduled for ${nextPickup.patient}`
    : "No pickups scheduled";

  // Show loading state for dashboard data
  if (dashboardLoading) {
    return (
      <>
        <SEOWrapper
          title="Pharmacy Dashboard - SwiftPro eProcurement Portal"
          description="Review pharmacy inventory, revenue metrics, and upcoming drug pickups in your hospital dashboard."
          keywords="pharmacy, dashboard, inventory, pickups, revenue"
          canonical="/pharmacy/dashboard"
          robots="noindex, nofollow"
          ogImage="/assets/medteq-og-image.jpg"
          ogImageAlt="Medteq Healthcare System Pharmacy Dashboard"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Medteq Healthcare System",
          }}
        />
        <Subheader title="Dashboard" middle={<SessionTimer />} />
        <div className="p-3 sm:p-6 space-y-3 sm:space-y-6 bg-gray-50 min-h-screen w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOWrapper
        title="Pharmacy Dashboard - SwiftPro eProcurement Portal"
        description="Monitor pharmacy inventory, revenue distribution, and upcoming drug pickups to streamline dispensing operations."
        keywords="pharmacy dashboard, drug sales, upcoming pickups, inventory"
        canonical="/pharmacy/dashboard"
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq Healthcare System Pharmacy Dashboard"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Medteq Healthcare System",
        }}
      />
      <Subheader title="Dashboard" />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        {(dashboardError || pickupsError) && (
          <Card className="bg-red-50 border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <Large className="text-red-800 font-semibold">
                  Some data failed to load
                </Large>
                <P className="text-sm text-red-700 mt-1">
                  {dashboardError
                    ? getErrorMessage(dashboardErr, "Dashboard request failed.")
                    : null}
                  {dashboardError && pickupsError ? " " : null}
                  {pickupsError
                    ? getErrorMessage(
                        pickupsErr,
                        "Upcoming pickups request failed."
                      )
                    : null}
                </P>
              </div>
            </div>
          </Card>
        )}

        {/* Shelve Section */}
        <div className="space-y-3 sm:space-y-4">
          <Large className="text-base sm:text-lg font-semibold text-[#16C2D5]">
            Shelve
          </Large>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Medicine"
              value={analytics?.no_of_medicines ?? analytics?.medicine ?? 0}
              icon={<Pill className="h-6 w-6 text-[#16C2D5]" />}
              className="bg-white"
              bottom={
                dashboardLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <div className="flex items-center justify-between">
                    <P className="text-sm text-gray-600">Medicine</P>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-6"
                    >
                      View All
                    </Button>
                  </div>
                )
              }
            />

            <StatCard
              title="Available Drugs"
              value={analytics?.available_drugs ?? 0}
              icon={<Package className="h-6 w-6 text-green-500" />}
              className="bg-white"
              bottom={
                dashboardLoading ? (
                  <Skeleton className="h-4 w-28" />
                ) : (
                  <div className="flex items-center justify-between">
                    <P className="text-sm text-gray-600">Available Drugs</P>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-6"
                    >
                      View All
                    </Button>
                  </div>
                )
              }
            />

            <StatCard
              title="Out of Stock Drugs"
              value={analytics?.out_of_stock_drugs ?? 0}
              icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
              className="bg-white"
              bottom={
                dashboardLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <div className="flex items-center justify-between">
                    <P className="text-sm text-gray-600">Out of Stock Drugs</P>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-6"
                    >
                      View All
                    </Button>
                  </div>
                )
              }
            />

            <StatCard
              title="Volume Dispensed"
              value={analytics?.volume_dispensed ?? 0}
              icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
              className="bg-white"
              bottom={
                dashboardLoading ? (
                  <Skeleton className="h-4 w-36" />
                ) : (
                  <div className="flex items-center justify-between">
                    <P className="text-sm text-gray-600">Volume Dispensed</P>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-6"
                    >
                      View All
                    </Button>
                  </div>
                )
              }
            />
          </div>
        </div>

        {/* Revenue Section */}
        <div className="space-y-3 sm:space-y-4">
          <Large className="text-base sm:text-lg font-semibold text-[#16C2D5]">
            Revenue
          </Large>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-fit">
            {/* Left Column - Total Drug Sales and Payment Methods */}
            <div className="space-y-4">
              {/* Total Drug Sales */}
              <Card className="bg-white p-6 h-48">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">%</span>
                    </div>
                    <Small className="text-gray-600">Total Drug Sales</Small>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#16C2D5] hover:bg-[#14a8b8] text-white"
                  >
                    Buy Drugs
                  </Button>
                </div>
                <H3 className="text-2xl font-bold">
                  {getFormatCurrency(revenueData.totalDrugSales)}
                </H3>
              </Card>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-40">
                <Card className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-[#16C2D5]" />
                    </div>
                    <Small className="text-gray-600">
                      Transfers & Card Payments
                    </Small>
                  </div>
                  <H3 className="text-xl font-bold">
                    {getFormatCurrency(revenueData.transfersAndCard)}
                  </H3>
                </Card>

                <Card className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-500" />
                    </div>
                    <Small className="text-gray-600">Cash Payments</Small>
                  </div>
                  <H3 className="text-xl font-bold">
                    {getFormatCurrency(revenueData.cashPayments)}
                  </H3>
                </Card>
              </div>
            </div>

            {/* Right Column - Revenue Chart */}
            <Card className="bg-white p-6">
              <div className="h-fit flex items-center justify-center">
                <div className="relative">
                  <ChartContainer
                    config={{
                      transfers: {
                        label: "Transfers & Card",
                        color: "#16C2D5",
                      },
                      cash: {
                        label: "Cash",
                        color: "#1e3a8a",
                      },
                    }}
                    className="h-62 w-64"
                  >
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Transfers & Card",
                            value: revenueData.transfersAndCard,
                            fill: "#16C2D5",
                          },
                          {
                            name: "Cash",
                            value: revenueData.cashPayments,
                            fill: "#1e3a8a",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={450}
                        dataKey="value"
                      ></Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>

                  {/* Center percentage labels */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1e3a8a] mb-1">
                        {(() => {
                          const total =
                            revenueData.transfersAndCard +
                            revenueData.cashPayments;
                          const pct =
                            total > 0
                              ? Math.round(
                                  (revenueData.cashPayments / total) * 100
                                )
                              : 0;
                          return `${pct}%`;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/*  Transfers percentage label positioned on the chart */}
                  <div className="absolute top-12 right-8">
                    <div className="text-2xl font-bold text-[#16C2D5]">
                      {(() => {
                        const total =
                          revenueData.transfersAndCard +
                          revenueData.cashPayments;
                        const pct =
                          total > 0
                            ? Math.round(
                                (revenueData.transfersAndCard / total) * 100
                              )
                            : 0;
                        return `${pct}%`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#16C2D5] rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Transfers & Card
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1e3a8a] rounded-full"></div>
                  <span className="text-sm text-gray-600">Cash</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Pickups Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Large className="text-base sm:text-lg font-semibold text-[#16C2D5]">
              Pickups
            </Large>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm px-3 py-1 h-7 sm:h-8 touch-manipulation"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Upcoming Pickups Count */}
            <Card className="bg-white p-6 h-fit">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-[#16C2D5]" />
                </div>
                <Small className="text-gray-600">Upcoming Pickups</Small>
              </div>
              <H3 className="text-4xl font-bold">
                {pickupsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  pickupsCount
                )}
              </H3>
              <P className="text-sm text-gray-600">Upcoming Pickups</P>
            </Card>

            {/* Upcoming Pickups Details */}
            <Card className="bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <Large className="font-semibold">Upcoming Pickups</Large>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {pickupsLoading ? (
                      <Skeleton className="h-6 w-40 mx-auto" />
                    ) : (
                      nextPickupDate
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-green-500" />
                  </div>
                  <P className="text-sm text-gray-600 max-w-xs mx-auto">
                    {pickupsLoading ? (
                      <Skeleton className="h-4 w-64 mx-auto" />
                    ) : (
                      nextPickupMessage
                    )}
                  </P>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-[#16C2D5]">
                    Prev
                  </Button>
                  <P className="text-sm text-gray-500">1/4</P>
                  <Button variant="ghost" size="sm" className="text-[#16C2D5]">
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyDashboard;
