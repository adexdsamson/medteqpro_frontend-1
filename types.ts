/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse, AxiosError } from "axios";

export interface Hospital_Onboarding {
  id:           string;
  name:         string;
  email:        null;
  phone_number: null;
  state:        string;
  city:         string;
  address:      string;
  avatar:       null;
  status:       string;
  created_at:   Date;
  updated_at:   Date;
}


export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  hospital?: Hospital_Onboarding;
  phone_number: null | string;
  role: string;
  is_active: boolean;
  is_staff: boolean;
}

export type Api<T> = {
  status: boolean;
  message: string | Record<string, string[]>;
  data: T;
};

export type ApiList<T> = {
  count: number;
  next: null;
  previous: null;
  results: T;
};

export type ApiResponse<T = unknown> = AxiosResponse<Api<T>>;
export type ApiListResponse<T = unknown> = AxiosResponse<ApiList<Api<T>>>;
export type ApiResponseError = AxiosError<Api<any>>;

// Hospital onboarding types
export interface Hospital {
  id: string;
  name: string;
  no_of_doctors: number;
  state: string;
  city: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface HospitalOnboardingResponse {
  email: string;
  first_name: string;
  last_name: string;
  hospital: Hospital;
}

export interface HospitalOnboardingPayload {
  email: string;
  first_name: string;
  last_name: string;
  hospital: {
    name: string;
    no_of_doctors: string;
    state: string;
    city: string;
    address: string;
  };
}
