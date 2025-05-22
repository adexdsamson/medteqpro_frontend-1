/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse, AxiosError } from "axios";

export type User = {
  id: string;
  full_name: string;
  businessName: string;
  businessAddress: string;
  industry: string;
  businessType: string;
  businessEmail: string;
  businessCAC: string;
  numberOfEmployees: string;
  country: string;
  zipCode: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  jobTitle: string;
  role: string;
  is_active: boolean;
  authority?: string[];
  profileId?: string;
  last_login: string;
};

export interface UserProfile {
  id: string;
  full_name: string;
  address: null;
  email: string;
  phone_number: null;
  display_name: string;
  is_locked: boolean;
  created_at: Date;
  updated_at: Date;
  last_login: string;
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
