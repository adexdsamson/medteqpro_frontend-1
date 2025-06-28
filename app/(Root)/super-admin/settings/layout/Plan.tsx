/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { useGetSubscriptionPlans, useCreateSubscription } from "@/features/services/subscriptionService";
import { useToastHandler } from "@/hooks/useToaster";
import { format } from "date-fns";

type PlanFeature = {
  text: string;
  included: boolean;
};

type PlanType = {
  id: number;
  code: string;
  name: string;
  price: string;
  amount: number;
  interval: string;
  interval_display: string;
  max_no_of_doctors: number;
  max_no_of_staff: number;
  features: PlanFeature[];
  created_at?: string;
  updated_at?: string;
};

const Plan = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const { data: plansData, isLoading, error } = useGetSubscriptionPlans();
  const toast = useToastHandler();

  useEffect(() => {
    if (plansData?.data) {
      let plansList = [];
      
      // Handle both array and paginated response
      if (Array.isArray(plansData.data)) {
        plansList = plansData.data;
      } else if (plansData.data && typeof plansData.data === 'object' && 'results' in (plansData.data as any)) {
        plansList = (plansData.data as any).results;
      }

      // Transform API data to match our component structure
      const transformedPlans = plansList.map((plan: any) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        price: `₦${plan.amount.toLocaleString()}`,
        amount: plan.amount,
        interval: plan.interval,
        interval_display: plan.interval_display,
        max_no_of_doctors: plan.max_no_of_doctors,
        max_no_of_staff: plan.max_no_of_staff,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
        features: [
          { 
            text: `Register up to ${plan.max_no_of_doctors} doctors`, 
            included: true 
          },
          { 
            text: `Manage up to ${plan.max_no_of_staff} staff members`, 
            included: true 
          },
          { 
            text: `${plan.interval_display} billing cycle`, 
            included: true 
          },
        ],
      }));

      setPlans(transformedPlans);
    }
  }, [plansData]);

  useEffect(() => {
    if (error) {
      toast.error("Error", "Failed to load subscription plans");
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
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
  >(plan.interval as "monthly" | "quarterly" | "yearly");
  const { mutateAsync: createSubscription, isPending } = useCreateSubscription();
  const toast = useToastHandler();

  // Calculate price based on billing cycle
  const calculatePrice = () => {
    let multiplier = 1;
    if (billingCycle === "quarterly") multiplier = 3;
    if (billingCycle === "yearly") multiplier = 12;
    
    const totalAmount = plan.amount * multiplier;
    return `₦${totalAmount.toLocaleString()}`;
  };

  const handleSubscribe = async () => {
    try {
      // For demo purposes, using a placeholder hospital_id
      // In a real implementation, this would come from the user's context or be selected
      const payload = {
        hospital_id: "placeholder-hospital-id", // This should be dynamic
        plan_code: plan.code,
        callback_url: `${window.location.origin}/subscription/callback`
      };

      const response = await createSubscription(payload);
      
      if (response.data?.data?.authorization_url) {
        // Redirect to payment gateway
        window.location.href = response.data.data.authorization_url;
      } else {
        toast.success("Success", "Subscription created successfully");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Error", error?.message || "Failed to create subscription");
    }
  };

  return (
    <Card
      className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden"
    >
      <CardHeader className="pb-0 pt-6 px-6 text-center">
        <h3 className="text-lg font-medium">{plan.name}</h3>
        <div className="mt-4 mb-2">
          <Tabs
            defaultValue={plan.interval}
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
          <p className="text-3xl font-bold">{calculatePrice()}</p>
          <p className="text-sm text-gray-500 mt-1">
            per {billingCycle.replace('ly', '')}
          </p>
          {plan.created_at && (
            <p className="text-xs text-gray-400 mt-2">
              Created: {format(new Date(plan.created_at), 'MMM dd, yyyy')}
            </p>
          )}
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
        <Button 
          className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-md"
          onClick={handleSubscribe}
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Subscribe Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};
