import React from "react";
import {
  DashboardCards,
  DashboardHeader,
  PatientStatistics,
  RecentlyRegisteredTable,
  SectionHeader,
  SubscriptionTable,
} from "./_components";
import DateTextInput from "@/components/comp-41";

function Dashboard() {
  return (
    <>
      <div className="bg-white py-1 px-5 flex items-center justify-between">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <DateTextInput />
      </div>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        <DashboardHeader />

        <div>
          <h2 className="text-base font-semibold mb-4">Overview</h2>
          <DashboardCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SectionHeader title="Top 3 Performing Hospitals" />
            <PatientStatistics />
          </div>

          <div className="lg:col-span-2">
            <SectionHeader
              title="Recent Subscription"
              seeAllLink="/super-admin/subscriptions"
            />
            <SubscriptionTable />
          </div>
        </div>

        <div className="mb-5">
          <SectionHeader
            title="Recently Registered"
            seeAllLink="/super-admin/hospitals"
          />
          <RecentlyRegisteredTable />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
