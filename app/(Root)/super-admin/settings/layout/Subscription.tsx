/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Forge, Forger, useForge } from "@/lib/forge";
import { TextSwitch } from "@/components/FormInputs/TextSwitch";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextInput } from "@/components/FormInputs/TextInput";
import {
  useCreateSubscription,
  useGetSubscriptionPlans,
} from "@/features/services/subscriptionService";
import { useGetHospitalList } from "@/features/services/hospitalService";
import { useToastHandler } from "@/hooks/useToaster";
import { format } from "date-fns";

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
  const { control } = useForge({
    defaultValues: {
      subscription_apply: false,
      billing_frequency: "",
      subscription_amount: "",
      select_hospital: "",
    },
  });

  const toast = useToastHandler();
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetSubscriptionPlans();
  const { data: hospitalsData, isLoading: isLoadingHospitals } =
    useGetHospitalList();
  const { mutateAsync: createSubscription, isPending: isCreatingSubscription } =
    useCreateSubscription();

  const [planOptions, setPlanOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [hospitalOptions, setHospitalOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (plansData?.data) {
      // Check if data is an array directly
      if (Array.isArray(plansData.data)) {
        const options = plansData.data.map((plan) => ({
          value: plan.code,
          label: `${plan.name} - ${
            plan.interval_display
          } (₦${plan.amount.toLocaleString()})`,
        }));
        setPlanOptions(options);
      }
      // Check if data has a results property (paginated response)
      // Using type assertion to handle the case where results might exist
      else if (
        plansData.data &&
        typeof plansData.data === "object" &&
        "results" in (plansData.data as any)
      ) {
        const results = (plansData.data as any).results;
        if (Array.isArray(results)) {
          const options = results.map((plan) => ({
            value: plan.code,
            label: `${plan.name} - ${
              plan.interval_display
            } (₦${plan.amount.toLocaleString()})`,
          }));
          setPlanOptions(options);
        }
      } else {
        console.log("Subscription plans data structure:", plansData);
      }
    }
  }, [plansData]);

  useEffect(() => {
    if (hospitalsData?.data) {
      // Check if data is an array directly
      if (Array.isArray(hospitalsData.data?.data)) {
        const options = hospitalsData.data?.data.map((hospital) => ({
          value: hospital.id,
          label: hospital.name,
        }));
        setHospitalOptions(options);
      }
      // Check if data has a results property (paginated response)
      // Using type assertion to handle the case where results might exist
      else if (
        hospitalsData.data &&
        typeof hospitalsData.data === "object" &&
        "results" in (hospitalsData.data as any)
      ) {
        const results = (hospitalsData.data as any).results;
        if (Array.isArray(results)) {
          const options = results.map((hospital) => ({
            value: hospital.id,
            label: hospital.hospital_name,
          }));
          setHospitalOptions(options);
        }
      } else {
        console.log("Hospital data structure:", hospitalsData);
      }
    }
  }, [hospitalsData]);

  const handleSubmit = async (values: any) => {
    try {
      if (!values.subscription_apply) {
        toast.error(
          "Subscription Error",
          "Please enable subscription by toggling the Apply button"
        );
        return;
      }

      if (!values.billing_frequency || !values.select_hospital) {
        toast.error("Subscription Error", "Please fill all required fields");
        return;
      }

      const payload = {
        hospital_id: values.select_hospital,
        plan_code: values.billing_frequency,
        callback_url: `${window.location.origin}/super-admin/settings`,
      };

      const response = await createSubscription(payload);

      if (response.data.data.authorization_url) {
        toast.success(
          "Subscription Created",
          "Subscription has been created successfully"
        );
        // Optionally redirect to payment page
        // window.location.href = response.data.data.authorization_url;
      }
    } catch (error: any) {
      toast.error("Subscription Error", error);
    }
  };

  return (
    <Card className="border rounded-md max-w-3xl mx-auto">
      <CardContent className="">
        <div className="flex ">
          <div className="w-60">
            <h2 className="text-base font-semibold">Subscription</h2>
          </div>

          <Forge
            control={control}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                options={planOptions}
                label="Subscription Plan"
                loading={isLoadingPlans}
              />

              <Forger
                name="subscription_amount"
                component={TextInput}
                label="Subscription Amount"
                placeholder="30,000"
                disabled={true}
                hint="Amount is determined by the selected plan"
              />
            </div>

            <Forger
              name="select_hospital"
              containerClass="w-fit min-w-48"
              component={TextSelect}
              options={hospitalOptions}
              label="Select Hospital"
              loading={isLoadingHospitals}
            />

            <div>
              <Button
                type="submit"
                variant={"outline"}
                disabled={isCreatingSubscription}
              >
                {isCreatingSubscription ? "Processing..." : "Add Subscription"}
              </Button>
            </div>
          </Forge>
        </div>
      </CardContent>
    </Card>
  );
};

const ReminderCard = () => {
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);
  const toast = useToastHandler();
  const { control } = useForge({
    defaultValues: {
      subscription_apply: false,
      billing_frequency: "",
    },
  });

  const handleSubmit = (values: any) => {
    try {
      if (!values.subscription_apply) {
        toast.error(
          "Reminder Error",
          "Please enable reminders by toggling the Apply button"
        );
        return;
      }

      if (!values.billing_frequency) {
        toast.error("Reminder Error", "Please select a reminder frequency");
        return;
      }

      const reminderData = {
        ...values,
        email_notification: emailNotification,
        sms_notification: smsNotification,
        created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      };

      // This would be replaced with an actual API call
      console.log(reminderData);
      toast.success(
        "Reminder Settings",
        "Reminder settings have been saved successfully"
      );
    } catch (error: any) {
      toast.error("Reminder Error", error);
    }
  };

  return (
    <Card className="border rounded-md max-w-3xl mx-auto">
      <CardContent className="">
        <div className="flex">
          <div className="w-60">
            <h2 className="text-xl font-semibold">Reminder</h2>
          </div>

          <Forge
            control={control}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
          </Forge>
        </div>
      </CardContent>
    </Card>
  );
};
