'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { SquarePen} from 'lucide-react';
import Subheader from '../../_components/Subheader';
import { NewPatientDialog } from "@/components/dialogs/NewPatientDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';

interface Patient {
  id: string;
  name: string;
  gender: string;
  regDate: string;
}

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "id",
    header: "PATIENT ID",
  },
  {
    accessorKey: "name",
    header: "PATIENT NAME",
  },
  {
    accessorKey: "gender",
    header: "GENDER",
  },
  {
    accessorKey: "regDate",
    header: "REG DATE & TIME",
  },
  {
    id: "actions",
    cell: ({row}) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SquarePen className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
        <Link  href={`patients/${row?.original.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            View Details
          </DropdownMenuItem>
        </Link>
          <DropdownMenuItem className="cursor-pointer">
            Share Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    header: "ACTION",
  },
];

const mockData: Patient[] = [
  {
    id: 'Patient-2234',
    name: 'chioma Azeez',
    gender: 'Female',
    regDate: '22-May-24 11:24AM',
  },
  {
    id: 'Patient-3409',
    name: 'Rotimi Hassan',
    gender: 'Male',
    regDate: '22-May-24 11:24AM',
  },
  {
    id: 'Patient-2234',
    name: 'Bode Fagba',
    gender: 'Male',
    regDate: '22-May-24 11:24AM',
  },
  {
    id: 'Patient-3409',
    name: 'Queen Gabara',
    gender: 'Female',
    regDate: '22-May-24 11:24AM',
  },
  {
    id: 'Patient-2234',
    name: 'Babra Kone',
    gender: 'Male',
    regDate: '22-May-24 11:24AM',
  },
];

const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
const [openNewPatient, setOpenNewPatient] = useState(false);
  return (
    <>
      <Subheader title="Patients" />
      <div className="p-6 min-h-screen ">
        <div className="flex justify-end mb-6">
         
            <Button  onClick={() => setOpenNewPatient(true)}>Add Patient</Button>
         
        </div>
         <NewPatientDialog 
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

          <Tabs defaultValue="individual" className=" mb-4 bg-0  ">
            <TabsList className="bg-0 border-gray-200 border-b  ">
              <TabsTrigger value="individual" className="data-[state=active]:border-b-2 border-0 data-[state=active]:border-[#0D277F] w-max">Individual</TabsTrigger>
              <TabsTrigger value="family" className="data-[state=active]:border-b-2 border-0 data-[state=active]:border-[#0D277F] w-max">Family</TabsTrigger>
            </TabsList>
          </Tabs>
        <div className="bg-white rounded-lg p-6">
          <DataTable
            columns={columns}
            data={mockData}
            options={{
              disablePagination: false,
              disableSelection: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PatientsPage;