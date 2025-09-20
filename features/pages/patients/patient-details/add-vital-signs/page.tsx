"use client";

import React, { useState } from 'react';
import Subheader from '@/layouts/Subheader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePatientDetails } from '@/features/services/patientService';
import { useAddVitalSigns, VitalSignsPayload } from '@/features/services/vitalSignsService';
import { useToastHandler } from '@/hooks/useToaster';
import { storeFunctions } from '@/store/authSlice';
import { buildRolePath, hasPatientsRoute } from '@/lib/utils';

/**
 * AddVitalSignsPage
 * Renders a form to add vital signs for a patient, showing a brief patient preview.
 * @remarks Uses react-query services and toast handler; ensures fields align with PatientDetailResponse types.
 * @example <AddVitalSignsPage />
 */
const AddVitalSignsPage = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: patient, isLoading, error } = usePatientDetails(patientId);
  const addVitalSigns = useAddVitalSigns();
  const toast = useToastHandler();
  const role = storeFunctions.getState().user?.role;
  const patientsHome = hasPatientsRoute(role) ? buildRolePath(role, "patients") : undefined;

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Subheader title={`Patients / Add Vital Signs`} />
        <div className="p-6 lg:max-w-4xl mx-auto bg-white rounded-md shadow-sm mt-6">
          <div className="text-center py-8">
            <p>Loading patient details...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error || !patient) {
    return (
      <>
        <Subheader title={`Patients / Add Vital Signs`} />
        <div className="p-6 lg:max-w-4xl mx-auto bg-white rounded-md shadow-sm mt-6">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading patient details. Please try again.</p>
            {patientsHome ? (
              <Link href={patientsHome} prefetch={false}>
                <Button variant="outline" className="mt-4">Back to Patients</Button>
              </Link>
            ) : (
              <Button variant="outline" className="mt-4" disabled>Back to Patients</Button>
            )}
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      // Parse blood pressure
      const bloodPressure = (data.bloodPressure as string).split('/');
      const systolic = parseInt(bloodPressure[0]);
      const diastolic = parseInt(bloodPressure[1]);
      
      const vitalSignsPayload: VitalSignsPayload = {
        body_temperature: parseFloat(data.temperature as string),
        pulse_rate: parseInt(data.pulseRate as string),
        systolic_blood_pressure: systolic,
        diastolic_blood_pressure: diastolic,
        oxygen_saturation: parseInt(data.oxygenSaturation as string),
        respiration_rate: data.respirationRate ? parseInt(data.respirationRate as string) : undefined,
        weight: data.weight ? parseFloat(data.weight as string) : undefined,
      };
      
      await addVitalSigns.mutateAsync({
        patientId: patientId,
        data: vitalSignsPayload
      });
      
      toast.success('Success', 'Vital signs added successfully');
      
      // Reset form
      event.currentTarget.reset();
      
    } catch (error) {
      console.error('Error submitting vital signs:', error);
      toast.error('Error', 'Failed to add vital signs. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="text-gray-800 font-medium">{patient.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Patient Name</p>
              <p className="text-gray-800 font-medium">{patient.full_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="text-gray-800 font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-gray-500">Age</p>
              <p className="text-gray-800 font-medium">{patient.age} years</p>
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
                <Input id="temperature" name="temperature" type="number" step="0.1" required className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pulseRate" className="text-sm text-gray-500">Pulse Rate (B/M)</Label>
                <Input id="pulseRate" name="pulseRate" type="number" required className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="respirationRate" className="text-sm text-gray-500">Respiration Rate (C/M)</Label>
                <Input id="respirationRate" name="respirationRate" type="number" className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bloodPressure" className="text-sm text-gray-500">Blood Pressure (mm/Hg)</Label>
                <Input id="bloodPressure" name="bloodPressure" placeholder="120/80" required className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oxygenSaturation" className="text-sm text-gray-500">Oxygen saturation (SPO2) (%)</Label>
                <Input id="oxygenSaturation" name="oxygenSaturation" type="number" min="0" max="100" required className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weight" className="text-sm text-gray-500">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" className="text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            {patientsHome ? (
              <Link href={patientsHome} prefetch={false}>
                <Button variant="outline" type="button" disabled={isSubmitting}>Back</Button>
              </Link>
            ) : (
              <Button variant="outline" type="button" disabled>Back</Button>
            )}
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Vital Signs'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVitalSignsPage;