"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown } from "lucide-react";
import Subheader from "../../_components/Subheader";
import {
  useAppointmentStats,
  useAppointments,
} from "@/features/services/appointmentService";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

const AppointmentPage = () => {
  const [activeTab, setActiveTab] = useState<"Individual" | "Family">(
    "Individual"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Get current year, month, day for stats
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Fetch appointment statistics
  const { data: yearlyStats } = useAppointmentStats(currentYear);
  const { data: monthlyStats } = useAppointmentStats(currentYear, currentMonth);
  const { data: dailyStats } = useAppointmentStats(
    currentYear,
    currentMonth,
    currentDay
  );

  // Fetch appointments with search and staff role filter
  const { data: appointmentsData, isLoading } = useAppointments({
    search: searchQuery,
    staff_role: "lab_scientist",
  });

  const appointments = appointmentsData || [];

  // Stats data for cards
  const statsData = [
    {
      label: "Yearly",
      period: "Last Year",
      values: [
        {
          label: "Completed",
          value: yearlyStats?.yearly_appointments?.completed || 0,
        },
        {
          label: "Rescheduled",
          value: yearlyStats?.yearly_appointments?.rescheduled || 0,
        },
        {
          label: "Cancelled",
          value: yearlyStats?.yearly_appointments?.cancelled || 0,
        },
      ],
    },
    {
      label: "Monthly",
      period: "Last Month",
      values: [
        {
          label: "Completed",
          value: monthlyStats?.monthly_appointments?.completed || 0,
        },
        {
          label: "Rescheduled",
          value: monthlyStats?.monthly_appointments?.rescheduled || 0,
        },
        {
          label: "Cancelled",
          value: monthlyStats?.monthly_appointments?.cancelled || 0,
        },
      ],
    },
    {
      label: "Daily",
      period: "Last Day",
      values: [
        {
          label: "Completed",
          value: dailyStats?.daily_appointments?.completed || 0,
        },
        {
          label: "Rescheduled",
          value: dailyStats?.daily_appointments?.rescheduled || 0,
        },
        {
          label: "Cancelled",
          value: dailyStats?.daily_appointments?.cancelled || 0,
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "rescheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Rescheduled
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      case "upcoming":
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Upcoming
          </Badge>
        );
    }
  };

  // Define appointment type for table
  type AppointmentTableData = {
    patientId: string;
    patientName: string;
    gender: string;
    appointmentDateTime: string;
    status: string;
  };

  // Define table columns
  const columns: ColumnDef<AppointmentTableData>[] = [
    {
      accessorKey: "patientId",
      header: () => (
        <div className="flex items-center gap-2">
          PATIENT ID
          <ChevronDown className="h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "patientName",
      header: () => (
        <div className="flex items-center gap-2">
          PATIENT NAME
          <ChevronDown className="h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: () => (
        <div className="flex items-center gap-2">
          GENDER
          <ChevronDown className="h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "appointmentDateTime",
      header: () => (
        <div className="flex items-center gap-2">
          APPOINTMENT DATE & TIME
          <ChevronDown className="h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
  ];

  return (
    <>
      <Subheader title="Appointment" />
      <div className="p-6 mx-auto h-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {stat.period}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 divide-x-2 w-full">
                    {stat.values.map((item, index) => (
                      <div key={index} className="px-2">
                        <p className="text-xs text-gray-500 mb-2">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-4">
            <Button
              variant={activeTab === "Individual" ? "default" : "outline"}
              onClick={() => setActiveTab("Individual")}
              className={
                activeTab === "Individual"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              Individual
            </Button>
            <Button
              variant={activeTab === "Family" ? "default" : "outline"}
              onClick={() => setActiveTab("Family")}
              className={
                activeTab === "Family" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              Family
            </Button>
          </div>
        </div>

        {/* Appointments Table */}
        <DataTable
          data={
            appointments.length > 0
              ? appointments.map((appointment) => ({
                  patientId: appointment.patientId,
                  patientName: appointment.patientName,
                  gender: appointment.gender || "N/A",
                  appointmentDateTime: appointment.appointmentDateTime,
                  status: appointment.status,
                }))
              : []
          }
          columns={columns}
          options={{
            isLoading,
            disableSelection: true,
            disablePagination: false,
            totalCounts: appointments.length || 0,
          }}
        />
      </div>
    </>
  );
};

export default AppointmentPage;
