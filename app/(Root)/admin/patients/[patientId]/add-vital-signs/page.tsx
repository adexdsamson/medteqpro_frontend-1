"use client";

import React from 'react';
import Subheader from '../../../../_components/Subheader'; // Corrected import path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

// Mock patient data - replace with actual data fetching
const mockPatientData = {
  patientId: 'Patient - 5560',
  name: 'Oluwatosin Chidimma Aminah',
  gender: 'Female',
  dob: '22-03-1980',
  vitals: {
    temperature: '37',
    pulseRate: '72',
    respirationRate: '15',
    bloodPressure: '120/80',
    oxygenSaturation: '98',
    weight: '84',
  },
};

const AddVitalSignsPage = ({ params }: { params: { patientId: string } }) => {
  // In a real app, you would fetch patient data based on params.patientId
  const patient = mockPatientData; // Using mock data for now

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted for patient ID:", params.patientId, "with data:", data);
    // TODO: Implement API call to submit vital signs
  };

  return (
    <>
      <Subheader title={`Patients / Add Vital Signs`} />
      <div className="p-6 lg:max-w-4xl mx-auto bg-white rounded-md shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Patient Details Preview</h2>

        {/* Personal Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-blue-600 mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <p className="text-gray-500">Search Patient ID</p>
              <p className="text-gray-800 font-medium">{patient.patientId}</p>
            </div>
            <div>
              <p className="text-gray-500">Patient Name</p>
              <p className="text-gray-800 font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="text-gray-800 font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="text-gray-800 font-medium">{patient.dob}</p>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <form onSubmit={handleSubmit}>
          {/* Vitals Section - Input Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-blue-600 mb-3">Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <Label htmlFor="temperature" className="text-sm text-gray-500">Body Temperature (C)</Label>
                <Input id="temperature" name="temperature" defaultValue={patient.vitals.temperature} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pulseRate" className="text-sm text-gray-500">Pulse Rate (B/M)</Label>
                <Input id="pulseRate" name="pulseRate" defaultValue={patient.vitals.pulseRate} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="respirationRate" className="text-sm text-gray-500">Respiration Rate (C/M)</Label>
                <Input id="respirationRate" name="respirationRate" defaultValue={patient.vitals.respirationRate} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bloodPressure" className="text-sm text-gray-500">Blood Pressure (mm/Hg)</Label>
                <Input id="bloodPressure" name="bloodPressure" defaultValue={patient.vitals.bloodPressure} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oxygenSaturation" className="text-sm text-gray-500">Oxygen saturation (SPO2) (%)</Label>
                <Input id="oxygenSaturation" name="oxygenSaturation" defaultValue={patient.vitals.oxygenSaturation} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weight" className="text-sm text-gray-500">Weight (kg)</Label>
                <Input id="weight" name="weight" defaultValue={patient.vitals.weight} className="text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Link href={`/admin/patients`}>
              <Button variant="outline" type="button">Back</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVitalSignsPage;