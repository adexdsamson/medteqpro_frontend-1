"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { Check } from "lucide-react";

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type StepProps = {
  onNext: () => void;
  onBack: () => void;
  onSubmit?: () => void;
};

const PersonalInformation = ({ onNext }: StepProps) => (
  <div className="space-y-6">
    <h3 className="text-gray-600">Personal Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* <div className="space-y-4"> */}
        <TextInput label="First Name" placeholder="First Name" />
        <TextInput label="Address" placeholder="Address" />
        <TextSelect
          name="state"
          label="State"
          placeholder="Select State"
          options={[
            { label: "Lagos", value: "lagos" },
            { label: "Abuja", value: "abuja" }
          ]}
          value=""
        />
        <TextSelect
          name="maritalStatus"
          label="Marital Status"
          placeholder="Select Marital Status"
          options={[
            { label: "Single", value: "single" },
            { label: "Married", value: "married" },
            { label: "Divorced", value: "divorced" },
            { label: "Widowed", value: "widowed" }
          ]}
          value=""
        />
        <TextInput label="Weight (KG)" type="number" placeholder="0" />
      {/* </div> */}

      {/* <div className="space-y-4"> */}
        <TextInput label="Last Name" placeholder="Last Name" />
        <TextInput label="City" placeholder="City" />
        <TextInput label="Phone Number" placeholder="Phone Number" />
        <TextInput
          label="Date of Birth"
          type="date"
          placeholder="DD-MM-YYYY"
        />
        <TextSelect
          name="gender"
          label="Gender"
          placeholder="Select Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" }
          ]}
          value=""
        />
        <TextInput label="Height (FT)" type="number" placeholder="0" />
        <TextSelect
          name="employmentType"
          label="Employment Type"
          placeholder="Select Employment Type"
          options={[
            { label: "Employed", value: "employed" },
            { label: "Self Employed", value: "self-employed" },
            { label: "Unemployed", value: "unemployed" },
            { label: "Student", value: "student" }
          ]}
          value=""
        />
      {/* </div> */}

      <div className="col-span-2">
        <h3 className="text-lg font-medium mb-4">Emergency Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Full Name" placeholder="Full Name" />
          <TextInput label="Phone Number" placeholder="Phone Number" />
          <TextInput
            label="Address"
            placeholder="Address"
            className="col-span-2"
          />
        </div>
      </div>
    </div>

    <DialogFooter className="self-start items-start">
      <Button  onClick={onNext}  className="bg-black text-white">
        Back
      </Button>
      <Button  onClick={onNext}>
        Next
      </Button>
    </DialogFooter>
  </div>
);

const SocialInformation = ({ onBack, onNext }: StepProps) => (
  <div className="space-y-6">
    <h3 className="text-gray-600">Social Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextSelect
        name="smoke"
        label="Do you smoke?"
        placeholder="Select Option"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]}
        value=""
      />
      <TextSelect
        name="alcohol"
        label="Do you drink alcohol?"
        placeholder="Select Option"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]}
        value=""
      />
      <TextSelect
        name="illegalDrug"
        label="Any history of illegal drug?"
        placeholder="Select Option"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]}
        value=""
      />
      <TextSelect
        name="illegalDrug2"
        label="Any history of illegal drug?"
        placeholder="Select Option"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]}
        value=""
      />
      <TextSelect
        name="exercise"
        label="Do you exercise?"
        placeholder="Select Option"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]}
        value=""
      />
      <TextSelect
        name="specialDiet"
        label="Are you on any special diet?"
        placeholder="Select Option"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]}
        value=""
      />
    </div>

    <DialogFooter className="flex justify-between">
      <Button  onClick={onBack} className="bg-black text-white">
        Back
      </Button>
      <Button onClick={onNext}>
        Submit
      </Button>
    </DialogFooter>
  </div>
);

const MedicalInformation = ({ onBack, onNext }: StepProps) => (
  <div className="space-y-6">
    <h3 className="text-gray-600">Medical Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput label="Medication" placeholder="First Name" />
      <TextInput label="Dosage" placeholder="Last Name" />
      <TextInput label="Frequency" placeholder="Address" className="col-span-2" />
      <TextInput
        label="Any Allergies to Medication or Food (list reactions)?"
        placeholder="If none, type N/A"
        className="col-span-2"
      />
      <TextInput
        label="Family Medical History"
        placeholder="If none, type N/A"
        className="col-span-2"
      />
      <TextInput
        label="Hereditary Disease"
        placeholder="If none, type N/A"
      />
      <TextInput
        label="Surgery History"
        placeholder="If none, type N/A"
      />
    </div>

    <DialogFooter className="flex justify-between">
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button onClick={onNext}>
        Next
      </Button>
    </DialogFooter>
  </div>
);

const SuccessStep = ({ onNext }: StepProps) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-6">
    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
      <Check className="h-8 w-8 text-green-500" />
    </div>
    <h2 className="text-2xl font-semibold">Success!</h2>
    <p className="text-gray-600">The patient has been created successfully.</p>
    <Button onClick={onNext} className="mt-4">
      Ok
    </Button>
  </div>
);

export function NewPatientDialog({
  open,
  onOpenChange,
}: NewPatientDialogProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleClose = () => {
    setStep(0);
    onOpenChange(false);
  };

  const steps = [
    <PersonalInformation key="personal" onNext={handleNext} onBack={handleBack} />,
    <MedicalInformation key="medical" onNext={handleNext} onBack={handleBack} />,
    <SocialInformation key="social" onNext={handleNext} onBack={handleBack} />,
    <SuccessStep key="success" onNext={handleClose} onBack={handleBack} />,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[550px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Patient</DialogTitle>
        </DialogHeader>
        {steps[step]}
      </DialogContent>
    </Dialog>
  );
}
