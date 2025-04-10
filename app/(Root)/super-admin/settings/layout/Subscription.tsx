/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Forger, useForge } from "@/lib/forge";
import { TextSwitch } from "@/components/FormInputs/TextSwitch";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextInput } from "@/components/FormInputs/TextInput";


export default function Subscription() {
  return (
    <div className="space-y-6 pb-10">
      {/* Subscription Card */}
      <SubscriptionCard />

      {/* Reminder Card */}
      <ReminderCard />
    </div>
  );
}

const SubscriptionCard = () => {
  const { ForgeForm } = useForge({});

  const handleSubmit = (values: any) => {
    // Handle form submission
    console.log(values);
  };

  return (
    <Card className="border rounded-md max-w-3xl mx-auto">
      <CardContent className="">
        <div className="flex ">
          <div className="w-60">
            <h2 className="text-base font-semibold">Subscription</h2>
          </div>

          <ForgeForm onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-600 max-w-md">
              Please note by toggling the Apply button, you will set the
              subscription to active, then provide an amount to charge, and
              billing frequency.
            </p>

            <Forger
              name="subscription_apply"
              component={TextSwitch}
              label="Apply"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Forger
                name="billing_frequency"
                component={TextSelect}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "yearly", label: "Yearly" },
                ]}
                label="Billing Frequency"
              />

              <Forger
                name="subscription-amount"
                component={TextInput}
                label="Subscription Amount"
                placeholder="30,000"
              />
            </div>

            <Forger
              name="select-hospital"
              containerClass="w-fit min-w-48"
              component={TextSelect}
              options={[
                { value: "hospital1", label: "Hospital 1" },
                { value: "hospital2", label: "Hospital 2" },
                { value: "hospital3", label: "Hospital 3" },
              ]}
              label="Select Hospital"
            />

            <div>
              <Button type="submit" variant={"outline"}>
                Add Subscription
              </Button>
            </div>
          </ForgeForm>
        </div>
      </CardContent>
    </Card>
  );
};

const ReminderCard = () => {
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);
  const { ForgeForm } = useForge({});

  const handleSubmit = (values: any) => {
    // Handle form submission
    console.log(values);
  };

  return (
    <Card className="border rounded-md max-w-3xl mx-auto">
      <CardContent className="">
        <div className="flex">
          <div className="w-60">
            <h2 className="text-xl font-semibold">Reminder</h2>
          </div>

          <ForgeForm onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-600 max-w-md">
              Please note by toggling the Apply button, you will set the
              subscription reminder, then provide the reminder dates, and
              notification channel.
            </p>

            <Forger
              name="subscription_apply"
              component={TextSwitch}
              label="Apply"
            />

            <Forger
              name="billing_frequency"
              component={TextSelect}
              containerClass="w-fit min-w-48"
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "weekly", label: "Weekly" },
                { value: "daily", label: "Daily" },
              ]}
              label="Reminder Frequency"
            />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between w-fit space-x-6">
                <Label htmlFor="email-notification">Email Notification</Label>
                <Switch
                  id="email-notification"
                  checked={emailNotification}
                  onCheckedChange={setEmailNotification}
                />
              </div>

              <div className="flex items-center justify-between w-fit space-x-6">
                <Label htmlFor="sms-notification">SMS Notification</Label>
                <Switch
                  id="sms-notification"
                  checked={smsNotification}
                  onCheckedChange={setSmsNotification}
                />
              </div>
            </div>
          </ForgeForm>
        </div>
      </CardContent>
    </Card>
  );
};
