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
  date_of_birth: yup.date().required("Date of birth is required"),
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
  // Social History fields
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

// Type definition for the complete form data
type FullFormData = {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phone_number: string;
  marital_status: string;
  date_of_birth: Date;
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
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [medicationFields, setMedicationFields] = useState([{ medication: "", dosage: "", frequency: "" }]);
  const toast = useToastHandler();
  const { mutateAsync: createPatient, isPending } = useCreatePatient();

  const { control, reset, setValue } = useForge<FullFormData>({
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
      date_of_birth: new Date(),
      gender: "",
      height: 0,
      weight: 0,
      employment_status: "",
      emergency_contact: {
        name: "",
        phone: "",
        address: "",
      },
      current_medications: [{ medication: "", dosage: "", frequency: "" }],
      allergies: "",
      family_history: "",
      hereditary_conditions: "",
      surgical_history: "",
      blood_group: "",
      social_history: {
        smoking: "",
        alcohol: "",
        drug_use: "",
        exercise: "",
        diet: "",
      },
    },
  });

  // Watch current medications to sync with local state
  const watchedMedications = useWatch({
    control,
    name: "current_medications",
  });

  useEffect(() => {
    if (watchedMedications && watchedMedications.length > 0) {
      setMedicationFields(watchedMedications);
    }
  }, [watchedMedications]);

  const addMedicationField = () => {
    const newFields = [...medicationFields, { medication: "", dosage: "", frequency: "" }];
    setMedicationFields(newFields);
    setValue("current_medications", newFields);
  };

  const removeMedicationField = (index: number) => {
    if (medicationFields.length > 1) {
      const newFields = medicationFields.filter((_, i) => i !== index);
      setMedicationFields(newFields);
      setValue("current_medications", newFields);
    }
  };

  const updateMedicationField = (index: number, field: string, value: string) => {
    const newFields = [...medicationFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setMedicationFields(newFields);
    setValue("current_medications", newFields);
  };

  const onSubmit = async (data: FullFormData) => {
    try {
      // Format the data according to the API contract
      const formattedData = {
        ...data,
        date_of_birth: format(data.date_of_birth, "yyyy-MM-dd"),
        current_medications: data.current_medications.filter(
          (med) => med.medication && med.dosage && med.frequency
        ),
      };

      await createPatient(formattedData);
      toast.success("Success", "Patient created successfully");
      setOpen(false);
      setCurrentStep(1);
      reset();
      setMedicationFields([{ medication: "", dosage: "", frequency: "" }]);
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Error", "Failed to create patient. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(1);
    reset();
    setMedicationFields([{ medication: "", dosage: "", frequency: "" }]);
  };

  // Options for dropdowns
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];

  const employmentStatusOptions = [
    { value: "employed", label: "Employed" },
    { value: "unemployed", label: "Unemployed" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
  ];

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const frequencyOptions = [
    { value: "once_daily", label: "Once Daily" },
    { value: "twice_daily", label: "Twice Daily" },
    { value: "three_times_daily", label: "Three Times Daily" },
    { value: "four_times_daily", label: "Four Times Daily" },
    { value: "as_needed", label: "As Needed" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const smokingOptions = [
    { value: "never", label: "Never" },
    { value: "former", label: "Former" },
    { value: "current", label: "Current" },
  ];

  const alcoholOptions = [
    { value: "never", label: "Never" },
    { value: "occasional", label: "Occasional" },
    { value: "moderate", label: "Moderate" },
    { value: "heavy", label: "Heavy" },
  ];

  const exerciseOptions = [
    { value: "sedentary", label: "Sedentary" },
    { value: "light", label: "Light" },
    { value: "moderate", label: "Moderate" },
    { value: "vigorous", label: "Vigorous" },
  ];

  const dietOptions = [
    { value: "balanced", label: "Balanced" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "keto", label: "Keto" },
    { value: "other", label: "Other" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="first_name"
                component={TextInput}
                label="First Name"
                placeholder="Enter first name"
              />
              <Forger
                name="last_name"
                component={TextInput}
                label="Last Name"
                placeholder="Enter last name"
              />
            </div>
            <Forger
              name="email"
              component={TextInput}
              label="Email"
              placeholder="Enter email address"
              type="email"
            />
            <Forger
              name="phone_number"
              component={TextInput}
              label="Phone Number"
              placeholder="Enter phone number"
            />
            <Forger
              name="address"
              component={TextInput}
              label="Address"
              placeholder="Enter address"
            />
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="city"
                component={TextInput}
                label="City"
                placeholder="Enter city"
              />
              <Forger
                name="state"
                component={TextInput}
                label="State"
                placeholder="Enter state"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="gender"
                component={TextSelect}
                label="Gender"
                placeholder="Select gender"
                options={genderOptions}
              />
              <Forger
                name="marital_status"
                component={TextSelect}
                label="Marital Status"
                placeholder="Select marital status"
                options={maritalStatusOptions}
              />
            </div>
            <Forger
              name="date_of_birth"
              component={TextDateInput}
              label="Date of Birth"
              placeholder="Select date of birth"
            />
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="height"
                component={TextInput}
                label="Height (cm)"
                placeholder="Enter height in cm"
                type="number"
              />
              <Forger
                name="weight"
                component={TextInput}
                label="Weight (kg)"
                placeholder="Enter weight in kg"
                type="number"
              />
            </div>
            <Forger
              name="employment_status"
              component={TextSelect}
              label="Employment Status"
              placeholder="Select employment status"
              options={employmentStatusOptions}
            />
            
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Emergency Contact</h4>
              <Forger
                name="emergency_contact.name"
                component={TextInput}
                label="Emergency Contact Name"
                placeholder="Enter emergency contact name"
              />
              <Forger
                name="emergency_contact.phone"
                component={TextInput}
                label="Emergency Contact Phone"
                placeholder="Enter emergency contact phone"
              />
              <Forger
                name="emergency_contact.address"
                component={TextInput}
                label="Emergency Contact Address"
                placeholder="Enter emergency contact address"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
            
            <Forger
              name="blood_group"
              component={TextSelect}
              label="Blood Group"
              placeholder="Select blood group"
              options={bloodGroupOptions}
            />
            
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Current Medications</h4>
              {medicationFields.map((medication, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Medication {index + 1}</span>
                    {medicationFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMedicationField(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <TextInput
                      label="Medication"
                      placeholder="Enter medication name"
                      value={medication.medication}
                      onChange={(e) => updateMedicationField(index, "medication", e.target.value)}
                    />
                    <TextInput
                      label="Dosage"
                      placeholder="Enter dosage"
                      value={medication.dosage}
                      onChange={(e) => updateMedicationField(index, "dosage", e.target.value)}
                    />
                    <TextSelect
                      label="Frequency"
                      placeholder="Select frequency"
                      value={medication.frequency}
                      onChange={(value) => updateMedicationField(index, "frequency", value)}
                      options={frequencyOptions}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addMedicationField}
                className="w-full"
              >
                Add Another Medication
              </Button>
            </div>
            
            <Forger
              name="allergies"
              component={TextArea}
              label="Allergies"
              placeholder="Enter any known allergies"
            />
            
            <Forger
              name="family_history"
              component={TextArea}
              label="Family History"
              placeholder="Enter family medical history"
            />
            
            <Forger
              name="hereditary_conditions"
              component={TextArea}
              label="Hereditary Conditions"
              placeholder="Enter any hereditary conditions"
            />
            
            <Forger
              name="surgical_history"
              component={TextArea}
              label="Surgical History"
              placeholder="Enter surgical history"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Social History</h3>
            
            <Forger
              name="social_history.smoking"
              component={TextSelect}
              label="Smoking Status"
              placeholder="Select smoking status"
              options={smokingOptions}
            />
            
            <Forger
              name="social_history.alcohol"
              component={TextSelect}
              label="Alcohol Consumption"
              placeholder="Select alcohol consumption"
              options={alcoholOptions}
            />
            
            <Forger
              name="social_history.drug_use"
              component={TextSelect}
              label="Drug Use"
              placeholder="Select drug use status"
              options={yesNoOptions}
            />
            
            <Forger
              name="social_history.exercise"
              component={TextSelect}
              label="Exercise Level"
              placeholder="Select exercise level"
              options={exerciseOptions}
            />
            
            <Forger
              name="social_history.diet"
              component={TextSelect}
              label="Diet Type"
              placeholder="Select diet type"
              options={dietOptions}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient - Step {currentStep} of 3</DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={onSubmit}>
          {renderStepContent()}
          
          <div className="flex justify-between pt-6">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Patient"}
                </Button>
              )}
            </div>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePatientDialog;