'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search } from 'lucide-react';
import { useGetPatientLabTests } from '@/features/services/labResultService';
import { medicalTestColumns } from './medical-test-columns';
import PatientContactCard from './PatientContactCard';

export default function MedicalTestsSection() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch medical test data
  const { data: testData, isLoading, error } = useGetPatientLabTests(patientId, {
    search: searchTerm,
    status: statusFilter,
  });

  const tests = testData?.data || testData || [];

  const handleOrderTest = () => {
    // Handle order test functionality
    console.log('Order new test for patient:', patientId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-600">Medical Test</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-blue-600">Medical Test</h3>
        <div className="text-center py-12 text-red-500">
          <p>Error loading medical test data</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Order Test button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-600">Medical Test</h3>
        <Button onClick={handleOrderTest} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Order Test
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Test results table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by lab number or test type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Test results table */}
          {Array.isArray(tests) && tests.length > 0 ? (
            <DataTable
              columns={medicalTestColumns}
              data={tests}
            />
          ) : (
            <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg">
              <p>No medical test results available</p>
              <p className="text-sm mt-2">Medical test results will be displayed here when available</p>
            </div>
          )}
        </div>

        {/* Right column - Patient contact card */}
        <div className="lg:col-span-1">
          <PatientContactCard name="Patient Name" phone="+1 234 567 8900" />
        </div>
      </div>
    </div>
  );
}