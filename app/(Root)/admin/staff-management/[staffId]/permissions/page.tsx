"use client";

import React, { useEffect, useMemo, useState } from "react";
import Subheader from "../../../../../../layouts/Subheader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useParams, useRouter } from "next/navigation";
import {
  PermissionCategory,
  StaffPermissions,
  useGetStaffPermissions,
  useUpdateStaffPermissions,
} from "@/features/services/staffService";
import { useToastHandler } from "@/hooks/useToaster";
import { ConfirmAlert } from "@/components/ConfirmAlert";

const ROLE_CHIPS: { key: StaffPermissions["role"]; label: string }[] = [
  { key: "admin", label: "Admin" },
  { key: "front_desk", label: "Front Office" },
  { key: "doctor", label: "Doctor" },
  { key: "nurse", label: "Nurse" },
  { key: "lab_scientist", label: "Lab Sci" },
  { key: "pharmacist", label: "Pharm" },
];

const PERMISSION_LABELS: { key: PermissionCategory; label: string }[] = [
  { key: "create_patient", label: "Create a New Patient" },
  { key: "patient", label: "Patient" },
  { key: "wound_care", label: "Wound Care" },
  { key: "opa_record", label: "OPA Record" },
  { key: "bed_management", label: "Bed Management" },
  { key: "staff_management", label: "Staff Management" },
  { key: "payroll_management", label: "Payroll Management" },
  { key: "lab_result", label: "Lab Result" },
  { key: "laboratory", label: "Laboratory" },
  { key: "lab_draft", label: "Lab Draft" },
  { key: "pickup", label: "Pick Up" },
  { key: "internal_pharmacy", label: "Internal Pharmacy" },
  { key: "queuing_system", label: "Queuing System" },
  { key: "appointment", label: "Appointment" },
];

export default function StaffPermissionPage() {
  const params = useParams<{ staffId: string }>();
  const staffId = params?.staffId as string;
  const { data, isLoading } = useGetStaffPermissions(staffId);
  const { mutateAsync, isPending } = useUpdateStaffPermissions();
  const toast = useToastHandler();
  const router = useRouter();

  // Extract the API payload (Api<StaffPermissions> -> data: StaffPermissions)
  const apiData = data?.data?.data;

  const [permissions, setPermissions] = useState<Record<PermissionCategory, boolean>>({
    create_patient: false,
    patient: false,
    wound_care: false,
    opa_record: false,
    bed_management: false,
    staff_management: false,
    payroll_management: false,
    lab_result: false,
    laboratory: false,
    lab_draft: false,
    pickup: false,
    internal_pharmacy: false,
    queuing_system: false,
    appointment: false,
  });

  const activeRole = apiData?.role;

  useEffect(() => {
    if (apiData?.permissions) {
      setPermissions(apiData.permissions);
    }
  }, [data, apiData]);

  const allEnabled = useMemo(
    () => PERMISSION_LABELS.every((p) => permissions[p.key]),
    [permissions]
  );

  const handleToggleAll = (value: boolean) => {
    const next: Record<PermissionCategory, boolean> = { ...permissions };
    PERMISSION_LABELS.forEach(({ key }) => (next[key] = value));
    setPermissions(next);
  };

  const handleSave = async () => {
    try {
      await mutateAsync({ staffId, payload: { ...permissions } });
      toast.success("Permissions Updated", "Staff permissions have been saved");
      router.back();
    } catch (error) {
      toast.error("Failed to Save Permissions", error as unknown as string);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Subheader title="Permission" />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Top controls: Role chips and Done button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {ROLE_CHIPS.map((chip) => (
              <Button
                key={chip.key}
                variant={chip.key === activeRole ? "default" : "outline"}
                className={`rounded-full px-4 py-1 text-sm ${
                  chip.key !== activeRole ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={chip.key !== activeRole}
              >
                {chip.label}
              </Button>
            ))}
          </div>

          <ConfirmAlert
            title="Confirm Save"
            text="Save permission changes for this staff?"
            onConfirm={handleSave}
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" loading={isPending}>
                Done
              </Button>
            }
          />
        </div>

        {/* Permission list */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-medium">All</span>
            <Switch
              checked={allEnabled}
              onCheckedChange={handleToggleAll}
            />
          </div>

          {PERMISSION_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
              <span className="text-sm">{label}</span>
              <Switch
                checked={permissions[key]}
                onCheckedChange={(val) =>
                  setPermissions((prev) => ({ ...prev, [key]: val }))
                }
              />
            </div>
          ))}
        </div>

        {isLoading && (
          <p className="text-sm text-gray-500">Loading permissions…</p>
        )}
      </div>
    </div>
  );
}