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
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { useAddDrug, AddDrugPayload } from "@/features/services/drugManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type AddSupplyDialogProps = {
  children?: React.ReactNode;
};

const schema = yup.object().shape({
  drug_name: yup.string().required("Drug name is required"),
  drug_type: yup.string().required("Drug type is required"),
  drug_category: yup.string().required("Drug category is required"),
  drug_expiry_date: yup.string().required("Expiry date is required"),
  drug_price: yup.number()
    .min(0, "Price must be at least 0")
    .required("Price is required"),
  quantity_in_stock: yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
});

export type AddSupplyFormData = yup.InferType<typeof schema>;

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

export default function AddSupplyDialog({ children }: AddSupplyDialogProps) {
  const [open, setOpen] = React.useState(false);
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const { mutateAsync: addDrug, isPending } = useAddDrug();

  const { control, reset } = useForge<AddSupplyFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      drug_name: "",
      drug_type: "",
      drug_category: "",
      drug_expiry_date: "",
      drug_price: 0,
      quantity_in_stock: 0,
    },
  });

  const handleSubmit = async (data: AddSupplyFormData) => {
    try {
      const payload: AddDrugPayload = {
        ...data,
      };
      
      await addDrug(payload);
      
      toast.success("Success", "Drug added to inventory successfully");
      
      // Invalidate and refetch drugs data to update the UI
      queryClient.invalidateQueries({ queryKey: ["drugs"] });
      
      // Reset form and close dialog
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding drug:", error);
      const err = error as { message?: string };
      toast.error("Error", err?.message ?? "Failed to add drug to inventory");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Add Supply
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Drug Supply</DialogTitle>
          <DialogDescription>
            Add a new drug to your pharmacy inventory. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="drug_name"
                component={TextInput}
                label="Drug Name"
                placeholder="Enter drug name"
              />
              <Forger
                name="drug_type"
                component={TextSelect}
                label="Drug Type"
                placeholder="Select drug type"
                options={drugTypeOptions}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="drug_category"
                component={TextSelect}
                label="Drug Category"
                placeholder="Select drug category"
                options={drugCategoryOptions}
              />
              <Forger
                name="drug_expiry_date"
                component={TextDateInput}
                label="Expiry Date"
                placeholder="Select expiry date"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="drug_price"
                component={TextInput}
                label="Price (₦)"
                placeholder="Enter price"
                type="number"
                min="0"
                step="0.01"
              />
              <Forger
                name="quantity_in_stock"
                component={TextInput}
                label="Quantity in Stock"
                placeholder="Enter quantity"
                type="number"
                min="1"
              />
            </div>
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
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add Drug"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}