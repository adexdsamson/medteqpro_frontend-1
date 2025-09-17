import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForge, Forge, Forger } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextArea } from "@/components/FormInputs/TextArea";
import { useRequestDrug, RequestDrugPayload } from "@/features/services/drugManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type RequestNewDrugDialogProps = {
  children?: React.ReactNode;
};

const schema = yup.object().shape({
  drug_name_requested: yup.string().required("Drug name is required"),
  drug_type_requested: yup.string().required("Drug type is required"),
  drug_category_requested: yup.string().required("Drug category is required"),
  quantity_requested: yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  reason_for_request: yup.string().required("Reason for request is required"),
});

export type RequestNewDrugFormData = yup.InferType<typeof schema>;

const drugTypeOptions = [
  { value: "tablet", label: "Tablet" },
  { value: "capsule", label: "Capsule" },
  { value: "syrup", label: "Syrup" },
  { value: "injection", label: "Injection" },
  { value: "cream", label: "Cream" },
  { value: "ointment", label: "Ointment" },
  { value: "drops", label: "Drops" },
  { value: "inhaler", label: "Inhaler" },
];

const drugCategoryOptions = [
  { value: "analgesic", label: "Analgesic" },
  { value: "antibiotic", label: "Antibiotic" },
  { value: "antiviral", label: "Antiviral" },
  { value: "antifungal", label: "Antifungal" },
  { value: "antihistamine", label: "Antihistamine" },
  { value: "antacid", label: "Antacid" },
  { value: "vitamin", label: "Vitamin" },
  { value: "supplement", label: "Supplement" },
  { value: "antiseptic", label: "Antiseptic" },
  { value: "cardiovascular", label: "Cardiovascular" },
  { value: "respiratory", label: "Respiratory" },
  { value: "gastrointestinal", label: "Gastrointestinal" },
];

export default function RequestNewDrugDialog({ children }: RequestNewDrugDialogProps) {
  const [open, setOpen] = React.useState(false);
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const { mutateAsync: requestDrug, isPending } = useRequestDrug();

  const { control, reset } = useForge<RequestNewDrugFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      drug_name_requested: "",
      drug_type_requested: "",
      drug_category_requested: "",
      quantity_requested: 0,
      reason_for_request: "",
    },
  });

  const handleSubmit = async (data: RequestNewDrugFormData) => {
    try {
      const payload: RequestDrugPayload = {
        ...data,
      };
      
      await requestDrug(payload);
      
      toast.success("Success", "Drug request submitted successfully");
      
      // Invalidate and refetch drug requests data
      queryClient.invalidateQueries({ queryKey: ["drug-requests"] });
      
      // Reset form and close dialog
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error requesting drug:", error);
      const err = error as { message?: string };
      toast.error("Error", err?.message ?? "Failed to submit drug request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Request New Drug
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request New Drug</DialogTitle>
          <DialogDescription>
            Submit a request for a new drug that is not currently available in your inventory.
          </DialogDescription>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="drug_name_requested"
                component={TextInput}
                label="Drug Name"
                placeholder="Enter drug name"
              />
              <Forger
                name="drug_type_requested"
                component={TextSelect}
                label="Drug Type"
                placeholder="Select drug type"
                options={drugTypeOptions}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="drug_category_requested"
                component={TextSelect}
                label="Drug Category"
                placeholder="Select drug category"
                options={drugCategoryOptions}
              />
              <Forger
                name="quantity_requested"
                component={TextInput}
                label="Quantity Requested"
                placeholder="Enter quantity"
                type="number"
                min="1"
              />
            </div>
            
            <Forger
              name="reason_for_request"
              component={TextArea}
              label="Reason for Request"
              placeholder="Explain why this drug is needed..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}