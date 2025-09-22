"use client";

import Subheader from "../../../../layouts/Subheader";
import { H3, Large, Lead, P, Small } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Overview from "./_components/Overview";
import HospitalManager from "./_components/HospitalManager";
import DoctorsMonitor from "./_components/DoctorsMonitor";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useHospitalAdminDashboard } from "@/features/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useHospitalAdminDashboard();

  if (error) {
    return (
      <>
        <Subheader title="Dashboard" />
        <div className="px-6 mt-6">
          <div className="text-center py-10">
            <P className="text-red-500">Failed to load dashboard data. Please try again.</P>
          </div>
        </div>
      </>
    );
  }

  const totalTransactions = dashboardData?.data?.data?.analytics?.total_no_of_transactions || 0;
  const cashPercentage = dashboardData?.data?.data?.analytics?.payment_medium_percentages?.cash || 0;
  const cardPercentage = dashboardData?.data?.data?.analytics?.payment_medium_percentages?.card || 0;
  const bankTransferPercentage = dashboardData?.data?.data?.analytics?.payment_medium_percentages?.bank_transfer || 0;

  return (
    <>
      <Subheader title="Dashboard"  />
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
                      <Lead>{dashboardData?.data?.data?.overview?.no_of_wards || 0}</Lead>
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
                      <Lead>{dashboardData?.data?.data?.overview?.no_of_rooms || 0}</Lead>
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
                      <Lead>{dashboardData?.data?.data?.overview?.no_of_icus || 0}</Lead>
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
                      <Lead>{dashboardData?.data?.data?.overview?.no_of_lab_tests || 0}</Lead>
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
                      <Lead>{dashboardData?.data?.data?.overview?.no_of_beds?.total || 0}</Lead>
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
                      <Lead className="text-red-500">{dashboardData?.data?.data?.overview?.no_of_beds?.no_occupied || 0}</Lead>
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
                      <Lead className="text-green-500">{dashboardData?.data?.data?.overview?.no_of_beds?.no_available || 0}</Lead>
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
              <Tabs defaultValue="tab-1">
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
                    <TabsTrigger value="tab-1">Daily</TabsTrigger>
                    <TabsTrigger value="tab-2" className="group">
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="tab-3">Monthly</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="tab-1">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full"
                  >
                    <BarChart accessibilityLayer data={chartData}>
                      <Bar
                        dataKey="desktop"
                        fill="var(--color-desktop)"
                        radius={4}
                      />
                      <Bar
                        dataKey="mobile"
                        fill="var(--color-mobile)"
                        radius={4}
                      />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <Card className="w-full">
              <CardContent>
                <Large>Breakdown By Medium</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>{totalTransactions}</Lead>
                      <P>Transaction Volume</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Cash Payments</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>{cashPercentage}%</Lead>
                      <P>Cash Percentage</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Card Payments</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>{cardPercentage}%</Lead>
                      <P>Card Percentage</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent>
                <Large>Bank Transfer</Large>
                <div className="border-t border-gray-200 py-4 space-y-3">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <Lead>{bankTransferPercentage}%</Lead>
                      <P>Bank Transfer Percentage</P>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
