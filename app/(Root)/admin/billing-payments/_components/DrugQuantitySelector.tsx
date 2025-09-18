"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextInput } from "@/components/FormInputs/TextInput";
import { X, Plus } from "lucide-react";
import { ForgeControl, Forger, useFieldArray } from "@/lib/forge";
import { CreateBillFormValues } from "./CreateBillDialog";

export interface DrugQuantityItem {
  drug_id: string;
  quantity: number;
}

interface DrugQuantitySelectorProps {
  value?: DrugQuantityItem[];
  onChange?: (value: DrugQuantityItem[]) => void;
  drugOptions: Array<{ value: string; label: string; price?: number }>;
  isLoading?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  control: ForgeControl<CreateBillFormValues>;
}

export default function DrugQuantitySelector({
  drugOptions,
  isLoading = false,
  label = "Drugs",
  error,
  control,
}: DrugQuantitySelectorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "drugs",
    inputProps: [],
  });

  const handleAddItem = () => {
    append({ drug_id: "", quantity: 1 });
  };

  const handleRemoveItem = (index: number) => {
    console.log({ index });
    
    remove(index);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          Add Drug
        </Button>
      </div>

      {drugOptions.length === 0 && (
        <div className="text-sm text-gray-500 py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
          {isLoading
            ? "Loading drugs..."
            : "No drugs selected. Click 'Add Drug' to start."}
        </div>
      )}

      <div className="space-y-3 ">
        {fields.map((_, index) => (
          <div
            key={_.id}
            className="flex items-end gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex-1">
              <Forger
                component={TextSelect}
                name={`drugs.${index}.drug_id`}
                options={drugOptions}
                placeholder={isLoading ? "Loading drugs..." : "Select drug"}
                label="Drug"
                disabled={isLoading}
              />
            </div>
            <div className="w-24">
              <Forger
                type="number"
                name={`drugs.${index}.quantity`}
                component={TextInput}
                placeholder="Qty"
                label="Quantity"
                min="1"
              />
            </div>
            {index !== 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 border-red-600 hover:bg-red-50 mb-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
