/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import Subheader from '../../../../_components/Subheader'; // Corrected import path
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePatientDetails } from '@/features/services/patientService';
import { useAddVitalSigns, VitalSignsPayload } from '@/features/services/vitalSignsService';
import { useToastHandler } from '@/hooks/useToaster';
import { useForge, Forge, Forger } from '@/lib/forge';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput } from '@/components/FormInputs/TextInput';

// Yup validation schema for vital signs form
const schema = yup.object().shape({
  temperature: yup
    .number()
    .required('Body temperature is required')
    .min(30, 'Temperature must be at least 30°C')
    .max(50, 'Temperature must be at most 50°C'),
  pulseRate: yup
    .number()
    .required('Pulse rate is required')
    .min(30, 'Pulse rate must be at least 30 BPM')
    .max(200, 'Pulse rate must be at most 200 BPM'),
  respirationRate: yup
    .number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .min(5, 'Respiration rate must be at least 5 CPM')
    .max(60, 'Respiration rate must be at most 60 CPM'),
  systolicBP: yup
    .number()
    .required('Systolic blood pressure is required')
    .min(70, 'Systolic BP must be at least 70 mmHg')
    .max(250, 'Systolic BP must be at most 250 mmHg'),
  diastolicBP: yup
    .number()
    .required('Diastolic blood pressure is required')
    .min(40, 'Diastolic BP must be at least 40 mmHg')
    .max(150, 'Diastolic BP must be at most 150 mmHg'),
  oxygenSaturation: yup
    .number()
    .required('Oxygen saturation is required')
    .min(70, 'Oxygen saturation must be at least 70%')
    .max(100, 'Oxygen saturation must be at most 100%'),
  weight: yup
    .number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .min(1, 'Weight must be at least 1 kg')
    .max(500, 'Weight must be at most 500 kg'),
});

type FormValues = yup.InferType<typeof schema>;

const AddVitalSignsPage = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  const { data: patient, isLoading, error } = usePatientDetails(patientId);
  const addVitalSigns = useAddVitalSigns();
  const toast = useToastHandler();

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      temperature: undefined,
      pulseRate: undefined,
      respirationRate: undefined,
      systolicBP: undefined,
      diastolicBP: undefined,
      oxygenSaturation: undefined,
      weight: undefined,
    },
  });

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
            <Link href="/doctor/patients">
              <Button variant="outline" className="mt-4">Back to Patients</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  /**
   * Handles form submission for adding vital signs
   * @param data - Form data containing vital signs measurements
   */
  const handleSubmit = async (data: FormValues) => {
    try {
      const vitalSignsPayload: VitalSignsPayload = {
        body_temperature: data.temperature,
        pulse_rate: data.pulseRate,
        systolic_blood_pressure: data.systolicBP,
        diastolic_blood_pressure: data.diastolicBP,
        oxygen_saturation: data.oxygenSaturation,
        respiration_rate: data.respirationRate || undefined,
        weight: data.weight || undefined,
      };
      
      await addVitalSigns.mutateAsync({
        patientId: patientId,
        data: vitalSignsPayload
      });
      
      toast.success('Success', 'Vital signs added successfully');
      
    } catch (error) {
      console.error('Error submitting vital signs:', error);
      toast.error('Error', 'Failed to add vital signs. Please try again.');
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

        <Forge control={control} onSubmit={handleSubmit}>
          {/* Vitals Section - Input Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-blue-600 mb-3">Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <Forger
                name="temperature"
                component={TextInput}
                label="Body Temperature (C)"
                placeholder="Enter temperature"
                type="number"
                step="0.1"
                required
              />
              <Forger
                name="pulseRate"
                component={TextInput}
                label="Pulse Rate (B/M)"
                placeholder="Enter pulse rate"
                type="number"
                required
              />
              <Forger
                name="respirationRate"
                component={TextInput}
                label="Respiration Rate (C/M)"
                placeholder="Enter respiration rate"
                type="number"
              />
              <Forger
                name="systolicBP"
                component={TextInput}
                label="Systolic Blood Pressure (mmHg)"
                placeholder="Enter systolic BP"
                type="number"
                required
              />
              <Forger
                name="diastolicBP"
                component={TextInput}
                label="Diastolic Blood Pressure (mmHg)"
                placeholder="Enter diastolic BP"
                type="number"
                required
              />
              <Forger
                name="oxygenSaturation"
                component={TextInput}
                label="Oxygen saturation (SPO2) (%)"
                placeholder="Enter oxygen saturation"
                type="number"
                min="0"
                max="100"
                required
              />
              <Forger
                name="weight"
                component={TextInput}
                label="Weight (kg)"
                placeholder="Enter weight"
                type="number"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Link href={`/doctor/patients`}>
              <Button variant="outline" type="button" disabled={addVitalSigns.isPending}>Back</Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={addVitalSigns.isPending}
            >
              {addVitalSigns.isPending ? 'Adding...' : 'Add Vital Signs'}
            </Button>
          </div>
        </Forge>
      </div>
    </>
  );
};

export default AddVitalSignsPage;