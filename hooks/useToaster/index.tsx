/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useToast } from "@/components/ui";
// import { ApiResponseError } from "@/types";

export const useToastHandlers = () => {
  // const { toast } = useToast();

  const onErrorHandler = (title: string, error?: any | string) => {
    console.log({ title, error });
    if (!error) {
      // toast({
      //   title,
      //   variant: "destructive",
      // });
      return;
    }

    if (typeof error === "string") {
      // toast({
      //   title,
      //   variant: "destructive",
      // });
      return;
    }

    if (error?.response?.data && typeof error.response?.data.message === "string") {
      // toast({
      //   title,
      //   description: error.response?.data?.message,
      //   variant: "destructive",
      // });
      return;
    }

    // toast({
    //   title,
    //   description: "Unknown error occurred",
    //   variant: "destructive",
    // });
  };

  const onSuccessHandler = (title: string, message: string) => {
    console.log({ title, message });
    
    // toast({ title, description: message ?? "success", variant: "default" });
  };

  return { success: onSuccessHandler, error: onErrorHandler };
};
