"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

type PlanFeature = {
  text: string;
  included: boolean;
};

type PlanType = {
  name: string;
  price: string;
  features: PlanFeature[];
};

const Plan = () => {
  const plans: PlanType[] = [
    {
      name: "Basic",
      price: "N30,000",
      features: [
        { text: "Register up to 3 doctors", included: true },
        { text: "Register up to 10 doctors", included: false },
        { text: "Register unlimited number of doctors", included: false },
      ],
    },
    {
      name: "Premium",
      price: "N50,000",
      features: [
        { text: "Register up to 3 doctors", included: true },
        { text: "Register up to 10 doctors", included: true },
        { text: "Register unlimited number of doctors", included: false },
      ],
    },
    {
      name: "Platinum",
      price: "N100,000",
      features: [
        { text: "Register up to 3 doctors", included: true },
        { text: "Register up to 10 doctors", included: true },
        { text: "Register unlimited number of doctors", included: true },
      ],
    },
  ];

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default Plan;

type PlanCardProps = {
  plan: PlanType;
};

const PlanCard = ({ plan }: PlanCardProps) => {
  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");

  return (
    <Card
      className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden"
    >
      <CardHeader className="pb-0 pt-6 px-6 text-center">
        <h3 className="text-lg font-medium">{plan.name}</h3>
        <div className="mt-4 mb-2">
          <Tabs
            defaultValue="monthly"
            value={billingCycle}
            onValueChange={(value) =>
              setBillingCycle(value as "monthly" | "quarterly" | "yearly")
            }
            className="items-center"
          >
            <TabsList className="grid grid-cols-3 h-8 bg-gray-100 rounded-full text-xs">
              <TabsTrigger value="monthly" className="rounded-full">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="quarterly" className="rounded-full">
                Quarterly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="rounded-full">
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="mt-6 mb-4">
          <p className="text-3xl font-bold">{plan.price}</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        <ul className="space-y-4">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  feature.included ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                {feature.included && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-4">
        <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-md">
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>
  );
};
