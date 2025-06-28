"use client";

import React from "react";
import Subheader from "../../_components/Subheader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../_components/StatCard";
import { H3, Large, P, Small } from "@/components/ui/Typography";
import { Pill, Package, AlertTriangle, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { getFormatCurrency } from "@/lib/utils";
import SessionTimer from "../../admin/queuing-system/_components/SessionTimer";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie } from "recharts";

// Generate sample data
const generateSampleData = () => {
  return {
    medicine: 298,
    availableDrugs: 445,
    outOfStockDrugs: 560,
    volumeDispensed: 1023,
    totalDrugSales: 1298000,
    transfersAndCard: 1000000,
    cashPayments: 298000,
    upcomingPickups: 4,
    nextPickupDate: "18 Feb 2024",
    nextPickupMessage: "Hi Doctor Ape, you have an appointment scheduled for this date."
  };
};

const PharmacyDashboard = () => {
  const data = generateSampleData();

  return (
    <>
      <Subheader title="Dashboard" middle={<SessionTimer  />} />
      {/* <div className="bg-white py-1 px-5 flex items-center justify-between">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <DateTextInput />
      </div> */}

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        {/* Shelve Section */}
        <div className="space-y-4">
          <Large className="text-lg font-semibold text-[#16C2D5]">Shelve</Large>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Medicine"
              value={data.medicine}
              icon={<Pill className="h-6 w-6 text-[#16C2D5]" />}
              className="bg-white"
              bottom={
                <div className="flex items-center justify-between">
                  <P className="text-sm text-gray-600">Medicine</P>
                  <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">
                    View All
                  </Button>
                </div>
              }
            />
            
            <StatCard
              title="Available Drugs"
              value={data.availableDrugs}
              icon={<Package className="h-6 w-6 text-green-500" />}
              className="bg-white"
              bottom={
                <div className="flex items-center justify-between">
                  <P className="text-sm text-gray-600">Available Drugs</P>
                  <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">
                    View All
                  </Button>
                </div>
              }
            />
            
            <StatCard
              title="Out of Stock Drugs"
              value={data.outOfStockDrugs}
              icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
              className="bg-white"
              bottom={
                <div className="flex items-center justify-between">
                  <P className="text-sm text-gray-600">Out of Stock Drugs</P>
                  <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">
                    View All
                  </Button>
                </div>
              }
            />
            
            <StatCard
              title="Volume Dispensed"
              value={data.volumeDispensed}
              icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
              className="bg-white"
              bottom={
                <div className="flex items-center justify-between">
                  <P className="text-sm text-gray-600">Volume Dispensed</P>
                  <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">
                    View All
                  </Button>
                </div>
              }
            />
          </div>
        </div>

        {/* Revenue Section */}
        <div className="space-y-4">
          <Large className="text-lg font-semibold">Revenue</Large>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-fit">
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
                  <Button size="sm" className="bg-[#16C2D5] hover:bg-[#14a8b8] text-white">
                    Buy Drugs
                  </Button>
                </div>
                <H3 className="text-2xl font-bold">{getFormatCurrency(data.totalDrugSales)}</H3>
              </Card>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-40">
                <Card className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-[#16C2D5]" />
                    </div>
                    <Small className="text-gray-600">Transfers & Card Payments</Small>
                  </div>
                  <H3 className="text-xl font-bold">{getFormatCurrency(data.transfersAndCard)}</H3>
                </Card>
                
                <Card className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-500" />
                    </div>
                    <Small className="text-gray-600">Cash Payments</Small>
                  </div>
                  <H3 className="text-xl font-bold">{getFormatCurrency(data.cashPayments)}</H3>
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
                          { name: "Transfers & Card", value: 77, fill: "#16C2D5" },
                          { name: "Cash", value: 23, fill: "#1e3a8a" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={450}
                        dataKey="value"
                      >
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  
                  {/* Center percentage labels */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1e3a8a] mb-1">23%</div>
                    </div>
                  </div>
                  
                  {/* 77% label positioned on the chart */}
                  <div className="absolute top-12 right-8">
                    <div className="text-2xl font-bold text-[#16C2D5]">77%</div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#16C2D5] rounded-full"></div>
                  <span className="text-sm text-gray-600">Transfers & Card</span>
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
        <div className="space-y-4">
          <Large className="text-lg font-semibold">Pickups</Large>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Upcoming Pickups Count */}
            <Card className="bg-white p-6 h-fit">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-[#16C2D5]" />
                </div>
                <Small className="text-gray-600">Upcoming Pickups</Small>
              </div>
              <H3 className="text-4xl font-bold">{data.upcomingPickups}</H3>
              <P className="text-sm text-gray-600">Upcoming Pickups</P>
            </Card>

            {/* Upcoming Pickups Details */}
            <Card className="bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <Large className="font-semibold">Upcoming Pickups</Large>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{data.nextPickupDate}</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-green-500" />
                  </div>
                  <P className="text-sm text-gray-600 max-w-xs mx-auto">{data.nextPickupMessage}</P>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-[#16C2D5]">Prev</Button>
                  <P className="text-sm text-gray-500">1/4</P>
                  <Button variant="ghost" size="sm" className="text-[#16C2D5]">Next</Button>
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