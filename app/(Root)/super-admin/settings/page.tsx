"use client";

import React, { useState } from "react";
import Subheader from "../../_components/Subheader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Plan from "./layout/Plan";
import Subscription from "./layout/Subscription";
import Notification from "./layout/Notification";
import Integration from "./layout/Integration";
import Security from "./layout/Security";

export default function Settings() {
  const [tab, setTab] = useState('plan')
  const tabs = [
    {
      value: "plan",
      label: "Plan",
      renderComponent: <Plan />,
    },
    {
      value: 'subscription',
      label: 'Subscription',
      renderComponent: <Subscription />
    },
    {
      value: 'notification',
      label: 'Notification',
      renderComponent: <Notification />
    },
    {
      value: 'integration',
      label: 'Integration',
      renderComponent: <Integration />
    },
    {
      value: 'security',
      label: 'Security',
      renderComponent: <Security />
    }
  ];

  return (
    <>
      <Subheader title={`System Settings / ${tab === 'plan' ? 'Billing' : tab}`} />

      <div className="px-6 mt-6 space-y-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value)}>
          <TabsList className="h-auto rounded-none border-none bg-transparent p-0 mb-5 gap-6">
            {tabs.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              {item.renderComponent}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
