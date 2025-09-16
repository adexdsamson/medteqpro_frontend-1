/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import Subheader from "../../_components/Subheader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InfoSection } from "./_components/InfoSection";
import { Forge, useForge } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProfile, useUpdateProfile, UpdateProfilePayload } from "@/features/services/profileService";
import { useToastHandler } from "@/hooks/useToaster";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const toast = useToastHandler();
  const { data: profileData, isLoading } = useGetProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const profile = profileData?.data.data;

  const { control, reset, watch } = useForge({
    defaultValues: {
      first_name: profile?.first_name || "",
      middle_name: profile?.middle_name || "",
      last_name: profile?.last_name || "",
      phone_number: profile?.phone_number || "",
      specialization: profile?.specialization || "",
    },
    fields: [
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        placeholder: "John",
        component: TextInput,
      },
      {
        name: "middle_name",
        label: "Middle Name",
        type: "text",
        placeholder: "Middle",
        component: TextInput,
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        placeholder: "Doe",
        component: TextInput,
      },
      {
        name: "phone_number",
        label: "Phone Number",
        type: "text",
        component: TextInput,
      },
      {
        name: "specialization",
        label: "Specialization",
        type: "text",
        component: TextInput,
      },
    ],
  });

  // Reset form values when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        middle_name: profile.middle_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        specialization: profile.specialization || "",
      });
    }
  }, [profile, reset]);

  const handleSubmit = async (values: UpdateProfilePayload) => {
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Form values received in handleSubmit:", values);
    console.log("Form values type:", typeof values);
    console.log("Form values keys:", Object.keys(values || {}));
    console.log("Form values stringified:", JSON.stringify(values, null, 2));
    
    // Check if values is empty or undefined
    if (!values || Object.keys(values).length === 0) {
      console.error("ERROR: Form values are empty or undefined!");
      toast.error("Error", "Form data is empty. Please fill in the fields.");
      return;
    }
    
    try {
      console.log("Sending payload to API:", values);
      const response = await updateProfile(values);
      console.log("API response:", response);
      toast.success("Success", "Profile updated successfully");
    } catch (error) {
      console.log("Error in handleSubmit:", error);
      const err = error as any;
      toast.error("Error", err?.message || "Failed to update profile");
    }
  };

  return (
    <>
      <Subheader title="Profile Settings" />

      <div className="px-6 mt-6 space-y-5">
        <Card>
          <CardContent className="flex gap-4">
            <div className="w-40 h-40">
              <Image
                width={160}
                height={160}
                src="https://avatar.iran.liara.run/public/27"
                className="h-full w-full object-cover"
                alt="profile"
              />
            </div>
            <div className="flex-1">
              {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-4 items-start py-4 w-full border-b border-solid border-b-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)] max-md:max-w-full">
                  <InfoSection
                    label="Full Name"
                    value={`${profile?.first_name || ""} ${profile?.middle_name || ""} ${profile?.last_name || ""}`.trim()}
                    className="border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                  />
                  <InfoSection
                    label="Email"
                    value={profile?.email || ""}
                    className="whitespace-nowrap border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                  />
                  <InfoSection label="Phone Number" value={profile?.phone_number || "N/A"} />
                </div>

                <div className="flex gap-4 items-start py-4 mt-2 w-full border-b border-solid border-b-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)] max-md:max-w-full">
                  <InfoSection
                    label="Role"
                    value={profile?.role || "N/A"}
                    className="border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                  />
                  <InfoSection
                    label="Specialization"
                    value={profile?.specialization || "N/A"}
                    className="w-full min-w-60 max-md:max-w-full"
                  />
                </div>
              </>
            )}
            </div>
            <div>
              <Button>Change Picture</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              value="personal"
              className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none"
            >
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none"
            >
              Security
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <Card>
              <CardContent>
                <Forge control={control} className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                  <div className="flex justify-end mt-5 col-span-full">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </Forge>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardContent>
                <Forge control={control} className="grid grid-cols-1 md:grid-cols-2" onSubmit={handleSubmit}>
                  <div className="flex justify-end col-span-full">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </Forge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}