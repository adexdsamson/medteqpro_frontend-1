"use client";

import { getFormatCurrency } from "@/lib/utils";
import Subheader from "../../_components/Subheader";
import ToggleSession from "./_components/ToggleSession";
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
  return (
    <>
      <Subheader title="Dashboard" middle={<ToggleSession />} />
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
            <Small>Revenue Generated</Small>
            <H3>{getFormatCurrency(1603980)}</H3>
            <Button className="mt-4">Payment Breakdown</Button>
          </div>
        </div>

        <Overview />

        <HospitalManager />

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

          <Card className="w-fit mt-5">
            <CardContent>
              <Large>Breakdown By medium</Large>

              <div className="border-t border-gray-200 py-4">
                <Lead>2282</Lead>
                <P>Transaction Volume</P>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
