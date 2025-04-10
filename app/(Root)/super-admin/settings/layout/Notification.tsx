"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TextSwitch } from "@/components/FormInputs/TextSwitch";

type NotificationCategory = {
  title: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
};

export default function Notification() {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      title: "Subscription",
      channels: {
        push: false,
        email: false,
        sms: false,
      },
    },
    {
      title: "New Updates",
      channels: {
        push: false,
        email: false,
        sms: false,
      },
    },
    {
      title: "Reminders",
      channels: {
        push: false,
        email: false,
        sms: false,
      },
    },
  ]);

  const handleToggle = (
    categoryIndex: number,
    channel: keyof NotificationCategory["channels"]
  ) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].channels[channel] =
      !updatedCategories[categoryIndex].channels[channel];
    setCategories(updatedCategories);
  };

  return (
    <div className="space-y-4 pb-10 bg-white w-fit p-5 mx-auto">
      <p className="text-xs text-gray-600 max-w-2xl mx-auto">
        Please note by toggling the Apply button, you will set the subscription
        to active, then provide an amount to charge, and billing frequency.
      </p>

      {categories.map((category, categoryIndex) => (
        <Card
          key={category.title}
          className="border rounded-md max-w-3xl mx-auto"
        >
          <CardContent className="">
            <div className="flex flex-col md:flex-row justify-between w-full">
              <div className="w-full md:w-60 mb-4 md:mb-0">
                <h2 className="text-base font-semibold">{category.title}</h2>
              </div>

              <div className="space-y-4 w-fit">
                {Object.entries(category.channels).map(
                  ([channel, isEnabled]) => (
                    <TextSwitch
                      key={channel}
                      label={channel}
                      checked={isEnabled}
                      onCheckedChange={() =>
                        handleToggle(
                          categoryIndex,
                          channel as keyof NotificationCategory["channels"]
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
