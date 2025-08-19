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
import { useRequestDrug, RequestDrugPayload, useGetDrugs, DrugRequest, Drug } from "@/features/services/drugManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type RequestDrugDialogProps = {
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

export type RequestDrugFormData = yup.InferType<typeof schema>;

export default function RequestDrugDialog({ children }: RequestDrugDialogProps) {
  const [open, setOpen] = React.useState(false);
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const { mutateAsync: requestDrug, isPending } = useRequestDrug();
  
  // Fetch existing drugs to populate options
  const { data: drugsData } = useGetDrugs({ page_size: 1000 }); // Get all drugs for options
  const drugs = drugsData?.data || [];

  const { control, reset } = useForge<RequestDrugFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      drug_name_requested: "",
      drug_type_requested: "",
      drug_category_requested: "",
      quantity_requested: 1,
      reason_for_request: "",
    },
  });

  // Generate drug type options from existing drugs
  const drugTypeOptions = React.useMemo(() => {
    if (!drugs?.data || drugs.data.length === 0) {
      return [
        { label: "Tablet", value: "tablet" },
        { label: "Capsule", value: "capsule" },
        { label: "Syrup", value: "syrup" },
        { label: "Injection", value: "injection" },
        { label: "Cream", value: "cream" },
        { label: "Drops", value: "drops" },
      ];
    }
    
    const uniqueTypes = [...new Set(drugs.data.map((drug: Drug) => drug.drug_type))]
      .filter((type): type is string => Boolean(type))
      .sort();
    
    const options = uniqueTypes.map((type: string) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
      value: type
    }));
    
    return options;
  }, [drugs]);

  // Generate drug category options from existing drugs
  const drugCategoryOptions = React.useMemo(() => {
    if (!drugs?.data || drugs.data.length === 0) {
      return [
        { label: "Analgesic", value: "analgesic" },
        { label: "Antibiotic", value: "antibiotic" },
        { label: "Anti-inflammatory", value: "anti_inflammatory" },
        { label: "Cardiovascular", value: "cardiovascular" },
        { label: "Emergency", value: "emergency" },
      ];
    }
    
    const uniqueCategories = [...new Set(drugs.data.map((drug: Drug) => drug.drug_category))]
      .filter((category): category is string => Boolean(category))
      .sort();
    
    const options = uniqueCategories.map((category: string) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      value: category
    }));
    
    return options;
  }, [drugs]);
  
  // Generate drug name suggestions from existing drugs
  const drugNameOptions = React.useMemo(() => {
    if (!drugs?.data || drugs.data.length === 0) return [];
    
    return drugs.data.map((drug: Drug) => ({
      label: drug.drug_name,
      value: drug.drug_name
    })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
  }, [drugs]);

  const handleSubmit = async (data: RequestDrugFormData) => {
    try {
      const payload: RequestDrugPayload = {
        drug_name_requested: data.drug_name_requested,
        drug_type_requested: data.drug_type_requested,
        drug_category_requested: data.drug_category_requested,
        quantity_requested: data.quantity_requested,
        reason_for_request: data.reason_for_request,
      };

      // Optimistic update - add the new request to the cache immediately
      const tempId = `temp-${Date.now()}`;
      const optimisticRequest: DrugRequest = {
        id: tempId,
        hospital: "current-hospital", // This would come from user context
        drug_name_requested: data.drug_name_requested,
        drug_type_requested: data.drug_type_requested,
        drug_category_requested: data.drug_category_requested,
        quantity_requested: data.quantity_requested,
        status: "pending",
        requested_by: "current-user", // This would come from user context
        reason_for_request: data.reason_for_request,
        created_at: new Date().toISOString(),
      };

      // Add optimistic update to cache
       queryClient.setQueryData(["drug-requests"], (oldData: { data: DrugRequest[]; count: number } | undefined) => {
         if (!oldData) return oldData;
         return {
           ...oldData,
           data: [optimisticRequest, ...(oldData.data || [])],
           count: (oldData.count || 0) + 1,
         };
       });

      // Show immediate success feedback
      toast.success("Success", "Drug request submitted successfully");
      setOpen(false);
      reset();

      // Make the actual API call
      await requestDrug(payload);
      
      // Invalidate and refetch to get the real data
      queryClient.invalidateQueries({ queryKey: ["drug-requests"] });
      
    } catch (error) {
      console.error(error);
      
      // Remove optimistic update on error
       queryClient.setQueryData(["drug-requests"], (oldData: { data: DrugRequest[]; count: number } | undefined) => {
         if (!oldData) return oldData;
         return {
           ...oldData,
           data: (oldData.data || []).filter((item: DrugRequest) => !item.id.startsWith('temp-')),
           count: Math.max((oldData.count || 1) - 1, 0),
         };
       });
      
      toast.error("Error", "Failed to submit drug request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Request Drug
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Drug</DialogTitle>
          <DialogDescription>
            Submit a new drug or medical equipment request for your pharmacy.
          </DialogDescription>
        </DialogHeader>
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Forger
              name="drug_name_requested"
              component={drugNameOptions.length > 0 ? TextSelect : TextInput}
              label="Drug/Equipment Name"
              placeholder={drugNameOptions.length > 0 ? "Select or type drug name" : "Enter drug or equipment name"}
              options={drugNameOptions.length > 0 ? drugNameOptions : undefined}
              searchable={drugNameOptions.length > 0}
            />
            
            <Forger
              name="drug_type_requested"
              component={TextSelect}
              label="Drug Type"
              options={drugTypeOptions}
              placeholder="Select drug type"
            />
            
            <Forger
              name="drug_category_requested"
              component={TextSelect}
              label="Drug Category"
              options={drugCategoryOptions}
              placeholder="Select drug category"
            />
            
            <Forger
              name="quantity_requested"
              component={TextInput}
              label="Quantity Requested"
              type="number"
              min="1"
              placeholder="Enter quantity"
            />
            
            <Forger
              name="reason_for_request"
              component={TextArea}
              label="Reason for Request"
              placeholder="Explain why this drug/equipment is needed"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}