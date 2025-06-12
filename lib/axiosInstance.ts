import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { storeFunctions } from "@/store/authSlice";
// import { config } from "@/config";

export const getAxiosInstance = (url?: string) => {
  const axiosInstance = axios.create();
  const { token, setReset, loginToken, user } = storeFunctions.getState();

  axiosInstance.defaults.baseURL = url ?? "https://b2p2upqndjzvncqwhnfudgiazu0navlq.lambda-url.us-east-2.on.aws/api/v1/";

  if (token && user !== null) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  if (loginToken && user === null) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${loginToken}`;
  }

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const isUnauthorized = error.response && error.response.status === 401;
      if (isUnauthorized) {
        // Redirect out to Login screen
        setReset();
      }

      return Promise.reject(error);
    }
  );

  axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
  axiosInstance.defaults.headers.common["Accept"] = "application/json";

  axiosInstance.defaults.withCredentials = false;

  return axiosInstance;
};

export const getRequest = async ({
  url,
  config,
}: {
  url: string;
  config?: AxiosRequestConfig;
}) => {
  const res = await getAxiosInstance().get(url, config);
  return res;
};

type RequestProps<T = unknown> = {
  url: string;
  payload: T;
  config?: AxiosRequestConfig<T>;
};

export const postRequest = async <T = unknown>({
  payload,
  url,
  config,
}: RequestProps<T>) => {
  const res = await getAxiosInstance().post(`${url}`, payload, config);
  return res;
};

export const patchRequest = async <T = unknown>({
  payload,
  url,
  config,
}: RequestProps<T>) => {
  const res = await getAxiosInstance().patch(`${url}`, payload, config);
  return res;
};

export const putRequest = async <T = unknown>({
  payload,
  url,
  config,
}: RequestProps<T>) => {
  const res = await getAxiosInstance().put(`${url}`, payload, config);
  return res;
};

export const deleteRequest = async <T = unknown>({
  payload,
  url,
  config,
}: Partial<RequestProps<T>>) => {
  const res = await getAxiosInstance().delete(`${url}`, { data: payload, ...config });
  return res;
};

export const externalUploadRequest = async (url: string, payload: FormData, baseUrl?: string) => {
  const res = await getAxiosInstance(baseUrl).post(`${url}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};