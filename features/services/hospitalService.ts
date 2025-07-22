/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseError } from "@/types";
import { postRequest, getRequest } from "@/lib/axiosInstance";

export type HospitalType = {
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
};

export type HospitalListType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  no_of_doctors: number;
  state: string;
  city: string;
  address: string;
  date_created: string;
  status: string;
};

export const useOnboardHospital = () => {
  return useMutation<ApiResponse<any>, ApiResponseError, HospitalType>({
    mutationFn: async (payload) =>
      await postRequest({ url: "/auth/onboard/hospital/", payload}),
  });
};

export const useGetHospitalList = () => {
  return useQuery<ApiResponse<HospitalListType[]>, ApiResponseError>({
    queryKey: ["hospitalList"],
    queryFn: async () => await getRequest({ url: "/superadmin/hospitals/" }),
  });
};

export const useGetHospitalDetail = (hospitalId: string) => {
  return useQuery<ApiResponse<HospitalListType>, ApiResponseError>({
    queryKey: ["hospitalDetail", hospitalId],
    queryFn: async () =>
      await getRequest({ url: `/superadmin/hospitals/${hospitalId}/` }),
    enabled: !!hospitalId,
  });
};