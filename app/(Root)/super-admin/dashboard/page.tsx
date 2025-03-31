import React from 'react';
import {
  DashboardCards,
  DashboardHeader,
  PatientStatistics,
  RecentlyRegisteredTable,
  SectionHeader,
  SubscriptionTable
} from './_components';

function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <DashboardHeader />
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <DashboardCards />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SectionHeader title="Top 3 Performing Hospitals" />
          <PatientStatistics />
        </div>
        
        <div className="lg:col-span-2">
          <SectionHeader title="Recent Subscription" seeAllLink="/super-admin/subscriptions" />
          <SubscriptionTable />
        </div>
      </div>
      
      <div>
        <SectionHeader title="Recently Registered" seeAllLink="/super-admin/hospitals" />
        <RecentlyRegisteredTable />
      </div>
    </div>
  );
}

export default Dashboard;