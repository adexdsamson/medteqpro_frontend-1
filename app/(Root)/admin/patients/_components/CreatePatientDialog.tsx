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
  // Personal Info fields
  first_name: yup.string().optional(),
  last_name: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  phone_number: yup.string().optional(),
  marital_status: yup.string().optional(),
  date_of_birth: yup.date().optional(),
  gender: yup.string().optional(),
  height: yup.number().optional().positive("Height must be positive"),
  weight: yup.number().optional().positive("Weight must be positive"),
  employment_status: yup.string().optional(),
  emergency_contact: yup.object().shape({
    name: yup.string().optional(),
    phone: yup.string().optional(),
    address: yup.string().optional(),
  }).optional(),
  // Medical Info fields
  current_medications: yup
    .array()
    .of(
      yup.object().shape({
        medication: yup.string().optional(),
        dosage: yup.string().optional(),
        frequency: yup.string().optional(),
      })
    )
    .optional(),
  allergies: yup.string().optional(),
  family_history: yup.string().optional(),
  hereditary_conditions: yup.string().optional(),
  surgical_history: yup.string().optional(),
  blood_group: yup.string().optional(),
  // Social Info fields
  social_history: yup
    .object()
    .shape({
      smoking: yup.string().optional(),
      alcohol: yup.string().optional(),
      drug_use: yup.string().optional(),
      exercise: yup.string().optional(),
      diet: yup.string().optional(),
    })
    .optional(),
});

// Define the form data type from the full schema
type FullFormData = yup.InferType<typeof fullSchema>;

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

  const { control, reset } = useForge<FullFormData, unknown>({
    resolver: yupResolver(fullSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address: "",
      city: "",
      state: "",
      phone_number: "",
      marital_status: "",
      date_of_birth: undefined,
      gender: "",
      blood_group: "",
      height: undefined,
      weight: undefined,
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
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
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
        date_of_birth: data?.date_of_birth ? format(data.date_of_birth, "yyyy-MM-dd") : "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        phone_number: data.phone_number || "",
        marital_status: data.marital_status || "",
        gender: data.gender || "",
        employment_status: data.employment_status || "",
        emergency_contact: {
          name: data.emergency_contact?.name || "",
          phone: data.emergency_contact?.phone || "",
          address: data.emergency_contact?.address || ""
        },
        current_medications: data.current_medications?.map(med => ({
          medication: med.medication || "",
          dosage: med.dosage || "",
          frequency: med.frequency || ""
        })) || [],
        social_history: {
          smoking: data.social_history?.smoking || "",
          alcohol: data.social_history?.alcohol || "",
          drug_use: data.social_history?.drug_use || "",
          exercise: data.social_history?.exercise || "",
          diet: data.social_history?.diet || ""
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

        <Forge control={control} onSubmit={onSubmit} debug>
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

              <h4 className="text-md font-medium text-gray-700 mt-6">
                Emergency Contact Details
              </h4>

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

            {step < 3 ? (
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
