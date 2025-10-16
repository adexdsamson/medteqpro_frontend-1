"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { FiSave } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { ApiResponseError } from "@/types";
import {
  useGetStaffWorkStatus,
  useUpdateStaffWorkStatus,
  StaffWorkStatus,
} from "@/features/services/staffService";
import { useToastHandler } from "@/hooks/useToaster";

type StatusChoice = "present" | "on_leave" | "on_sick_leave" | "suspended";

export default function StaffWorkStatusPage() {
  const params = useParams<{ staffId: string }>();
  const staffId = params?.staffId as string;
  const { data, isLoading } = useGetStaffWorkStatus(staffId);
  const { mutateAsync, isPending } = useUpdateStaffWorkStatus();
  const toast = useToastHandler();
  const router = useRouter();

  const apiStatus: StaffWorkStatus | undefined = data?.data?.data;

  const [choice, setChoice] = useState<StatusChoice>("present");
  const [leaveFrom, setLeaveFrom] = useState<string>("");
  const [leaveTo, setLeaveTo] = useState<string>("");
  const [sickFrom, setSickFrom] = useState<string>("");
  const [sickTo, setSickTo] = useState<string>("");

  useEffect(() => {
    if (!apiStatus) return;
    const status = apiStatus.status;
    const reason = apiStatus.reason ?? undefined;
    if (status === "active") {
      setChoice("present");
    } else if (status === "on_leave" && reason === "sick") {
      setChoice("on_sick_leave");
      setSickFrom(apiStatus.start_date ?? "");
      setSickTo(apiStatus.end_date ?? "");
    } else if (status === "on_leave") {
      setChoice("on_leave");
      setLeaveFrom(apiStatus.start_date ?? "");
      setLeaveTo(apiStatus.end_date ?? "");
    } else if (status === "suspended") {
      setChoice("suspended");
    } else {
      setChoice("present");
    }
  }, [apiStatus]);

  const payload = useMemo(() => {
    if (choice === "present") {
      return { status: "active" as const };
    }
    if (choice === "on_leave") {
      return {
        status: "on_leave" as const,
        reason: "leave",
        start_date: leaveFrom || undefined,
        end_date: leaveTo || undefined,
      };
    }
    if (choice === "on_sick_leave") {
      return {
        status: "on_leave" as const,
        reason: "sick",
        start_date: sickFrom || undefined,
        end_date: sickTo || undefined,
      };
    }
    return { status: "suspended" as const };
  }, [choice, leaveFrom, leaveTo, sickFrom, sickTo]);

  const exclusiveToggle = (c: StatusChoice) => setChoice(c);

  const handleSave = async () => {
    try {
      const result = await mutateAsync({ staffId, payload });
      const apiMessage = result?.data?.message;
      const successMessage =
        typeof apiMessage === "string" ? apiMessage : "Work status updated";
      toast.success("Work Status", successMessage);
      router.back();
    } catch (error) {
      const err = error as ApiResponseError;
      const serverMessage = err?.response?.data?.message;
      const errorMessage =
        typeof serverMessage === "string"
          ? serverMessage
          : err?.message ?? "Failed to update work status";
      toast.error("Work Status", errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex items-center justify-between px-6 py-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Work Status</h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mt-1">
            Here you can set work status for the staff by toggling on and off
            each menu, list, and date if necessary
          </p>
        </div>
        <ConfirmAlert
          icon={FiSave}
          title="Save Work Status"
          text="Confirm to apply the selected work status for this staff."
          onConfirm={handleSave}
          trigger={
            <Button disabled={isPending || isLoading} className="min-w-[80px]">
              Done
            </Button>
          }
        />
      </div>

      <div className="px-6">
        <Card className="border rounded-md overflow-hidden">
          <CardContent className="p-0">
            {/* Present */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b bg-white">
              <span className="text-sm font-medium text-gray-900">Present</span>
              <Switch
                checked={choice === "present"}
                onCheckedChange={() => exclusiveToggle("present")}
              />
            </div>

            {/* On Leave */}
            <div className="px-4 sm:px-5 py-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  On Leave
                </span>
                <Switch
                  checked={choice === "on_leave"}
                  onCheckedChange={() => exclusiveToggle("on_leave")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <TextDateInput
                  label="From"
                  value={leaveFrom || undefined}
                  onChange={(d) => setLeaveFrom(d || "")}
                  disabled={choice !== "on_leave"}
                />
                <TextDateInput
                  label="To"
                  value={leaveTo || undefined}
                  onChange={(d) => setLeaveTo(d || "")}
                  disabled={choice !== "on_leave"}
                />
              </div>
            </div>

            {/* On Sick Leave */}
            <div className="px-4 sm:px-5 py-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  On Sick Leave
                </span>
                <Switch
                  checked={choice === "on_sick_leave"}
                  onCheckedChange={() => exclusiveToggle("on_sick_leave")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <TextDateInput
                  label="From"
                  value={sickFrom || undefined}
                  onChange={(d) => setSickFrom(d || "")}
                  disabled={choice !== "on_sick_leave"}
                />
                <TextDateInput
                  label="To"
                  value={sickTo || undefined}
                  onChange={(d) => setSickTo(d || "")}
                  disabled={choice !== "on_sick_leave"}
                />
              </div>
            </div>

            {/* Suspended */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 bg-white">
              <span className="text-sm font-medium text-gray-900">
                Suspended
              </span>
              <Switch
                checked={choice === "suspended"}
                onCheckedChange={() => exclusiveToggle("suspended")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
