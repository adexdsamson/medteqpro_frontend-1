/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
// import { useToastHandlers } from "@/hooks/useToaster";
// import { deleteRequest } from "@/lib/axiosInstance";
// import { ApiResponse, ApiResponseError } from "@/types";
// import { useMutation } from "@tanstack/react-query";
import { FiTrash } from "react-icons/fi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
// import { useSetReset } from "@/store/authSlice";

type ConfirmAlertProps = {
  url?: string;
  title: string;
  text: string;
  children?: ReactNode;
  trigger?: ReactNode;
  onClose?: (open: boolean) => void;
  logout?: boolean;
  icon?: any;
};
export const ConfirmAlert = ({
  icon = FiTrash,
  text,
  title,
  children,
  logout,
  onClose,
  trigger,
  // url = "",
}: ConfirmAlertProps) => {
  // const setReset = useSetReset();
  // const toastHandlers = useToastHandlers();

  // const mutation = useMutation<ApiResponse<any>, ApiResponseError, undefined>({
  //   mutationFn: () => deleteRequest(url),
  // });

  const handleSubmit = async () => {
  //   const TOAST_TITLE = "Deletion";
  //   try {
  //     const result = await mutation.mutateAsync(undefined);

  //     if (result.status !== 200) {
  //       toastHandlers.error(TOAST_TITLE, "Failed to delete");
  //       return;
  //     }

  //     if(typeof result?.data?.message === "string") {
  //       toastHandlers.success(
  //         TOAST_TITLE,
  //         result.data.message ?? "Successfully deleted"
  //       );
  //       return;
  //     }
  //   } catch (error) {
  //     const err = error as ApiResponseError;
  //     toastHandlers.error(TOAST_TITLE, err);
  //   }
  };

  const handleLogout = async () => {
    // const TOAST_TITLE = "Log out";
    // try {
    //   setReset();
    // } catch (error) {
    //   const err = error as ApiResponseError;
    //   toastHandlers.error(TOAST_TITLE, err);
    // }
  };

  const Icon = icon;

  return (
    <Dialog
      onOpenChange={(open) => {
        onClose?.(open);
      }}
    >
      {children}
      {trigger ? <DialogTrigger>{trigger}</DialogTrigger> : null}
      <DialogContent className="px-0 pb-0">
        <div className="flex gap-3 items-start px-0">
          <div className="rounded-full flex items-center bg-[#FFDFDF] justify-center h-12 w-12 ml-3">
            <Icon className="text-primary h-5 w-5" />
          </div>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="max-w-[23rem]">
              {text}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="bg-[#F8FAFC] py-2 flex gap-3 items-center justify-end px-3">
          <DialogClose asChild>
            <Button className="bg-white hover:bg-white text-gray-400">
              No
            </Button>
          </DialogClose>
          <Button
            onClick={logout ? handleLogout : handleSubmit}
            // isLoading={mutation.isPending}
            className=""
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
