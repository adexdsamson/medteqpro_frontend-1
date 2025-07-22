/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
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

  const { control } = useForge({
    fields: [
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        placeholder: "John",
        component: TextInput,
        defaultValue: profile?.first_name || "",
      },
      {
        name: "middle_name",
        label: "Middle Name",
        type: "text",
        placeholder: "Middle",
        component: TextInput,
        defaultValue: profile?.middle_name || "",
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        placeholder: "Doe",
        component: TextInput,
        defaultValue: profile?.last_name || "",
      },
      {
        name: "phone_number",
        label: "Phone Number",
        type: "text",
        component: TextInput,
        defaultValue: profile?.phone_number || "",
      },
      {
        name: "specialization",
        label: "Specialization",
        type: "text",
        component: TextInput,
        defaultValue: profile?.specialization || "",
      },
    ],
  });

  const handleSubmit = async (values: UpdateProfilePayload) => {
    try {
      await updateProfile(values);
      toast.success("Success", "Profile updated successfully");
    } catch (error) {
      console.log(error);
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
              value="all"
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
                <Forge control={control} className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit} />
                <div className="flex justify-end mt-5">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardContent className="grid grid-cols-1 md:grid-cols-2">
                <Forge control={control} onSubmit={handleSubmit} />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
