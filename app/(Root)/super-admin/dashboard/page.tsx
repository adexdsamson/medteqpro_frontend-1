"use client";

import React from "react";
import {
  DashboardCards,
  DashboardHeader,
  PatientStatistics,
  RecentlyRegisteredTable,
  SectionHeader,
  SubscriptionTable,
} from "./_components";
import Subheader from "../../_components/Subheader";
import { useSuperAdminDashboard } from "@/features/services/dashboardService";

function Dashboard() {
  const { data: dashboardData, isLoading } = useSuperAdminDashboard();

  return (
    <>
      <Subheader title="Dashboard" />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        <DashboardHeader revenue={dashboardData?.data.data?.total_revenue} />

        <div>
          <h2 className="text-base font-semibold mb-4">Overview</h2>
          <DashboardCards
            totalHospitals={
              dashboardData?.data.data?.hospital_analytics?.total_hospitals
            }
            activeHospitals={
              dashboardData?.data.data?.hospital_analytics?.active_hospitals
            }
            inactiveHospitals={
              dashboardData?.data.data?.hospital_analytics?.inactive_hospitals
            }
            staffCount={dashboardData?.data.data?.total_staff_count}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SectionHeader title="Top 3 Performing Hospitals" />
            <PatientStatistics
              topHospitals={
                dashboardData?.data.data?.hospital_analytics?.top_hospitals
              }
              otherHospitals={
                dashboardData?.data.data?.hospital_analytics?.other_hospitals
              }
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-2">
            <SectionHeader
              title="Recent Subscription"
              seeAllLink="/super-admin/subscriptions"
            />
            <SubscriptionTable
              subscriptions={dashboardData?.data.data?.recent_subscriptions?.map(
                (sub) => ({
                  id: sub.id,
                  hospitalName: sub.hospital_name,
                  subscriptionDate: sub.subscription_date,
                  expiryDate: sub.expiry_date,
                  status: sub.status,
                })
              )}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mb-5">
          <SectionHeader
            title="Recently Registered"
            seeAllLink="/super-admin/hospitals"
          />
          <RecentlyRegisteredTable
            hospitals={dashboardData?.data?.data?.recent_hospitals?.map(
              (hospital) => ({
                id: hospital.id,
                name: hospital.name,
                email: hospital.admin?.email || 'N/A',
                hospitalName: hospital.name,
                numberOfDoctors: hospital.no_of_doctors,
                dateRegistered: hospital.created_at,
                location: `${hospital.city}, ${hospital.state}`,
                status: hospital.status,
              })
            )}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
