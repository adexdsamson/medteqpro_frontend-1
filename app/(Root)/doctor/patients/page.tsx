'use client';

import React, { useState } from "react";
import Subheader from "../../_components/Subheader";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PatientTable from "./_components/patient-table";
import { usePatientList } from "@/features/services/patientService";
import CreatePatientDialog from "./_components/CreatePatientDialog";

const DoctorPatientPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: patients = [], isLoading } = usePatientList({ search: searchTerm || undefined });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Subheader title="My Patients" />
      <div className="p-6 space-y-6 min-h-screen w-full">
        <div className="space-y-4">
          <div className="flex justify-end">
            <CreatePatientDialog>
              <Button>Add Patient</Button>
            </CreatePatientDialog>
          </div>

          <div className="flex items-center gap-2 w-fit bg-white p-2 ">
            <Search className="text-gray-400" size={20} />
            <input
              placeholder="Patient name/ID"
              className="w-full border-0 ring-0"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <PatientTable data={patients} />
        )}
      </div>
    </>
  );
};

export default DoctorPatientPage;