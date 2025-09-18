"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForge, Forge, Forger, FormPropsRef } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import {
  usePatientsForAppointment,
  useCreateFamily,
} from "@/features/services/patientService";
import { useToastHandler } from "@/hooks/useToaster";
import { useFieldArray } from "@/lib/forge/useFieldArray";
import { Trash2, Plus } from "lucide-react";
import { ApiResponseError } from "@/types";

const schema = yup.object({
  family_name: yup.string().trim().required("Family name is required"),
  members: yup
    .array(
      yup.object({
        patient_id: yup.string().required("Select a patient"),
      })
    )
    .min(1, "Add at least one patient")
    .required(),
});

export type CreateFamilyForm = yup.InferType<typeof schema>;

const CreateFamilyDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const formRef = useRef<FormPropsRef | null>(null);

  const { data: patientsOptions = [], isLoading: loadingPatients } =
    usePatientsForAppointment();
  const { mutateAsync: createFamily, isPending } = useCreateFamily();

  const { control } = useForge<CreateFamilyForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      family_name: "",
      members: [{ patient_id: "" }],
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "members",
    inputProps: {},
  });

  const memberOptions = useMemo(() => patientsOptions, [patientsOptions]);

  const onSubmit = async (values: CreateFamilyForm) => {
    try {
      // API for creating a family only accepts family_name right now.
      await createFamily({ family_name: values.family_name });
      toast.success("Success", "Family created successfully");
      setOpen(false);
    } catch (error) {
      const err = error as ApiResponseError;
      const message = err?.message ?? "Failed to create family";
      toast.error("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Create Family
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Provide a family name, then add one or more patients as members. You
            can add or remove rows as needed.
          </p>

          <Forge {...{ control, onSubmit, ref: formRef }}>
            <div className="grid grid-cols-1 gap-4">
              <Forger
                name="family_name"
                component={TextInput}
                label="Family Name"
                placeholder="Enter family name"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-stone-900">Members</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ patient_id: "" })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add member
                </Button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id ?? index} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Forger
                        name={`members.${index}.patient_id` as const}
                        component={TextSelect}
                        label={`Patient ${index + 1}`}
                        placeholder={
                          loadingPatients ? "Loading..." : "Select patient"
                        }
                        options={memberOptions}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      title="Remove member"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => formRef.current?.onSubmit()}
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Family"}
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyDialog;