"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import Subheader from "../../_components/Subheader";
import CreatePatientDialog from "./_components/CreatePatientDialog";
import ModernTabs from "./_components/ModernTabs";
import FamilyDataTable from "./_components/FamilyDataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  usePatientList,
  useFamiliesList,
} from "@/features/services/patientService";
import { PatientType } from "@/app/(Root)/admin/patients/_components/patient-data";

// Transform PatientType to match nurse interface
interface NursePatient {
  id: string;
  name: string;
  gender: string;
  regDate: string;
}

const transformPatientForNurse = (patient: PatientType): NursePatient => {
  return {
    id: patient.patientId,
    name: patient.name,
    gender: patient.gender,
    regDate: patient.lastVisit,
  };
};

const columns: ColumnDef<NursePatient>[] = [
  {
    accessorKey: "id",
    header: "Patient ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "regDate",
    header: "Registration Date & Time",
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <SquarePen className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/nurse/patients/${patient.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Share Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewPatient, setOpenNewPatient] = useState(false);

  const { data: patients = [], isLoading } = usePatientList();
  const { data: families = [], isLoading: familiesLoading } = useFamiliesList();

  // Transform patients for nurse interface
  const transformedPatients = patients.map(transformPatientForNurse);

  // Filter patients based on search query and status
  const filteredPatients = transformedPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Error handling removed as it's not needed with current implementation
  return (
    <>
      <Subheader title="Patients" />
      <div className="p-6 min-h-screen ">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setOpenNewPatient(true)}>Add Patient</Button>
        </div>
        <CreatePatientDialog
          open={openNewPatient}
          onOpenChange={setOpenNewPatient}
        />
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Patient ID/Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
        </div>

        <ModernTabs
          tabs={[
            {
              id: "individual",
              label: "Individual",
              content: (
                <div className="bg-white rounded-lg p-6">
                  <DataTable
                    columns={columns}
                    data={filteredPatients}
                    options={{
                      isLoading,
                      disablePagination: false,
                      disableSelection: true,
                    }}
                  />
                </div>
              ),
            },
            {
              id: "family",
              label: "Family",
              content: (
                <div className="bg-white rounded-lg p-6">
                  <FamilyDataTable
                    families={families}
                    isLoading={familiesLoading}
                  />
                </div>
              ),
            },
          ]}
          defaultTab="individual"
        />
      </div>
    </>
  );
};

export default PatientsPage;
