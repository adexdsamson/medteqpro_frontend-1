"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TimeInput } from "@/components/FormInputs/TimeInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextInput } from "@/components/FormInputs/TextInput";
import { Switch } from "@/components/ui/switch";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Forge, Forger, useForge } from "@/lib/forge";
import { Time } from "@internationalized/date";
import { format } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";
import {
  useCreateAvailability,
  useGetAvailability,
  useUpdateAvailability,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilityItem,
} from "@/features/services/availabilityService";
import { ApiResponseError } from "@/types";
import { useWatch, type DefaultValues } from "react-hook-form";

const days = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

// Schema for availability pattern
const schema = yup.object({
  day_of_week: yup.string().required("Day is required"),
  start_time: yup.mixed<Time>().required("Start time is required"),
  end_time: yup.mixed<Time>().required("End time is required"),
  duration_minutes: yup
    .number()
    .typeError("Duration must be a number")
    .min(5, "Min 5 minutes")
    .max(240, "Max 240 minutes")
    .required("Duration is required"),
  is_available: yup.boolean().required(),
});

type FormValues = yup.InferType<typeof schema>;

interface AvailabilityDialogProps {
  children: React.ReactNode;
}

export const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const toast = useToastHandler();

  const { data: availabilityRes } = useGetAvailability();
  const availability = React.useMemo<AvailabilityItem[]>(
    () => availabilityRes?.data?.data ?? [],
    [availabilityRes?.data?.data]
  );

  const { mutateAsync: createAvailability, isPending: isCreating } =
    useCreateAvailability();
  const { mutateAsync: updateAvailability, isPending: isUpdating } =
    useUpdateAvailability();

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema),
    // defaultValues: {
    //   day_of_week: "Monday",
    //   duration_minutes: 30,
    //   is_available: true,
    // },
  });

  const selectedDay = useWatch({ control, name: "day_of_week" });

  React.useEffect(() => {
    if (!selectedDay) return;
    const existing = availability.find((a) => a.day_of_week === selectedDay);
    if (existing) {
      // parse "HH:mm:ss" to Time
      const [sh, sm] = existing.start_time.split(":").map(Number);
      const [eh, em] = existing.end_time.split(":").map(Number);
      reset({
        day_of_week: existing.day_of_week,
        start_time: new Time(sh, sm),
        end_time: new Time(eh, em),
        duration_minutes: existing.duration_minutes,
        is_available: existing.is_available,
      });
    } else {
      // clear time fields while keeping other defaults
      const emptyValues: DefaultValues<FormValues> = {
        day_of_week: selectedDay,
        duration_minutes: 30,
        is_available: true,
      };
      reset(emptyValues);
    }
  }, [selectedDay, availability, reset]);

  const toHHmmss = (t: Time) =>
    format(new Date(0, 0, 0, t.hour, t.minute), "HH:mm:ss");

  const onSubmit = async (values: FormValues) => {
    try {
      const payloadBase = {
        start_time: toHHmmss(values.start_time),
        end_time: toHHmmss(values.end_time),
        duration_minutes: Number(values.duration_minutes),
      };

      const exists = availability.some(
        (a) => a.day_of_week === values.day_of_week
      );

      if (exists) {
        const updatePayload: UpdateAvailabilityRequest = payloadBase;
        await updateAvailability({
          day_of_week: values.day_of_week,
          payload: updatePayload,
        });
        toast.success(
          "Availability Updated",
          `Saved ${values.day_of_week} schedule`
        );
      } else {
        const createPayload: CreateAvailabilityRequest = {
          day_of_week: values.day_of_week,
          ...payloadBase,
        };
        await createAvailability(createPayload);
        toast.success(
          "Availability Created",
          `Added ${values.day_of_week} schedule`
        );
      }

      setOpen(false);
    } catch (error: unknown) {
      const err = error as ApiResponseError;
      console.error(err);
      toast.error("Error", err?.message ?? "Failed to save availability");
    }
  };

  // Basic time validation: end > start
  const start = useWatch({ control, name: "start_time" }) as Time | undefined;
  const end = useWatch({ control, name: "end_time" }) as Time | undefined;
  const timeError =
    start &&
    end &&
    (end.hour < start.hour ||
      (end.hour === start.hour && end.minute <= start.minute))
      ? "End time must be after start time"
      : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Doctor Availability</DialogTitle>
          <DialogDescription>
            Define your weekly availability, appointment slot durations, and
            manage exceptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm sm:text-base">Weekly Pattern</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pick a day and set the working window and slot duration.
            </p>
          </div>
          <Forge control={control} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Forger
                name="day_of_week"
                component={TextSelect}
                label="Day of Week"
                options={days}
                placeholder="Select day"
              />

              <div className="flex items-end gap-3">
                <div className="w-full">
                  <Forger
                    name="start_time"
                    component={TimeInput}
                    label="Start Time"
                  />
                </div>
                <div className="w-full">
                  <Forger
                    name="end_time"
                    component={TimeInput}
                    label="End Time"
                  />
                </div>
              </div>

              <Forger
                name="duration_minutes"
                component={TextInput}
                label="Slot Duration (minutes)"
                placeholder="e.g. 30"
              />

              <div className="flex items-center gap-3 mt-2">
                <Switch
                  checked={true}
                  disabled
                  aria-readonly
                  aria-label="Available toggle"
                />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
            </div>

            {timeError ? (
              <p className="text-xs text-red-600 mt-1">{timeError}</p>
            ) : null}

            <Separator className="my-4" />

            {/* <div>
              <h4 className="font-medium text-sm sm:text-base">Exceptions & Time Off</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage leave using Staff Work Status in Profile. Availability will be respected during booking.
              </p>
            </div> */}

            <div className="mt-4 ">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;
