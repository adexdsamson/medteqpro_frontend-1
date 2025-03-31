import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Hospital = {
  id: number;
  name: string;
  email: string;
  hospitalName: string;
  numberOfDoctors: string;
  dateRegistered: string;
  location: string;
  status: string;
};

const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'Darasimi Ogundele',
    email: 'dele@Greenlife.com',
    hospitalName: 'Greenlife Hospital',
    numberOfDoctors: '12-Mar-2025',
    dateRegistered: '12-Mar-2025',
    location: 'Lagos',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Shekemi Marvellous',
    email: 'marv@George.com',
    hospitalName: 'George Hospital',
    numberOfDoctors: '12-Mar-2025',
    dateRegistered: '12-Mar-2025',
    location: 'Abuja',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Bolaji Gbenga',
    email: 'bolaji@Medicare.com',
    hospitalName: 'Medicare Hospital',
    numberOfDoctors: '12-Mar-2025',
    dateRegistered: '12-Mar-2025',
    location: 'Lagos',
    status: 'Active',
  },
  {
    id: 4,
    name: 'George Ben',
    email: 'ben@New.com',
    hospitalName: 'New Hospital',
    numberOfDoctors: '12-Mar-2025',
    dateRegistered: '12-Mar-2025',
    location: 'Ogun',
    status: 'Active',
  },
];

export function RecentlyRegisteredTable() {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Hospital Name</TableHead>
            <TableHead>Number of Doctors</TableHead>
            <TableHead>Date Registered</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((hospital) => (
            <TableRow key={hospital.id}>
              <TableCell>{hospital.id}</TableCell>
              <TableCell>{hospital.name}</TableCell>
              <TableCell>{hospital.email}</TableCell>
              <TableCell>{hospital.hospitalName}</TableCell>
              <TableCell>{hospital.numberOfDoctors}</TableCell>
              <TableCell>{hospital.dateRegistered}</TableCell>
              <TableCell>{hospital.location}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                  {hospital.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}