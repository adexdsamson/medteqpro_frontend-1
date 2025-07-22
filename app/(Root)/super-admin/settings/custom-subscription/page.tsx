"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Forge, Forger, useForge } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateCustomSubscription } from "@/features/services/subscriptionService";
import { useGetHospitalList, HospitalListType } from "@/features/services/hospitalService";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";
import Subheader from "../../../_components/Subheader";


// Validation schema
const schema = yup.object().shape({
  hospital_id: yup.string().required("Hospital is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
  expires_at: yup.string().required("Expiry date is required"),
});

type FormValues = yup.InferType<typeof schema>;

export default function CustomSubscription() {
  const toast = useToastHandler();
  const { data: hospitalsData } = useGetHospitalList();
  const { mutateAsync: createCustomSubscription, isPending: isCreatingSubscription } = useCreateCustomSubscription();
  
  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      hospital_id: "",
      amount: 0,
      expires_at: "",
    }
  });

  // Transform hospital data into options directly
  const hospitalOptions = hospitalsData?.data && Array.isArray(hospitalsData.data.data) 
    ? hospitalsData.data.data.map((hospital: HospitalListType) => ({
        value: hospital.id,
        label: hospital.name
      }))
    : [];

  const handleSubmit = async (values: FormValues) => {
    try {
      // Format the expiry date to ISO string
      const formattedExpiryDate = new Date(values.expires_at).toISOString();
      
      const payload = {
        hospital_id: values.hospital_id,
        amount: Number(values.amount),
        expires_at: formattedExpiryDate
      };

      const response = await createCustomSubscription(payload);
      
      if (response.status) {
        toast.success("Success", "Custom subscription created successfully!");
        // Reset form or redirect as needed
      }
    } catch (error) {
      const apiError = error as ApiResponseError;
      toast.error(
        "Error", 
        apiError.response?.data?.message || "Failed to create custom subscription"
      );
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Subheader title="Custom Subscription" />
      
      <Card className="mx-5">
        <CardHeader>
          <CardTitle>Create Custom Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <Forge control={control} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hospital Selection */}
              <div className="space-y-2">
                <Label htmlFor="hospital_id">Select Hospital *</Label>
                <Forger
                  name="hospital_id"
                  component={TextSelect}
                  placeholder="Choose a hospital"
                  options={hospitalOptions}
                  dependencies={[hospitalOptions]}
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Forger
                  name="amount"
                  component={TextInput}
                  type="number"
                  placeholder="Enter subscription amount"
                  min="1"
                  step="0.01"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiry Date *</Label>
                <Forger
                  name="expires_at"
                  component={TextInput}
                  type="datetime-local"
                  placeholder="Select expiry date"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                disabled={isCreatingSubscription}
                className="min-w-[120px]"
              >
                {isCreatingSubscription ? "Creating..." : "Create Subscription"}
              </Button>
            </div>
          </Forge>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="mx-5">
        <CardHeader>
          <CardTitle>Custom Subscription Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What is a Custom Subscription?</h4>
              <p>
                Custom subscriptions allow you to create tailored subscription plans for specific hospitals 
                with custom pricing and expiry dates that don&apos;t follow the standard subscription plans.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Flexible pricing for individual hospitals</li>
                <li>Custom expiry dates</li>
                <li>Immediate activation upon creation</li>
                <li>Full access to platform features</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Important Notes:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Custom subscriptions bypass the standard payment flow</li>
                <li>Expiry dates should be set according to your agreement with the hospital</li>
                <li>Amount should reflect the agreed pricing structure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}