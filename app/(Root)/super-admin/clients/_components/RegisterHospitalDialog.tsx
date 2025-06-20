"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { useForge, Forge, Forger } from "@/lib/forge";
import { useQueryClient } from "@tanstack/react-query";
import { useOnboardHospital, HospitalType } from "@/features/services/hospitalService";
import { useToastHandler } from "@/hooks/useToaster";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWatch } from "react-hook-form";

// Form validation schema
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  hospital_name: yup.string().required("Hospital name is required"),
  no_of_doctors: yup.number().min(1, "Number of doctors must be at least 1").required("Number of doctors is required"),
  state: yup.string().required("State is required"),
  lga: yup.string().required("LGA is required"),
  address: yup.string().required("Address is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface RegisterHospitalDialogProps {
  children: React.ReactNode;
}

export default function RegisterHospitalDialog({ children }: RegisterHospitalDialogProps) {
  const [open, setOpen] = useState(false);
  const [statesData, setStatesData] = useState<Array<{state: string, alias: string, lgas: string[]}>>([]);
  // const [selectedState, setSelectedState] = useState<string>("");
  // const [lgaOptions, setLgaOptions] = useState<Array<{label: string, value: string}>>([]);
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  // Load states data from JSON file
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/nigeria-states-lgas.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    loadStatesData();
  }, []);

  // Update LGA options when state changes
  // useEffect(() => {
  //   if (selectedState) {
  //     const stateData = statesData.find(state => state.state === selectedState);
  //     if (stateData) {
  //       const options: Array<{label: string, value: string}> = [];
  //       stateData.lgas.forEach(lga => {
  //         options.push({label: lga, value: lga});
  //       });
  //       setLgaOptions(options);
  //     }
  //   } else {
  //     setLgaOptions([]);
  //   }
  // }, [selectedState, statesData]);

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      hospital_name: "",
      no_of_doctors: 0,
      state: "",
      lga: "",
      address: "",
    },
  });

  const { mutate: onboardHospital, isPending, isSuccess, isError, error } = useOnboardHospital();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["hospitalList"] });
      toast.success("Success", "Hospital registered successfully");
      setOpen(false);
      reset();
    }
    if (isError) {
      toast.error("Error", error?.message || "Failed to register hospital");
    }
  }, [isSuccess, isError, error, queryClient, reset, toast]);

  const handleSubmit = async (data: FormValues) => {
    try {
      const payload: HospitalType = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        hospital: {
          name: data.hospital_name,
          no_of_doctors: data.no_of_doctors.toString(),
          state: data.state,
          city: data.lga,
          address: data.address,
        },
      };
      onboardHospital(payload);
    } catch (error) {
      console.error("Error registering hospital:", error);
    }
  };

  // Watch for state changes to update LGA options
  const watchedState = useWatch({ control,  name: "state"});

  // Generate state options from loaded data
  const stateOptions = statesData.map(state => ({
    label: state.state,
    value: state.state
  }));

  const lgaOptions = statesData.find(state => state?.state === watchedState)?.lgas.map(lga => ({
    label: lga,
    value: lga
  }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium text-gray-900">
            Register New Hospital
          </DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="first_name"
              component={TextInput}
              label="First Name"
              placeholder="Enter First Name"
            />
            
            <Forger
              name="last_name"
              component={TextInput}
              label="Last Name"
              placeholder="Enter Last Name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="email"
              component={TextInput}
              label="Email Address"
              placeholder="Email Address"
              type="email"
            />
            
            <Forger
              name="hospital_name"
              component={TextInput}
              label="Name of Hospital"
              placeholder="Enter Hospital Name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="no_of_doctors"
              component={TextInput}
              label="Number of Doctors"
              placeholder="0"
              type="number"
            />
            
            <Forger
              name="state"
              component={TextSelect}
              label="State"
              placeholder="Select Option"
              options={stateOptions}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="lga"
              component={TextSelect}
              dependencies={[watchedState]}
              label="LGA"
              placeholder="Select Option"
              options={lgaOptions}
            />
            
            <Forger
              name="address"
              component={TextInput}
              label="Address"
              placeholder="Enter Address"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Register"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}