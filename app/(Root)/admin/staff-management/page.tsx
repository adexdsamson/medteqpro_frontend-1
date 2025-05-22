"use client";

import React, { useRef } from 'react';
import { DataTable } from '@/components/DataTable';
import { TextInput, TextInputProps } from '@/components/FormInputs/TextInput';
import { Button } from '@/components/ui/button';
import { FieldProps, Forge, FormPropsRef, useForge } from '@/lib/forge';
import { SearchIcon } from 'lucide-react';
import Subheader from '../../_components/Subheader';
import { StaffType, StaffStatus } from './_components/columns'; // Assuming columns.tsx will export these
import AddStaffDialog from './_components/AddStaffDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { faker } from '@faker-js/faker';
import { staffColumns } from './_components/columns';

// Generate fake staff data based on the Figma design
const generateStaffData = (count: number): StaffType[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    position: faker.person.jobTitle(),
    contact: faker.phone.number(),
    registrationDate: faker.date.past().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit'}).replace(/ /g, '-'),
    status: faker.helpers.arrayElement([StaffStatus.Present, StaffStatus.OnLeave]),
  }));
};

const staffData = generateStaffData(10);

export default function StaffManagementPage() {
  const formRef = useRef<FormPropsRef | null>(null);

  const searchField: FieldProps<TextInputProps>[] = [
    {
      name: 'search',
      label: '', // No label in design, placeholder is used
      type: 'text',
      placeholder: 'Search Name',
      containerClass: 'w-full md:w-1/3',
      component: TextInput,
      showLabel: false,
      startAdornment: <SearchIcon className="h-4 w-4 text-gray-400" />,
      inputClassName: "pl-10", // Padding for the icon
    },
  ];

  const { control } = useForge<{ search: string }>({
    fieldProps: searchField,
    defaultValues: {
      search: '',
    },
  });

  const handleSubmit = async (data: { search: string }) => {
    console.log('Search data:', data);
    // Implement search logic here
  };

  return (
    <Dialog>
      <Subheader title="Staff Management" />
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className='w-full md:w-auto'>
            <p className="text-sm font-medium text-gray-600 mb-1">Search Keyword</p>
            <Forge
              ref={formRef}
              control={control}
              className="flex items-center w-full gap-3"
              onSubmit={handleSubmit}
            />
          </div>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">Add Staff</Button>
          </DialogTrigger>
        </div>

        <div className="bg-white p-1.5 rounded-lg shadow">
          <DataTable
            columns={staffColumns} // Will be defined in _components/columns.tsx
            data={staffData} // Replace with actual data fetching
            options={{
              disableSelection: true,
              // Add other DataTable options as needed, e.g., pagination
            }}
          />
        </div>
      </div>
      <AddStaffDialog />
    </Dialog>
  );
}