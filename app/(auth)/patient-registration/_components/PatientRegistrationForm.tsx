"use client";

import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Forge, Forger, FormPropsRef, useForge } from "@/lib/forge";
import type { Resolver } from "react-hook-form";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";
import {
  CreatePatientPayload,
  useCreatePatient,
} from "@/features/services/patientService";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { useRouter } from "next/navigation";

const StepIndicator = ({ step }: { step: number }) => {
  const steps = [
    "Personal Information",
    "Medical Information",
    "Social Information",
  ];
  return (
    <div className="flex items-center gap-4 justify-center mb-6 text-xs md:text-sm">
      {steps.map((label, idx) => {
        const current = idx + 1;
        const active = step === current;
        const completed = step > current;
        return (
          <div className="flex items-center gap-2" key={label}>
            <div
              className={`flex items-center justify-center h-5 w-5 rounded-full border text-[10px] ${
                active
                  ? "bg-[#0D277F] text-white border-[#0D277F]"
                  : completed
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {current}
            </div>
            <span
              className={`whitespace-nowrap ${
                active ? "text-[#0D277F] font-semibold" : "text-gray-600"
              }`}
            >
              {label}
            </span>
            {idx < steps.length - 1 && <span className="text-gray-400">›</span>}
          </div>
        );
      })}
    </div>
  );
};

export default function PatientRegistrationForm() {
  const [step, setStep] = useState(1);
  const formRef = useRef<FormPropsRef | null>(null);
  const toast = useToastHandler();
  const createPatient = useCreatePatient();
  const router = useRouter();

  // Accumulated data across steps
  const [payload, setPayload] = useState<Partial<CreatePatientPayload>>({});

  // Schemas per step
  const schemaOne = useMemo(
    () =>
      yup.object({
        user_id: yup.string().required("User ID is required"),
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        address: yup.string().required("Address is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        phone_number: yup.string().required("Phone number is required"),
        marital_status: yup.string().required("Marital status is required"),
        date_of_birth: yup.string().required("Date of birth is required"),
        gender: yup.string().required("Gender is required"),
        height: yup.number().typeError("Height must be a number").optional(),
        weight: yup.number().typeError("Weight must be a number").optional(),
        employment_status: yup
          .string()
          .required("Employment status is required"),
        emergency_contact_name: yup
          .string()
          .required("Emergency contact name is required"),
        emergency_contact_phone: yup
          .string()
          .required("Emergency contact phone is required"),
        emergency_contact_address: yup
          .string()
          .required("Emergency contact address is required"),
      }),
    []
  );

  const schemaTwo = useMemo(
    () =>
      yup.object({
        medication: yup.string().optional(),
        dosage: yup.string().optional(),
        frequency: yup.string().optional(),
        allergies: yup.string().optional(),
        family_history: yup.string().optional(),
        hereditary_conditions: yup.string().optional(),
        surgical_history: yup.string().optional(),
      }),
    []
  );

  const schemaThree = useMemo(
    () =>
      yup.object({
        smoking: yup.string().optional(),
        alcohol: yup.string().optional(),
        drug_use: yup.string().optional(),
        exercise: yup.string().optional(),
        diet: yup.string().optional(),
      }),
    []
  );

  type StepOne = yup.InferType<typeof schemaOne>;
  type StepTwo = yup.InferType<typeof schemaTwo>;
  type StepThree = yup.InferType<typeof schemaThree>;

  // Use the appropriate schema based on current step with default values
  const { control: controlStep1 } = useForge<StepOne>({
    resolver: yupResolver(schemaOne) as unknown as Resolver<StepOne>,
    defaultValues: {
      user_id: "",
      first_name: "",
      last_name: "",
      address: "",
      city: "",
      state: "",
      phone_number: "",
      marital_status: "",
      date_of_birth: "",
      gender: "",
      employment_status: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_address: "",
    },
  });

  const { control: controlStep2 } = useForge<StepTwo>({
    resolver: yupResolver(schemaTwo) as unknown as Resolver<StepTwo>,
    defaultValues: {
      medication: "",
      dosage: "",
      frequency: "",
      allergies: "",
      family_history: "",
      hereditary_conditions: "",
      surgical_history: "",
    },
  });

  const { control: controlStep3 } = useForge<StepThree>({
    resolver: yupResolver(schemaThree) as unknown as Resolver<StepThree>,
    defaultValues: {
      smoking: "",
      alcohol: "",
      drug_use: "",
      exercise: "",
      diet: "",
    },
  });

  const onNext = async (data: StepOne | StepTwo | StepThree) => {
    if (step === 1) {
      const stepData = data as StepOne;
      const nextPayload: Partial<CreatePatientPayload> = {
        ...payload,
        user_id: stepData.user_id,
        first_name: stepData.first_name,
        last_name: stepData.last_name,
        address: stepData.address,
        city: stepData.city,
        state: stepData.state,
        phone_number: stepData.phone_number,
        marital_status: stepData.marital_status,
        date_of_birth: stepData.date_of_birth,
        gender: stepData.gender,
        height: stepData.height ? Number(stepData.height) : undefined,
        weight: stepData.weight ? Number(stepData.weight) : undefined,
        employment_status: stepData.employment_status,
        emergency_contact: {
          name: stepData.emergency_contact_name,
          phone: stepData.emergency_contact_phone,
          address: stepData.emergency_contact_address,
        },
      };
      setPayload(nextPayload);
      setStep(2);
    } else if (step === 2) {
      const stepData = data as StepTwo;
      const nextPayload: Partial<CreatePatientPayload> = {
        ...payload,
        current_medications:
          stepData.medication || stepData.dosage || stepData.frequency
            ? [
                {
                  medication: stepData.medication ?? "",
                  dosage: stepData.dosage ?? "",
                  frequency: stepData.frequency ?? "",
                },
              ]
            : undefined,
        allergies: stepData.allergies,
        family_history: stepData.family_history,
        hereditary_conditions: stepData.hereditary_conditions,
        surgical_history: stepData.surgical_history,
      };
      setPayload(nextPayload);
      setStep(3);
    } else {
      // Final submit
      const stepData = data as StepThree;
      const finalPayload: CreatePatientPayload = {
        user_id: payload.user_id ?? "",
        first_name: payload.first_name ?? "",
        last_name: payload.last_name ?? "",
        address: payload.address ?? "",
        city: payload.city ?? "",
        state: payload.state ?? "",
        phone_number: payload.phone_number ?? "",
        marital_status: payload.marital_status ?? "",
        date_of_birth: payload.date_of_birth ?? "",
        gender: payload.gender ?? "",
        height: payload.height,
        weight: payload.weight,
        employment_status: payload.employment_status ?? "",
        emergency_contact:
          payload.emergency_contact as CreatePatientPayload["emergency_contact"],
        current_medications: payload.current_medications,
        allergies: payload.allergies,
        family_history: payload.family_history,
        hereditary_conditions: payload.hereditary_conditions,
        chronic_conditions: payload.chronic_conditions,
        other_conditions: payload.other_conditions,
        surgical_history: payload.surgical_history,
        social_history: {
          smoking: stepData.smoking,
          alcohol: stepData.alcohol,
          drug_use: stepData.drug_use,
          exercise: stepData.exercise,
          diet: stepData.diet,
        },
      };

      try {
        const res = await createPatient.mutateAsync(finalPayload);
        if (res) {
          toast.success(
            "Registration Successful",
            "Your patient profile has been created."
          );
          // Navigate to login or dashboard after successful registration
          router.push("/sign-in");
        } else {
          toast.success("Submitted", "Patient registration submitted.");
        }
      } catch (error) {
        const err = error as ApiResponseError;
        toast.error(
          "Registration Failed",
          err?.message ?? "Something went wrong"
        );
      }
    }
  };

  return (
    <div className="w-full">
      <header className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[#0D277F]">
          New Patient
        </h2>
      </header>

      <Card className="w-full max-w-3xl mx-auto border-none shadow-none bg-transparent">
        <CardContent className="p-0 max-h-[80vh] overflow-y-auto pr-2">
          <StepIndicator step={step} />
          {step === 1 && (
            <Forge ref={formRef} control={controlStep1} onSubmit={onNext}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Forger
                  name="user_id"
                  component={TextInput}
                  label="User ID"
                  placeholder="Enter your User ID"
                  containerClass="md:col-span-2"
                />
                <Forger
                  name="first_name"
                  component={TextInput}
                  label="First Name"
                  placeholder="First Name"
                />
                <Forger
                  name="last_name"
                  component={TextInput}
                  label="Last Name"
                  placeholder="Last Name"
                />
                <Forger
                  name="address"
                  component={TextInput}
                  label="Address"
                  placeholder="Address"
                  containerClass="md:col-span-2"
                />
                <Forger
                  name="city"
                  component={TextInput}
                  label="City"
                  placeholder="City"
                />
                <Forger
                  name="state"
                  component={TextInput}
                  label="State"
                  placeholder="State"
                />
                <Forger
                  name="phone_number"
                  component={TextInput}
                  label="Phone Number"
                  placeholder="Phone Number"
                />
                <Forger
                  name="marital_status"
                  component={TextSelect}
                  label="Marital Status"
                  placeholder="Select Option"
                  options={[
                    { label: "Single", value: "single" },
                    { label: "Married", value: "married" },
                    { label: "Divorced", value: "divorced" },
                    { label: "Widowed", value: "widowed" },
                  ]}
                />
                <Forger
                  name="date_of_birth"
                  component={TextDateInput}
                  label="Date of Birth"
                />
                <Forger
                  name="gender"
                  component={TextSelect}
                  label="Gender"
                  placeholder="Select Option"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
                <Forger
                  name="height"
                  type="number"
                  component={TextInput}
                  label="Height (FT)"
                  placeholder="0"
                />
                <Forger
                  name="weight"
                  type="number"
                  component={TextInput}
                  label="Weight (KG)"
                  placeholder="0"
                />
                <Forger
                  name="employment_status"
                  component={TextSelect}
                  label="Employment Type"
                  placeholder="Select Option"
                  containerClass="md:col-span-2"
                  options={[
                    { label: "Employed", value: "employed" },
                    { label: "Unemployed", value: "unemployed" },
                    { label: "Student", value: "student" },
                    { label: "Retired", value: "retired" },
                    { label: "Self Employed", value: "self_employed" },
                  ]}
                />

                <div className="col-span-1 md:col-span-2 mt-2">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">
                    Emergency Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Forger
                      name="emergency_contact_name"
                      component={TextInput}
                      label="Full Name"
                      placeholder="Full Name"
                    />
                    <Forger
                      name="emergency_contact_phone"
                      component={TextInput}
                      label="Phone Number"
                      placeholder="Phone Number"
                    />
                    <Forger
                      name="emergency_contact_address"
                      component={TextInput}
                      label="Address"
                      placeholder="Address"
                      containerClass="md:col-span-2"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-between gap-3 mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-w-24"
                    onClick={() => history.back()}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="min-w-24"
                    onClick={() => formRef.current?.onSubmit()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Forge>
          )}

          {step === 2 && (
            <Forge ref={formRef} control={controlStep2} onSubmit={onNext}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Forger
                  name="medication"
                  component={TextInput}
                  label="Medication"
                  placeholder="Medication"
                />
                <Forger
                  name="dosage"
                  component={TextInput}
                  label="Dosage"
                  placeholder="Dosage"
                />
                <Forger
                  name="frequency"
                  component={TextInput}
                  label="Frequency"
                  placeholder="Frequency"
                />
                <Forger
                  name="allergies"
                  component={TextArea}
                  label="Any Allergies to Medication or Food? (list reactions)"
                  placeholder="If none, type N/A"
                  rows={3}
                  containerClass="md:col-span-2"
                />
                <Forger
                  name="family_history"
                  component={TextArea}
                  label="Family Medical History"
                  placeholder="If none, type N/A"
                  rows={3}
                  containerClass="md:col-span-2"
                />
                <Forger
                  name="hereditary_conditions"
                  component={TextArea}
                  label="Hereditary Disease"
                  placeholder="If none, type N/A"
                  rows={3}
                  containerClass="md:col-span-2"
                />
                <Forger
                  name="surgical_history"
                  component={TextArea}
                  label="Surgery History"
                  placeholder="If none, type N/A"
                  rows={3}
                  containerClass="md:col-span-2"
                />

                <div className="col-span-1 md:col-span-2 flex justify-between gap-3 mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-w-24"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="min-w-24"
                    onClick={() => formRef.current?.onSubmit()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Forge>
          )}

          {step === 3 && (
            <Forge ref={formRef} control={controlStep3} onSubmit={onNext}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Forger
                  name="smoking"
                  component={TextSelect}
                  label="Do you smoke?"
                  placeholder="Select Option"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "Occasionally", value: "occasionally" },
                  ]}
                />
                <Forger
                  name="alcohol"
                  component={TextSelect}
                  label="Do you drink alcohol?"
                  placeholder="Select Option"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "Occasionally", value: "occasionally" },
                  ]}
                />
                <Forger
                  name="drug_use"
                  component={TextSelect}
                  label="Any history of illegal drug?"
                  placeholder="Select Option"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
                <Forger
                  name="exercise"
                  component={TextSelect}
                  label="Do you exercise?"
                  placeholder="Select Option"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "Sometimes", value: "sometimes" },
                  ]}
                />
                <Forger
                  name="diet"
                  component={TextSelect}
                  label="Are you on any special diet?"
                  placeholder="Select Option"
                  containerClass="md:col-span-2"
                  options={[
                    { label: "None", value: "none" },
                    { label: "Vegetarian", value: "vegetarian" },
                    { label: "Low Carb", value: "low_carb" },
                    { label: "Keto", value: "keto" },
                    { label: "Other", value: "other" },
                  ]}
                />

                <div className="col-span-1 md:col-span-2 flex justify-between gap-3 mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-w-24"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    loading={createPatient.isPending}
                    className="min-w-24"
                    onClick={() => formRef.current?.onSubmit()}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Forge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
