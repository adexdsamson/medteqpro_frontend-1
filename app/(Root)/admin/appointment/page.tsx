"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import {
  AppointmentFamily,
  appointmentFamilyColumns,
} from "./_components/columns"; // Assuming this will be created
import Subheader from "../../_components/Subheader";
import {
  AppointmentStats,
  AppointmentStatPRops,
} from "./_components/AppointmentStat";
import { IndividualPanel } from "./_components/IndividualPanel";
import { makeArrayData } from "@/demo";
import { TextInput } from "@/components/FormInputs/TextInput";
import { SearchIcon } from "lucide-react";

const AdminAppointmentPage = () => {
  // const { data: appointments, isLoading } = useAppointments(); // API integration later

  // Dummy data for now
  const familyAppointments = makeArrayData<AppointmentFamily>((faker) => {
    return {
      familyId: faker.string.uuid(),
      familyName: faker.person.fullName(),
      appointmentDateTime: faker.date.past().toLocaleString(),
      numberOfMembers: faker.number.int({ min: 1, max: 5 }),
      status: faker.helpers.arrayElement([
        "Completed",
        "Upcoming",
        "Rescheduled",
        "Cancelled",
      ]),
    };
  });

  const appointmentStats: AppointmentStatPRops[] = [
    {
      title: "Yearly",
      period: "2024",
      action: "Set Year",
      appointmentStatus: [
        { label: "Completed", count: "55", color: "text-green-400" },
        { label: "Rescheduled", count: "10", color: "text-yellow-400" },
        { label: "Cancelled", count: "15", color: "text-red-400" },
      ],
    }, // Example data
    {
      title: "Monthly",
      period: "April",
      action: "Set Month",
      appointmentStatus: [
        { label: "Completed", count: "55", color: "text-green-400" },
        { label: "Rescheduled", count: "10", color: "text-yellow-400" },
        { label: "Cancelled", count: "15", color: "text-red-400" },
      ],
    },
    {
      title: "Daily",
      period: "Today",
      action: "Set Day",
      appointmentStatus: [
        { label: "Completed", count: "55", color: "text-green-400" },
        { label: "Rescheduled", count: "10", color: "text-yellow-400" },
        { label: "Cancelled", count: "15", color: "text-red-400" },
      ],
    },
  ];

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen">
      <Subheader title="Appointment" />

      <div className="mb-6 p-6 flex justify-end items-center">
        <Button>Book Appointment</Button>
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
          <IndividualPanel />
        </TabsContent>
        <TabsContent value="family">
          <DataTable
            columns={appointmentFamilyColumns}
            data={familyAppointments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAppointmentPage;
