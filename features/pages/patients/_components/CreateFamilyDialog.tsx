"use client";

import React, { useRef, useState } from "react";
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
import { useCreateFamily } from "@/features/services/patientService";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";

const schema = yup.object({
  family_name: yup.string().trim().required("Family name is required"),
});

export type CreateFamilyForm = yup.InferType<typeof schema>;

const CreateFamilyDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const formRef = useRef<FormPropsRef | null>(null);

  const { mutateAsync: createFamily, isPending } = useCreateFamily();

  const { control } = useForge<CreateFamilyForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      family_name: "",
    },
  });


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
