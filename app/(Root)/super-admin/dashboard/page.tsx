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
import Subheader from "../../../../layouts/Subheader";
import { useSuperAdminDashboard } from "@/features/services/dashboardService";

function Dashboard() {
  const { data: dashboardData, isLoading } = useSuperAdminDashboard();

  return (
    <>
      <Subheader title="Dashboard" />

      <div className="p-3 sm:p-6 space-y-3 sm:space-y-6 bg-gray-50 min-h-screen w-full">
        <DashboardHeader revenue={dashboardData?.data.data?.total_revenue} />

        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Overview</h2>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          <div className="lg:col-span-1">
            <SectionHeader title="Top 5 Performing Hospitals" />
            <PatientStatistics
              totalPatients={
                dashboardData?.data.data?.hospital_analytics?.total_patients
              }
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
              seeAllLink="/super-admin/clients?tab=subscriptions"
            />
            <SubscriptionTable
              subscriptions={dashboardData?.data.data?.recent_subscriptions?.map(
                (sub) => ({
                  id: sub.id,
                  hospitalName: sub.hospital_name,
                  subscriptionDate: sub.start_date,
                  expiryDate: sub.expiry_date,
                  status: sub.status,
                })
              )}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mb-3 sm:mb-5">
          <SectionHeader
            title="Recently Registered"
            seeAllLink="/super-admin/clients"
          />
          <RecentlyRegisteredTable
            hospitals={dashboardData?.data?.data?.recent_hospitals?.map(
              (hospital) => ({
                id: hospital.hospital_id,
                name: hospital.admin_full_name,
                email: hospital.admin_email,
                hospitalName: hospital.hospital_name,
                numberOfDoctors: hospital.no_of_doctors.toString(),
                dateRegistered: hospital.date_registered.toString(),
                location: hospital.state,
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
