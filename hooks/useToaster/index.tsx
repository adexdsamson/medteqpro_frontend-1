/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
// import { ApiResponseError } from "@/types";

export const useToastHandlers = () => {
  // const { toast } = useToast();

  const onErrorHandler = (title: string, error?: any | string) => {
    console.log({ title, error });
    if (!error) {
      toast.error(title);
      return;
    }

    if (typeof error === "string") {
      toast.error(title);
      return;
    }

    if (
      error?.response?.data &&
      typeof error.response?.data.message === "string"
    ) {
      toast.error(title, {
        description: error.response?.data?.message,
      });
      return;
    }

    toast.error(title,{
      description: "Unknown error occurred",
    });
  };

  const onSuccessHandler = (title: string, message: string) => {
    console.log({ title, message });

    toast( title, { description: message ?? "success" });
  };

  return { success: onSuccessHandler, error: onErrorHandler };
};
