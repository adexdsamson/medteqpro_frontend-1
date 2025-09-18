/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import {
  useAddVitalSigns,
  usePatientVitalSigns,
  VitalSignsPayload,
} from "@/features/services/vitalSignsService";
import { DataTable } from "@/components/DataTable";
import { columns } from "./vital-signs-columns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Forge, Forger, useForge } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToastHandler } from "@/hooks/useToaster";

export default function VitalSignsSection() {
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: vitalSigns, isLoading } = usePatientVitalSigns(patientId);
  const [open, setOpen] = useState(false);

  const toast = useToastHandler();
  const { mutateAsync: addVitalSigns, isPending } = useAddVitalSigns();

  // Validation schema aligned with API contract
  const schema = yup.object({
    body_temperature: yup
      .number()
      .typeError("Body temperature is required")
      .required("Body temperature is required"),
    pulse_rate: yup
      .number()
      .typeError("Pulse rate is required")
      .required("Pulse rate is required"),
    systolic_blood_pressure: yup
      .number()
      .typeError("Systolic BP is required")
      .required("Systolic BP is required"),
    diastolic_blood_pressure: yup
      .number()
      .typeError("Diastolic BP is required")
      .required("Diastolic BP is required"),
    oxygen_saturation: yup
      .number()
      .typeError("Oxygen saturation is required")
      .required("Oxygen saturation is required"),
    respiration_rate: yup
      .number()
      .typeError("Respiration rate must be a number")
      .optional(),
    weight: yup.number().typeError("Weight must be a number").optional(),
  });

  type FormValues = yup.InferType<typeof schema>;

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
  });

  /**
   * Handle form submission to create a new vital signs record.
   * @param values FormValues
   * @throws ApiResponseError When API request fails
   */
  const handleSubmit = async (values: FormValues) => {
    try {
      const payload: VitalSignsPayload = {
        body_temperature: Number(values.body_temperature),
        pulse_rate: Number(values.pulse_rate),
        systolic_blood_pressure: Number(values.systolic_blood_pressure),
        diastolic_blood_pressure: Number(values.diastolic_blood_pressure),
        oxygen_saturation: Number(values.oxygen_saturation),
        ...(values.respiration_rate !== undefined &&
        values.respiration_rate !== null
          ? { respiration_rate: Number(values.respiration_rate) }
          : {}),
        ...(values.weight !== undefined && values.weight !== null
          ? { weight: Number(values.weight) }
          : {}),
      };

      await addVitalSigns({ patientId, data: payload });
      toast.success("Success", "Vital signs added successfully");
      reset({
        body_temperature: undefined as unknown as number,
        pulse_rate: undefined as unknown as number,
        systolic_blood_pressure: undefined as unknown as number,
        diastolic_blood_pressure: undefined as unknown as number,
        oxygen_saturation: undefined as unknown as number,
        respiration_rate: undefined,
        weight: undefined,
      });
      setOpen(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Error", err?.message ?? "Failed to add vital signs");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add New Record</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Vital Signs</DialogTitle>
            </DialogHeader>

            <Forge {...{ control, onSubmit: handleSubmit }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Forger
                  name="body_temperature"
                  component={TextInput}
                  label="Body Temperature (°C)"
                  placeholder="e.g. 36.7"
                  type="number"
                />
                <Forger
                  name="pulse_rate"
                  component={TextInput}
                  label="Pulse Rate (bpm)"
                  placeholder="e.g. 72"
                  type="number"
                />
                <Forger
                  name="systolic_blood_pressure"
                  component={TextInput}
                  label="Systolic BP (mmHg)"
                  placeholder="e.g. 120"
                  type="number"
                />
                <Forger
                  name="diastolic_blood_pressure"
                  component={TextInput}
                  label="Diastolic BP (mmHg)"
                  placeholder="e.g. 80"
                  type="number"
                />
                <Forger
                  name="oxygen_saturation"
                  component={TextInput}
                  label="Oxygen Saturation (%)"
                  placeholder="e.g. 98"
                  type="number"
                />
                <Forger
                  name="respiration_rate"
                  component={TextInput}
                  label="Respiration Rate (breaths/min)"
                  placeholder="Optional"
                  type="number"
                />
                <Forger
                  name="weight"
                  component={TextInput}
                  label="Weight (kg)"
                  placeholder="Optional"
                  type="number"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Record"}
                </Button>
              </div>
            </Forge>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : vitalSigns && vitalSigns.length > 0 ? (
        <div className="w-full max-w-[76vw] bg-white p-2">
          <DataTable columns={columns} data={vitalSigns} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No vital signs data available</p>
          <p className="text-sm mt-2">
            Vital signs will be displayed here when available
          </p>
        </div>
      )}
    </div>
  );
}
