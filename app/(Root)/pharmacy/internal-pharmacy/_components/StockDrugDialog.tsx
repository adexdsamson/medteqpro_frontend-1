"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForge, Forge, FormPropsRef } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { useToastHandler } from "@/hooks/useToaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

interface StockDrugDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Validation schema based on API documentation
const schema = yup.object().shape({
  drug_name_requested: yup.string().required("Drug name is required"),
  drug_type_requested: yup.string().required("Drug type is required"),
  drug_category_requested: yup.string().required("Drug category is required"),
  quantity_requested: yup
    .number()
    .positive("Quantity must be positive")
    .integer("Quantity must be a whole number")
    .required("Quantity is required"),
  reason_for_request: yup.string().required("Reason for request is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface DrugRequestResponse {
  id: string;
  hospital: string;
  drug_name_requested: string;
  drug_type_requested: string;
  drug_category_requested: string;
  quantity_requested: number;
  quantity_approved: number | null;
  status: string;
  requested_by: string;
  approved_or_rejected_by: string | null;
  action_date: string | null;
  reason_for_request: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  quantity_in_stock_of_requested_drug: number;
}

const drugTypes = [
  { label: "Tablet", value: "tablet" },
  { label: "Capsule", value: "capsule" },
  { label: "Syrup", value: "syrup" },
  { label: "Injection", value: "injection" },
  { label: "Cream", value: "cream" },
  { label: "Ointment", value: "ointment" },
  { label: "Drops", value: "drops" },
  { label: "Inhaler", value: "inhaler" },
];

const drugCategories = [
  { label: "Analgesic", value: "analgesic" },
  { label: "Antibiotic", value: "antibiotic" },
  { label: "Antiviral", value: "antiviral" },
  { label: "Antifungal", value: "antifungal" },
  { label: "Anti-inflammatory", value: "anti-inflammatory" },
  { label: "Cardiovascular", value: "cardiovascular" },
  { label: "Respiratory", value: "respiratory" },
  { label: "Gastrointestinal", value: "gastrointestinal" },
  { label: "Neurological", value: "neurological" },
  { label: "Endocrine", value: "endocrine" },
  { label: "Dermatological", value: "dermatological" },
  { label: "Ophthalmological", value: "ophthalmological" },
  { label: "Other", value: "other" },
];

export default function StockDrugDialog({ children }: StockDrugDialogProps) {
  const formRef = useRef<FormPropsRef | null>(null);
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    fields: [
      {
        name: "drug_name_requested",
        component: TextInput,
        label: "Drug Name",
        placeholder: "Enter drug name",
      },
      {
        name: "drug_type_requested",
        component: TextSelect,
        label: "Drug Type",
        placeholder: "Select drug type",
        options: drugTypes,
      },
      {
        name: "drug_category_requested",
        component: TextSelect,
        label: "Drug Category",
        placeholder: "Select drug category",
        options: drugCategories,
      },
      {
        name: "quantity_requested",
        component: TextInput,
        label: "Quantity Requested",
        placeholder: "Enter quantity",
        type: "number",
      },
      {
        name: "reason_for_request",
        component: TextArea,
        label: "Reason for Request",
        placeholder: "Enter reason for requesting this drug",
      },
    ],
  });

  // API mutation for requesting drug stock
  const requestDrugStock = useMutation<
    ApiResponse<DrugRequestResponse>,
    ApiResponseError,
    FormValues
  >({
    mutationKey: ["request-drug-stock"],
    mutationFn: async (data) =>
      await postRequest<FormValues>({
        url: "drug-management/hospital/drug-requests/",
        payload: data,
      }),
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await requestDrugStock.mutateAsync(data);
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["drug-requests"] });
      queryClient.invalidateQueries({ queryKey: ["drugs"] });
      
      toast.success("Success", "Drug stock request submitted successfully");
    } catch (error) {
      console.error("Error requesting drug stock:", error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to submit drug stock request");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Drug Stock</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Forge 
            {...{ 
              control, 
              onSubmit: handleSubmit, 
              ref: formRef 
            }} 
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => formRef.current?.reset()}
            >
              Reset
            </Button> */}
            <Button
              type="button"
              onClick={() => formRef.current?.onSubmit()}
              disabled={requestDrugStock.isPending}
            >
              {requestDrugStock.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}