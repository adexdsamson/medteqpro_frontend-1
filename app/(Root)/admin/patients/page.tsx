"use client";

import React from "react";
import Subheader from "../../_components/Subheader";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PatientTable from "./_components/patient-table";

import { getSamplePatientData } from "./_components/patient-data";

const AdminPatientPage = () => {
  const patients = getSamplePatientData;

  return (
    <>
      <Subheader title="Patient Management" />
      <div className="p-6 space-y-6 min-h-screen w-full">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button>Add Patient</Button>
          </div>

          <div className="flex items-center gap-2 w-fit bg-white p-2 ">
            <Search className="text-gray-400" size={20} />
            <input
              placeholder="Patient name/ID"
              className="w-full border-0 ring-0 "
            />
          </div>
        </div>

        {/* Placeholder for DataTable */}
        <PatientTable data={patients} />
      </div>
    </>
  );
};

export default AdminPatientPage;
