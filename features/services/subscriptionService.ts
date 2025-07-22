/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseError } from "@/types";
import { getRequest, postRequest } from "@/lib/axiosInstance";

// Define types based on the API response structure from documentation
export interface SubscriptionListItem {
  hospital_name: string;
  plan_name: string;
  amount: string;
  last_subscription_date: string;
  expiry_date: string | null;
  status: string;
}

export interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  amount: number;
  interval: string;
  interval_display: string;
  max_no_of_doctors: number;
  max_no_of_staff: number;
}

export interface CreateSubscriptionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface CreateSubscriptionPayload {
  hospital_id: string;
  plan_code: string;
  callback_url: string;
}

// Hook to get subscription list for super admin
export const useGetSubscriptionList = () => {
  return useQuery<ApiResponse<SubscriptionListItem[]>, ApiResponseError>({
    queryKey: ['subscription-list'],
    queryFn: async () => {
      const response = await getRequest({
        url: '/superadmin/hospitals/subscriptions/'
      });
      return response;
    }
  });
};

// Hook to get subscription plans
export const useGetSubscriptionPlans = () => {
  return useQuery<ApiResponse<SubscriptionPlan[]>, ApiResponseError>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await getRequest({
        url: '/billing/subscription-plans/'
      });
      return response;
    }
  });
};

// Hook to create a subscription
export const useCreateSubscription = () => {
  return useMutation<ApiResponse<CreateSubscriptionResponse>, ApiResponseError, CreateSubscriptionPayload>({
    mutationFn: async (payload) => {
      const response = await postRequest({
        url: '/billing/create-subscription/',
        payload
      });
      return response;
    }
  });
};

// Hook to cancel a subscription
export const useCancelSubscription = () => {
  return useMutation<ApiResponse<any>, ApiResponseError, { subscription_id: string }>({
    mutationFn: async (payload) => {
      const response = await postRequest({
        url: '/billing/cancel-subscription/',
        payload
      });
      return response;
    }
  });
};

// Custom subscription types
export interface CreateCustomSubscriptionPayload {
  hospital_id: string;
  amount: number;
  expires_at: string;
}

export interface CreateCustomSubscriptionResponse {
  id: string;
  hospital_name: string;
  plan_code: string;
  plan_name: string;
  amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  expiry_date: string;
}

// Hook to create a custom subscription
export const useCreateCustomSubscription = () => {
  return useMutation<ApiResponse<CreateCustomSubscriptionResponse>, ApiResponseError, CreateCustomSubscriptionPayload>({
    mutationFn: async (payload) => {
      const response = await postRequest({
        url: '/billing/create-custom-subscription/',
        payload
      });
      return response;
    }
  });
};