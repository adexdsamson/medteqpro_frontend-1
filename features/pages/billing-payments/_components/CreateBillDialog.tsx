/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useWatch } from "react-hook-form";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { useCreateBill } from "@/features/services/billingService";
import { useGetDrugs, Drug } from "@/features/services/drugManagementService";
import { ApiResponseError } from "@/types";
import DrugQuantitySelector, { DrugQuantityItem } from "./DrugQuantitySelector";

/**
 * Yup schema defining validation for Create Bill form.
 */
const schema = yup.object({
  patient_id: yup.string().required("Patient is required"),
  purpose: yup.string().required("Purpose is required"),
  drugs: yup
    .array()
    .of(
      yup.object({
        drug_id: yup.string().required("Drug is required"),
        quantity: yup
          .number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
      })
    )
    .optional(),
  total_payable: yup
    .number()
    .typeError("Total payable must be a number")
    .required("Total payable is required"),
  min_deposit: yup
    .number()
    .typeError("Min. deposit must be a number")
    .min(0, "Min. deposit cannot be negative")
    .nullable()
    .optional(),
  amount_paid: yup
    .number()
    .typeError("Amount paid must be a number")
    .min(0, "Amount paid cannot be negative")
    .default(0),
  mode_of_payment: yup.string().nullable().optional(),
});

/**
 * Type for Create Bill form values
 */
export type CreateBillFormValues = yup.InferType<typeof schema>;

/**
 * CreateBillDialog renders a dialog with a Forge-powered form to create a new bill.
 * It fetches patients and drugs, validates with Yup, and submits via a mutation hook.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Optional trigger element; defaults to a primary button
 * @returns {JSX.Element}
 * @throws {Error} When form submission fails due to API error
 * @example
 * <CreateBillDialog>
 *   <Button>Create New Bill</Button>
 * </CreateBillDialog>
 */
export default function CreateBillDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<FormPropsRef | null>(null);

  // API hooks
  const { data: patientsData, isLoading: isPatientsLoading } =
    usePatientsForAppointment();
  const { data: drugsData, isLoading: isDrugsLoading } = useGetDrugs();
  const { mutateAsync: createBill, isPending: isCreatingBill } =
    useCreateBill();

  // Options for dropdowns
  const purposeOptions = [
    { label: "Treatment", value: "treatment" },
    { label: "Drugs", value: "drug" },
    { label: "Laboratory Test", value: "lab_test" },
  ];

  const patientOptions = patientsData || [];

  const drugOptions =
    drugsData?.data?.results?.map((drug: Drug) => ({
      value: drug.id,
      label: drug.drug_name,
      price: drug.drug_price,
    })) || [];

  const paymentOptions = [
    { label: "Cash", value: "cash" },
    { label: "Transfer", value: "transfer" },
  ];

  const toast = useToastHandler();

  const { control, reset } = useForge<CreateBillFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      drugs: [{ drug_id: "", quantity: 1 }] as DrugQuantityItem[],
    },
  });

  /**
   * Watch the selected purpose to conditionally render drug-related inputs.
   * @example
   * // purpose === 'drug' when Drugs is selected in the Purpose dropdown
   */
  const purpose = useWatch({ control, name: "purpose" });

  const onSubmit = async (data: CreateBillFormValues) => {
    try {
      // Transform form data to match API payload
      const payload = {
        patient_id: data.patient_id,
        purpose: data.purpose,
        total_amount: data.total_payable.toString(),
        min_deposit: data.min_deposit?.toString(),
        payment_method: data.mode_of_payment || undefined,
        drugs: data.drugs?.map((drugItem) => ({
          drug: drugItem.drug_id,
          quantity: drugItem.quantity,
        })),
      };

      await createBill(payload);
      toast.success("Success", "Bill created successfully");
      setOpen(false);
      reset();
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Create New Bill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new bill for the selected patient.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <Forge
            control={control}
            onSubmit={onSubmit}
            ref={formRef}
            className="space-y-4 py-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Forger
                name="patient_id"
                component={TextSelect}
                label="Patient"
                placeholder={
                  isPatientsLoading ? "Loading patients..." : "Select patient"
                }
                options={patientOptions}
              />
              <Forger
                name="purpose"
                component={TextSelect}
                label="Purpose"
                placeholder="Select purpose"
                options={purposeOptions}
              />
            </div>

            {/* Show drugs section only when purpose is 'drug' */}
            {purpose === "drug" && (
              <div className="space-y-4">
                <DrugQuantitySelector
                  control={control}
                  label="Drugs"
                  placeholder={
                    isDrugsLoading ? "Loading drugs..." : "Select drugs"
                  }
                  drugOptions={drugOptions}
                  isLoading={isDrugsLoading}
                />
              </div>
            )}

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
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-gray-600 text-white hover:bg-gray-700 border-gray-600"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => formRef.current?.onSubmit()}
                disabled={isCreatingBill}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isCreatingBill ? "Creating..." : "Create Bill"}
              </Button>
            </DialogFooter>
          </Forge>
        </div>
        <DialogClose className="hidden" />
      </DialogContent>
    </Dialog>
  );
}