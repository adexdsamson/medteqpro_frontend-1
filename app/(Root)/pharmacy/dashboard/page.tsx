"use client";

import React from "react";
import Subheader from "../../_components/Subheader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../_components/StatCard";
import { H3, Large, P, Small } from "@/components/ui/Typography";
import { Pill, Package, AlertTriangle, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { getFormatCurrency } from "@/lib/utils";
import DateTextInput from "@/components/comp-41";
import SessionTimer from "../../admin/queuing-system/_components/SessionTimer";

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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Drug Sales */}
            <Card className="bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#16C2D5]" />
                  <Small className="text-gray-600">Total Drug Sales</Small>
                </div>
                <Button size="sm" className="bg-[#16C2D5] hover:bg-[#14a8b8] text-white">
                  Buy Drugs
                </Button>
              </div>
              <H3 className="text-2xl font-bold">{getFormatCurrency(data.totalDrugSales)}</H3>
            </Card>

            {/* Payment Methods */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-[#16C2D5]" />
                  <Small className="text-gray-600">Transfers & Card Payments</Small>
                </div>
                <H3 className="text-xl font-bold">{getFormatCurrency(data.transfersAndCard)}</H3>
              </Card>
              
              <Card className="bg-white p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  <Small className="text-gray-600">Cash Payments</Small>
                </div>
                <H3 className="text-xl font-bold">{getFormatCurrency(data.cashPayments)}</H3>
              </Card>
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="lg:col-span-3">
              <Card className="bg-white p-6">
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-[#16C2D5] rounded-full flex items-center justify-center relative">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-[#16C2D5]">77%</span>
                      </div>
                      <div className="absolute -right-4 top-8 w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">23%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#16C2D5] rounded-full"></div>
                        <span>Transfers & Card</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-900 rounded-full"></div>
                        <span>Cash</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Pickups Section */}
        <div className="space-y-4">
          <Large className="text-lg font-semibold">Pickups</Large>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Pickups Count */}
            <Card className="bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-[#16C2D5]" />
                <Small className="text-gray-600">Upcoming Pickups</Small>
              </div>
              <H3 className="text-4xl font-bold mb-2">{data.upcomingPickups}</H3>
              <P className="text-sm text-gray-600">Upcoming Pickups</P>
            </Card>

            {/* Upcoming Pickups Details */}
            <div className="lg:col-span-2">
              <Card className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <Large className="font-semibold">Upcoming Pickups</Large>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Prev</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div>
                        <P className="font-semibold">{data.nextPickupDate}</P>
                        <Small className="text-gray-600">{data.nextPickupMessage}</Small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <P className="text-sm text-gray-500">1/4</P>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyDashboard;