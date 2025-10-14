/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import Subheader from "@/layouts/Subheader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InfoSection } from "./_components/InfoSection";
import { ChangePasswordForm } from "./_components/ChangePasswordForm";
import { Forge, useForge, FormPropsRef } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetProfile,
  useUpdateProfile,
  UpdateProfilePayload,
  useUpdateProfilePicture,
} from "@/features/services/profileService";
import { useToastHandler } from "@/hooks/useToaster";

export default function Profile() {
  const toast = useToastHandler();
  const formRef = React.useRef<FormPropsRef>(null);

  const { data: profileData, isLoading, isSuccess } = useGetProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const { mutateAsync: updateProfilePicture, isPending: isUploadingPicture } =
    useUpdateProfilePicture();

  const profile = profileData?.data.data;

  /**
   * Handle profile form submission
   * @param values - Profile update payload
   */
  const handleSubmit = async (values: UpdateProfilePayload) => {
    try {
      // console.log(values);
      await updateProfile(values);
      toast.success("Success", "Profile updated successfully");
    } catch (error) {
      // console.log(error);
      const err = error as any;
      toast.error("Error", err?.message || "Failed to update profile");
    }
  };

  /**
   * Handle profile picture change
   * @param event - File input change event
   */
  const handlePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Error",
        "Please select a valid image file (JPEG, PNG, or GIF)"
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("Error", "File size must be less than 5MB");
      return;
    }

    try {
      await updateProfilePicture(file);
      toast.success("Success", "Profile picture updated successfully");
    } catch (error) {
      console.log(error);
      const err = error as any;
      toast.error("Error", err?.message || "Failed to update profile picture");
    }
  };

  /**
   * Trigger file input click
   */
  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      "profile-picture-input"
    ) as HTMLInputElement;
    fileInput?.click();
  };

  const { control, reset } = useForge({
    // defaultValues: {
    //   first_name: profile?.first_name || "",
    //   middle_name: profile?.middle_name || "",
    //   last_name: profile?.last_name || "",
    //   phone_number: profile?.phone_number || "",
    //   specialization: profile?.specialization || "",
    // },
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

  // Ensure the form is initialized only once when profile data becomes available
  const hasInitialized = React.useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    if (isSuccess && typeof profile === "object" && profile !== null) {
      reset({
        first_name: profile?.first_name || "",
        middle_name: profile?.middle_name || "",
        last_name: profile?.last_name || "",
        phone_number: profile?.phone_number || "",
        specialization: profile?.specialization || "",
      });
      hasInitialized.current = true;
    }
  }, [isSuccess, profile, reset]);

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
                src={profile?.avatar || "https://avatar.iran.liara.run/public/27"}
                className="h-full w-full object-cover rounded-lg"
                alt="profile"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://avatar.iran.liara.run/public/27";
                }}
              />
            </div>
            <div className="flex-1">
              {isLoading || !profile ? (
                <div className="space-y-4">
                  <div className="h-16 w-full bg-gray-200 animate-pulse rounded-md" />
                  <div className="h-16 w-full bg-gray-200 animate-pulse rounded-md" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-4 items-start py-4 w-full border-b border-solid border-b-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)] max-md:max-w-full">
                    <InfoSection
                      label="Full Name"
                      value={`${profile?.first_name || ""} ${
                        profile?.middle_name || ""
                      } ${profile?.last_name || ""}`.trim()}
                      className="border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                    />
                    <InfoSection
                      label="Email"
                      value={profile?.email || ""}
                      className="whitespace-nowrap border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                    />
                    <InfoSection
                      label="Phone Number"
                      value={profile?.phone_number || "N/A"}
                    />
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
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                style={{ display: "none" }}
              />
              <Button onClick={triggerFileInput} disabled={isUploadingPicture}>
                {isUploadingPicture ? "Uploading..." : "Change Picture"}
              </Button>
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
                <Forge
                  control={control}
                  ref={formRef}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  onSubmit={handleSubmit}
                  debug
                />
                <div className="flex justify-end mt-5">
                  <Button onClick={() => formRef.current?.onSubmit()} disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardContent className="p-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
