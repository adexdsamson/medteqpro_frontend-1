/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Subheader from "../../_components/Subheader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InfoSection } from "./_components/InfoSection";
import { Forge, useForge } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { control } = useForge({
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "John",
        component: TextInput,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Doe",
        component: TextInput,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        component: TextInput,
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "text",
        component: TextInput,
      },
    ],
  });

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <Subheader title="Profile Settings" />

      <div className="px-6 mt-6 space-y-5">
        <Card>
          <CardContent className="flex">
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
              <div className="flex flex-wrap gap-4 items-start py-4 w-full border-b border-solid border-b-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)] max-md:max-w-full">
                <InfoSection
                  label="Full Name"
                  value={"Ayo Adebisi"}
                  className="border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                />
                <InfoSection
                  label="Email"
                  value={"ayoadebisi@gmail.com"}
                  className="whitespace-nowrap border-r border-solid border-r-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)]"
                />
                <InfoSection label="Phone Number" value={"08144499094"} />
              </div>

              <div className="flex gap-4 items-start py-4 mt-2 w-full border-b border-solid border-b-[color:var(--Neutral\_black\_color-Blue-B50,#E7E8E9)] max-md:max-w-full">
                <InfoSection
                  label="Patient ID"
                  value={"Patient - 1445"}
                  className="w-full min-w-60 max-md:max-w-full"
                />
              </div>
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2">
                <Forge control={control} onSubmit={handleSubmit} />
                <div className="flex justify-end">
                  {/* <Button>Update</Button> */}
                  <Button>Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardContent className="grid grid-cols-1 md:grid-cols-2">
                <Forge control={control} onSubmit={handleSubmit} />
                <div className="flex justify-end">
                  {/* <Button>Update</Button> */}
                  <Button>Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
