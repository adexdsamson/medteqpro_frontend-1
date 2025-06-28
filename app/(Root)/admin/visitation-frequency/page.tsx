"use client";

import React, { useState } from "react";
import Subheader from "../../_components/Subheader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar-rac";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";


interface PatientVisit {
  patientId: string;
  patientName: string;
  frequency: number;
  lastVisitDate: string;
}

const VisitationFrequency = () => {
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  // Mock data for patient visits
  const patientVisits: PatientVisit[] = [
    { patientId: "Patient-2234", patientName: "Chioma Azeez", frequency: 23, lastVisitDate: "22-May-24" },
    { patientId: "Patient-3409", patientName: "Rotimi Hassan", frequency: 12, lastVisitDate: "22-May-24" },
    { patientId: "Patient-2234", patientName: "Bode Fagba", frequency: 9, lastVisitDate: "22-May-24" },
    { patientId: "Patient-3409", patientName: "Queen Gabara", frequency: 20, lastVisitDate: "22-May-24" },
    { patientId: "Patient-2234", patientName: "Babra Kane", frequency: 13, lastVisitDate: "22-May-24" },
    { patientId: "Patient-3409", patientName: "Johnson Hugo", frequency: 11, lastVisitDate: "22-May-24" },
    { patientId: "Patient-2234", patientName: "Phina Rapheal", frequency: 2, lastVisitDate: "22-May-24" },
    { patientId: "Patient-3409", patientName: "Jenny Mikolo", frequency: 66, lastVisitDate: "22-May-24" },
    { patientId: "Patient-2234", patientName: "Sunday Mathew", frequency: 23, lastVisitDate: "22-May-24" },
    { patientId: "Patient-3409", patientName: "Kayode Metu", frequency: 18, lastVisitDate: "22-May-24" },
  ];

  // Define columns for DataTable
  const columns: ColumnDef<PatientVisit>[] = [
    {
      accessorKey: "patientId",
      header: "NO OF PATIENTS",
    },
    {
      accessorKey: "patientName",
      header: "PATIENT NAME",
    },
    {
      accessorKey: "frequency",
      header: "FREQUENCY OF VISIT",
    },
    {
      accessorKey: "lastVisitDate",
      header: "LAST VISIT DATE",
    },
    {
      id: "action",
      header: "ACTION",
      cell: () => (
        <Button variant="ghost" size="sm" className="p-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.91 4.15002C15.58 6.54002 17.45 8.41002 19.85 9.09002" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      ),
    },
  ];

  // Pagination state for DataTable
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <>
      <Subheader title="Visitation Frequency" />
      
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        {/* Date Range Selection */}
        <div className="bg-white p-6 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium mb-2">Select Date</Label>
              <div className="flex items-center gap-4">
                {/* Start Date Picker */}
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? (
                          customStartDate.toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">Custom</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate || undefined}
                        onSelect={(date) => setCustomStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <span className="text-gray-500">To</span>

                {/* End Date Picker */}
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? (
                          customEndDate.toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">DD/MM/YYYY</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate || undefined}
                        onSelect={(date) => setCustomEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visitation Table */}
        <div className="bg-white rounded-sm overflow-hidden p-1.5">
          <DataTable
            columns={columns}
            data={patientVisits}
            options={{
              disableSelection: true,
              pagination: pagination,
              setPagination: setPagination,
              manualPagination: false,
              totalCounts: patientVisits.length,
              isLoading: false
            }}
          />
        </div>
      </div>
    </>
  );
};

export default VisitationFrequency;