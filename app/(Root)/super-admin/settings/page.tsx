"use client";

import React, { useState } from "react";
import Subheader from "../../_components/Subheader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Plan from "./layout/Plan";
import Subscription from "./layout/Subscription";
import Notification from "./layout/Notification";
import Integration from "./layout/Integration";
import Security from "./layout/Security";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      value: 'custom-subscription',
      label: 'Custom Subscription',
      renderComponent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Custom Subscription Management</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage custom subscription plans for individual hospitals
              </p>
            </div>
            <Link href="/super-admin/settings/custom-subscription">
              <Button>Manage Custom Subscriptions</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Flexible Pricing</h4>
              <p className="text-sm text-gray-600">
                Set custom amounts for individual hospitals based on specific agreements
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Custom Expiry</h4>
              <p className="text-sm text-gray-600">
                Define specific expiry dates that suit your business arrangements
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Instant Activation</h4>
              <p className="text-sm text-gray-600">
                Subscriptions are activated immediately upon creation
              </p>
            </div>
          </div>
        </div>
      )
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
