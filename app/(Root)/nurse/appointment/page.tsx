"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import {
  // AppointmentFamily,
  appointmentFamilyColumns,
} from "./_components/columns";
import Subheader from "../../_components/Subheader";
import {
  AppointmentStats,
  AppointmentStatPRops,
} from "./_components/AppointmentStat";
import { IndividualPanel } from "./_components/IndividualPanel";
import { TextInput } from "@/components/FormInputs/TextInput";
import { SearchIcon } from "lucide-react";
import { 
  useAppointments, 
  useFamilyAppointments, 
  useAppointmentStats 
} from "@/features/services/appointmentService";
import { BookAppointmentDialog } from "./_components/BookAppointmentDialog";

const NurseAppointmentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch appointments data from API with nurse role filter
  const { data: appointments, isLoading: isLoadingAppointments } = useAppointments({
    staff_role: "nurse"
  });
  const { data: familyAppointments, isLoading: isLoadingFamilyAppointments } = useFamilyAppointments();
  
  // Fetch stats data - using current year for analytics
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const { data: statsData } = useAppointmentStats(currentYear, currentMonth);

  // Prepare stats for display based on API response structure
  const appointmentStats: AppointmentStatPRops[] = [
    {
      title: "Yearly",
      period: statsData?.period?.year?.toString() || currentYear.toString(),
      action: "Set Year",
      appointmentStatus: [
        { label: "Completed", count: statsData?.yearly_appointments?.completed?.toString() || "0", color: "text-green-400" },
        { label: "Rescheduled", count: statsData?.yearly_appointments?.rescheduled?.toString() || "0", color: "text-yellow-400" },
        { label: "Cancelled", count: statsData?.yearly_appointments?.cancelled?.toString() || "0", color: "text-red-400" },
      ],
    },
    {
      title: "Monthly",
      period: statsData?.period?.month ? new Date(0, statsData.period.month - 1).toLocaleString('default', { month: 'long' }) : "Current Month",
      action: "Set Month",
      appointmentStatus: [
        { label: "Completed", count: statsData?.monthly_appointments?.completed?.toString() || "0", color: "text-green-400" },
        { label: "Rescheduled", count: statsData?.monthly_appointments?.rescheduled?.toString() || "0", color: "text-yellow-400" },
        { label: "Cancelled", count: statsData?.monthly_appointments?.cancelled?.toString() || "0", color: "text-red-400" },
      ],
    },
    {
      title: "Daily",
      period: statsData?.period?.day ? `Day ${statsData.period.day}` : "Today",
      action: "Set Day",
      appointmentStatus: [
        { label: "Completed", count: statsData?.daily_appointments?.completed?.toString() || "0", color: "text-green-400" },
        { label: "Rescheduled", count: statsData?.daily_appointments?.rescheduled?.toString() || "0", color: "text-yellow-400" },
        { label: "Cancelled", count: statsData?.daily_appointments?.cancelled?.toString() || "0", color: "text-red-400" },
      ],
    },
  ];
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter family appointments based on search term
  const filteredFamilyAppointments = familyAppointments?.filter(appointment => 
    appointment.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.familyId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];


  return (
    <div className="container mx-auto bg-gray-50 min-h-screen">
      <Subheader title="Appointment" />

      <div className="mb-6 p-6 flex justify-end items-center">
        <BookAppointmentDialog>
          <Button>Book Appointment</Button>
        </BookAppointmentDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-6">
        {appointmentStats.map((stat, index) => (
          <AppointmentStats key={index} {...stat} />
        ))}
      </div>

      <div className="mb-6 flex px-6 justify-between items-center">
        <TextInput
          startAdornment={<SearchIcon className="h-5 w-5" />}
          label={"Search Keyword"}
          placeholder="Search (Patient ID/Name)"
          containerClass="!w-60"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>

      <Tabs defaultValue="individual" className="w-full px-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="individual"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Individual
            </TabsTrigger>
            <TabsTrigger
              value="family"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Family
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="individual">
          <IndividualPanel 
            appointments={appointments} 
            isLoading={isLoadingAppointments} 
          />
        </TabsContent>
        <TabsContent value="family">
          <DataTable
            columns={appointmentFamilyColumns}
            data={filteredFamilyAppointments}
            options={{ isLoading: isLoadingFamilyAppointments }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NurseAppointmentPage;