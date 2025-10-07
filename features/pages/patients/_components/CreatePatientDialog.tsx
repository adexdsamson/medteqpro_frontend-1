/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForge, Forge, Forger } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextArea } from "@/components/FormInputs/TextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreatePatient } from "@/features/services/patientService";
import { useToastHandler } from "@/hooks/useToaster";
import { useWatch } from "react-hook-form";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { format } from "date-fns";

// Combined validation schema for all form steps
const fullSchema = yup.object().shape({
  // Personal Info fields - Required fields based on API contract
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  phone_number: yup.string().required("Phone number is required"),
  marital_status: yup.string().required("Marital status is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  height: yup.number().positive("Height must be positive").required("Height is required"),
  weight: yup.number().positive("Weight must be positive").required("Weight is required"),
  employment_status: yup.string().required("Employment status is required"),
  emergency_contact: yup.object().shape({
    name: yup.string().required("Emergency contact name is required"),
    phone: yup.string().required("Emergency contact phone is required"),
    address: yup.string().required("Emergency contact address is required"),
  }).required(),
  // Medical Info fields
  current_medications: yup
    .array()
    .of(
      yup.object().shape({
        medication: yup.string().required(),
        dosage: yup.string().required(),
        frequency: yup.string().required(),
      })
    )
    .required(),
  allergies: yup.string().required(),
  family_history: yup.string().required(),
  hereditary_conditions: yup.string().required(),
  surgical_history: yup.string().required(),
  blood_group: yup.string().required(),
  // Social Info fields
  social_history: yup
    .object()
    .shape({
      smoking: yup.string().required(),
      alcohol: yup.string().required(),
      drug_use: yup.string().required(),
      exercise: yup.string().required(),
      diet: yup.string().required(),
    })
    .required(),
});

// Define the form data type to match the API contract
type FullFormData = {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phone_number: string;
  marital_status: string;
  date_of_birth: string;
  gender: string;
  height: number;
  weight: number;
  employment_status: string;
  emergency_contact: {
    name: string;
    phone: string;
    address: string;
  };
  current_medications: Array<{
    medication: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: string;
  family_history: string;
  hereditary_conditions: string;
  surgical_history: string;
  blood_group: string;
  social_history: {
    smoking: string;
    alcohol: string;
    drug_use: string;
    exercise: string;
    diet: string;
  };
};

interface CreatePatientDialogProps {
  children: React.ReactNode;
}

const CreatePatientDialog: React.FC<CreatePatientDialogProps> = ({
  children,
}) => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [statesData, setStatesData] = useState<
    Array<{ state: string; alias: string; lgas: string[] }>
  >([]);
  const toast = useToastHandler();
  const { mutateAsync: createPatient, isPending } = useCreatePatient();

  // Load states data from JSON file
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch("/nigeria-states-lgas.json");
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error("Error loading states data:", error);
      }
    };
    loadStatesData();
  }, []);

  const { control, reset, trigger } = useForge<FullFormData>({
    resolver: yupResolver(fullSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      phone_number: "",
      marital_status: "",
      date_of_birth: "",
      gender: "",
      blood_group: "",
      height: 0,
      weight: 0,
      employment_status: "",
      emergency_contact: {
        name: "",
        phone: "",
        address: "",
      },
      current_medications: [],
      allergies: "",
      family_history: "",
      hereditary_conditions: "",
      surgical_history: "",
      social_history: {
        smoking: "",
        alcohol: "",
        drug_use: "",
        exercise: "",
        diet: "",
      },
    },
    mode: "onChange"
  });

  const stepFieldMap: Record<number, (keyof FullFormData | string)[]> = {
    1: [
      "first_name",
      "last_name",
      "email",
      "address",
      "phone_number",
      "state",
      "city",
      "marital_status",
      "date_of_birth",
      "gender",
      "height",
      "weight",
      "employment_status",
    ],
    2: [
      "current_medications.0.medication",
      "current_medications.0.dosage",
      "current_medications.0.frequency",
      "blood_group",
      "allergies",
      "family_history",
      "hereditary_conditions",
      "surgical_history",
    ],
    3: [
      "social_history.smoking",
      "social_history.alcohol",
      "social_history.drug_use",
      "social_history.exercise",
      "social_history.diet",
    ],
    4: [
      "emergency_contact.name",
      "emergency_contact.phone",
      "emergency_contact.address",
    ],
  };

  const handleNext = async () => {
    if (step < 4) {
      const fieldsToValidate = stepFieldMap[step] ?? [];
      const isValid = await trigger(fieldsToValidate as any, {
        shouldFocus: true,
      });
      if (isValid) {
        setStep(step + 1);
      } else {
        toast.error(
          "Validation error",
          "Please complete all required fields in this step."
        );
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: FullFormData) => {
    try {
      // Transform data to match API format
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth ? format(data.date_of_birth, "yyyy-MM-dd") : "",
        current_medications: data.current_medications.map(med => ({
          medication: med.medication,
          dosage: med.dosage,
          frequency: med.frequency
        })),
        social_history: {
          smoking: data.social_history.smoking,
          alcohol: data.social_history.alcohol,
          drug_use: data.social_history.drug_use,
          exercise: data.social_history.exercise,
          diet: data.social_history.diet
        },
      };

      await createPatient(payload);
      toast.success("Success", "Patient created successfully");
      setOpen(false);
      reset();
      setStep(1);
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Error", "Failed to create patient");
    }
  };

  // Watch for state changes to update city options
  const watchedState = useWatch({ control, name: "state" });

  // Generate state options from loaded data
  const stateOptions = statesData.map((state) => ({
    label: state.state,
    value: state.alias,
  }));

  // Generate city options based on selected state
  const cityOptions =
    statesData
      .find((state) => state?.alias === watchedState)
      ?.lgas.map((lga) => ({
        label: lga,
        value: lga,
      })) || [];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const maritalStatusOptions = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
    { label: "Widowed", value: "widowed" },
  ];

  const employmentOptions = [
    { label: "Employed", value: "employed" },
    { label: "Unemployed", value: "unemployed" },
    { label: "Student", value: "student" },
    { label: "Retired", value: "retired" },
  ];

  const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const smokingOptions = [
    { label: "Non-smoker", value: "non-smoker" },
    { label: "Occasional", value: "occasional" },
    { label: "Regular", value: "regular" },
  ];

  const alcoholOptions = [
    { label: "Never", value: "never" },
    { label: "Occasional", value: "occasional" },
    { label: "Regular", value: "regular" },
  ];

  const exerciseOptions = [
    { label: "Never", value: "never" },
    { label: "Rarely", value: "rarely" },
    { label: "Regular", value: "regular" },
    { label: "Daily", value: "daily" },
  ];

  const dietOptions = [
    { label: "Balanced", value: "balanced" },
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Vegan", value: "vegan" },
    { label: "Special Diet", value: "special" },
  ];

  const bloodGroupOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            New Patient
          </DialogTitle>
        </DialogHeader>

        <Forge control={control} onSubmit={onSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <Forger
                name="email"
                component={TextInput}
                label="Email Address"
                placeholder="Email Address"
                type="email"
              />

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="address"
                  component={TextInput}
                  label="Address"
                  placeholder="Address"
                />
                <Forger
                  name="phone_number"
                  component={TextInput}
                  label="Phone Number"
                  placeholder="Phone Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="state"
                  component={TextSelect}
                  label="State"
                  placeholder="Select Option"
                  options={stateOptions}
                />

                <Forger
                  name="city"
                  component={TextSelect}
                  label="City"
                  placeholder="Select City"
                  options={cityOptions}
                  disabled={!watchedState}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="marital_status"
                  component={TextSelect}
                  label="Marital Status"
                  placeholder="Select Option"
                  options={maritalStatusOptions}
                />
                <Forger
                  name="date_of_birth"
                  component={TextDateInput}
                  label="Date of Birth"
                  placeholder="DD-MM-YYYY"
                  type="date"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="gender"
                  component={TextSelect}
                  label="Gender"
                  placeholder="Select Option"
                  options={genderOptions}
                />
                <Forger
                  name="height"
                  component={TextInput}
                  label="Height (FT)"
                  placeholder="0"
                  type="number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="weight"
                  component={TextInput}
                  label="Weight (KG)"
                  placeholder="0"
                  type="number"
                />
                <Forger
                  name="employment_status"
                  component={TextSelect}
                  label="Employment Type"
                  placeholder="Select Option"
                  options={employmentOptions}
                />
              </div>


            </div>
          )}

          {/* Step 2: Medical Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">
                Medical Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="current_medications.0.medication"
                  component={TextInput}
                  label="Medication"
                  placeholder="Medication Name"
                />
                <Forger
                  name="current_medications.0.dosage"
                  component={TextInput}
                  label="Dosage"
                  placeholder="Dosage Amount"
                />
              </div>

              <Forger
                name="current_medications.0.frequency"
                component={TextInput}
                label="Frequency"
                placeholder="Frequency (e.g., Daily, Twice a day)"
              />

              <Forger
                name="blood_group"
                component={TextSelect}
                label="Blood Group"
                placeholder="Select Option"
                options={bloodGroupOptions}
              />

              <Forger
                name="allergies"
                component={TextArea}
                label="Any Allergies?"
                placeholder="If none, type N/A"
                helperText="Any Allergies to Medication or Food (list reactions)"
                rows={4}
              />

              <Forger
                name="family_history"
                component={TextArea}
                label="Family Medical History"
                placeholder="If none, type N/A"
                rows={4}
              />

              <Forger
                name="hereditary_conditions"
                component={TextArea}
                label="Hereditary Disease"
                placeholder="If none, type N/A"
                rows={4}
              />
              <Forger
                name="surgical_history"
                component={TextArea}
                label="Surgery History"
                placeholder="If none, type N/A"
                rows={4}
              />
            </div>
          )}

          {/* Step 3: Social Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">
                Social Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="social_history.smoking"
                  component={TextSelect}
                  label="Do you smoke?"
                  placeholder="Select Option"
                  options={smokingOptions}
                />
                <Forger
                  name="social_history.alcohol"
                  component={TextSelect}
                  label="Do you drink alcohol?"
                  placeholder="Select Option"
                  options={alcoholOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="social_history.drug_use"
                  component={TextSelect}
                  label="Any history of illegal drug?"
                  placeholder="Select Option"
                  options={yesNoOptions}
                />
                <Forger
                  name="social_history.exercise"
                  component={TextSelect}
                  label="Do you exercise?"
                  placeholder="Select Option"
                  options={exerciseOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="social_history.diet"
                  component={TextSelect}
                  label="Are you on any special diet?"
                  placeholder="Select Option"
                  options={dietOptions}
                />
              </div>
            </div>
          )}

          {/* Step 4: Emergency Contact Details */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">
                Emergency Contact Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="emergency_contact.name"
                  component={TextInput}
                  label="Full Name"
                  placeholder="Full Name"
                />
                <Forger
                  name="emergency_contact.phone"
                  component={TextInput}
                  label="Phone Number"
                  placeholder="Phone Number"
                />
              </div>

              <Forger
                name="emergency_contact.address"
                component={TextInput}
                label="Address"
                placeholder="Address"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Back
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isPending ? "Creating..." : "Submit"}
              </Button>
            )}
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePatientDialog;
