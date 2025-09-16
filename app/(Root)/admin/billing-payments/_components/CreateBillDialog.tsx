"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Forge, Forger, useForge, FormPropsRef } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { useToastHandler } from "@/hooks/useToaster";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePatientsForAppointment } from "@/features/services/patientService";

const schema = yup.object({
  patient_id: yup.string().required("Patient is required"),
  purpose: yup.string().required("Purpose is required"),
  total_payable: yup
    .number()
    .typeError("Total payable must be a number")
    .required("Total payable is required"),
  min_deposit: yup
    .number()
    .typeError("Min. deposit must be a number")
    .min(0, "Min. deposit cannot be negative")
    .optional(),
  amount_paid: yup
    .number()
    .typeError("Amount paid must be a number")
    .min(0, "Amount paid cannot be negative")
    .default(0),
  mode_of_payment: yup.string().optional(),
});

export type CreateBillFormData = yup.InferType<typeof schema>;

type CreateBillDialogProps = {
  children?: React.ReactNode;
};

const paymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "POS", value: "pos" },
  { label: "PAYSTACK", value: "paystack" },
  { label: "Transfer", value: "transfer" },
  { label: "N/A", value: "na" },
];

export default function CreateBillDialog({ children }: CreateBillDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<FormPropsRef | null>(null);
  const toast = useToastHandler();

  const { data: patientOptions, isLoading: loadingPatients } = usePatientsForAppointment();

  const { control, reset } = useForge<CreateBillFormData>({
    resolve: yupResolver(schema),
    defaultValues: {
      patient_id: "",
      purpose: "",
      total_payable: undefined as unknown as number,
      min_deposit: undefined,
      amount_paid: 0,
      mode_of_payment: "",
    },
  });

  const onSubmit = async () => {
    // API schema not yet defined for billing creation - keep UI only
    try {
      // Close dialog and reset after optimistic success
      toast.success("Success", "Bill created successfully (UI only)");
      setOpen(false);
      reset();
    } catch (error) {
      toast.error("Error", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create New Bill</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new bill for the selected patient.
          </DialogDescription>
        </DialogHeader>

        <Forge control={control} onSubmit={onSubmit} ref={formRef} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Forger
              name="patient_id"
              component={TextSelect}
              label="Patient"
              placeholder={loadingPatients ? "Loading patients..." : "Select patient"}
              options={patientOptions ?? []}
            />
            <Forger
              name="purpose"
              component={TextInput}
              label="Purpose"
              placeholder="e.g. Treatment"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Forger
              name="total_payable"
              component={TextInput}
              type="number"
              label="Total Payable"
              placeholder="e.g. 500000"
            />
            <Forger
              name="min_deposit"
              component={TextInput}
              type="number"
              label="Min. Deposit"
              placeholder="e.g. 200000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Forger
              name="amount_paid"
              component={TextInput}
              type="number"
              label="Amount Paid (optional)"
              placeholder="e.g. 0"
            />
            <Forger
              name="mode_of_payment"
              component={TextSelect}
              label="Mode of Payment"
              placeholder="Select payment mode"
              options={paymentOptions}
            />
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1 bg-gray-600 text-white hover:bg-gray-700 border-gray-600">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => formRef.current?.onSubmit()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Bill
            </Button>
          </DialogFooter>
        </Forge>
        <DialogClose className="hidden" />
      </DialogContent>
    </Dialog>
  );
}