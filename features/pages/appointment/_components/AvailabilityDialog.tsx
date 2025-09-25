/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Forge, Forger, useForge, useFieldArray } from "@/lib/forge";
import { Time } from "@internationalized/date";
import { format, parse, isBefore, set } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";
import {
  useCreateAvailability,
  useGetAvailability,
  useUpdateAvailability,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilityItem,
  useToggleAvailability,
  CreateAvailabilityItem,
} from "@/features/services/availabilityService";
import { ApiResponseError } from "@/types";
import { useWatch, type DefaultValues, type Control } from "react-hook-form";

const days = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

// Schema for single availability pattern
const schema = yup.object({
  day_of_week: yup.string().required("Day is required"),
  start_time: yup.mixed<Time>().required("Start time is required"),
  end_time: yup.mixed<Time>().required("End time is required"),
  no_of_slots: yup
    .number()
    .typeError("Number of slots must be a number")
    .integer("Number of slots must be an integer")
    .min(1, "Minimum 1 slot")
    .required("Number of slots is required"),
  is_available: yup.boolean().default(true).notRequired(),
});

// Schema for multiple availability entries
const multiSchema = yup.object({
  entries: yup.array().of(schema).min(1, "Add at least one schedule entry"),
});

// Types
type FormValues = yup.InferType<typeof schema>;
/** Form values for bulk mode */
type MultiFormValues = { entries: FormValues[] };

interface AvailabilityDialogProps {
  children: React.ReactNode;
}

/**
 * AvailabilityDialog
 * UI dialog to manage doctor's availability.
 * Supports single-day editing and a bulk mode to create multiple entries in one submission.
 * @param {AvailabilityDialogProps} props React props with trigger children
 * @returns {JSX.Element}
 * @example
 * <AvailabilityDialog>
 *   <Button>Set Availability</Button>
 * </AvailabilityDialog>
 */
export const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [bulkMode, setBulkMode] = React.useState(false);
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
  const { mutateAsync: toggleAvailability, isPending: isToggling } =
    useToggleAvailability();

  // Single entry form
  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema),
  });

  // Bulk entries form
  const {
    control: bulkControl,
    reset: bulkReset,
    // formState: { errors: bulkErrors },
  } = useForge<MultiFormValues>({
    resolver: yupResolver(multiSchema) as any,
    defaultValues: {
      entries: [
        {
          day_of_week: "Monday",
          no_of_slots: 1,
          is_available: true,
        } as unknown as FormValues,
      ],
    },
  });

  const {
    fields: multiFields,
    append,
    remove,
  } = useFieldArray({
    control: bulkControl as unknown as Control,
    name: "entries",
    inputProps: [],
  });

  const selectedDay = useWatch({ control, name: "day_of_week" });

  // Preselect first available day on open for better UX
  React.useEffect(() => {
    if (!open) return;
    if (selectedDay) return;
    const defaultDay = availability[0]?.day_of_week || "Monday";
    const existing = availability.find((a) => a.day_of_week === defaultDay);

    let start: Time | undefined = undefined;
    let end: Time | undefined = undefined;
    if (existing) {
      const st = parse(existing.start_time, "HH:mm:ss", new Date());
      const et = parse(existing.end_time, "HH:mm:ss", new Date());
      start = new Time(st.getHours(), st.getMinutes());
      end = new Time(et.getHours(), et.getMinutes());
    }

    reset({
      day_of_week: defaultDay,
      start_time: start,
      end_time: end,
      no_of_slots: existing?.no_of_slots ?? 1,
      is_available: existing?.is_available ?? true,
    } as unknown as FormValues);
  }, [open, availability, selectedDay, reset]);

  // When entering bulk mode, preload existing availability into rows
  React.useEffect(() => {
    if (!open) return;
    if (!bulkMode) return;
    if (!availability?.length) return;
    const entries = availability.map((a) => {
      const st = parse(a.start_time, "HH:mm:ss", new Date());
      const et = parse(a.end_time, "HH:mm:ss", new Date());
      return {
        day_of_week: a.day_of_week,
        start_time: new Time(st.getHours(), st.getMinutes()),
        end_time: new Time(et.getHours(), et.getMinutes()),
        no_of_slots: a.no_of_slots,
        is_available: a.is_available,
      } as unknown as FormValues;
    });
    bulkReset({ entries });
  }, [open, bulkMode, availability, bulkReset]);

  const existingForSelectedDay = React.useMemo(
    () => availability.find((a) => a.day_of_week === selectedDay),
    [availability, selectedDay]
  );

  React.useEffect(() => {
    if (!selectedDay) return;
    const existing = availability.find((a) => a.day_of_week === selectedDay);
    if (existing) {
      // parse "HH:mm:ss" to Time via date-fns
      const st = parse(existing.start_time, "HH:mm:ss", new Date());
      const et = parse(existing.end_time, "HH:mm:ss", new Date());
      reset({
        day_of_week: existing.day_of_week,
        start_time: new Time(st.getHours(), st.getMinutes()),
        end_time: new Time(et.getHours(), et.getMinutes()),
        no_of_slots: existing.no_of_slots,
        is_available: existing.is_available,
      });
    } else {
      // clear time fields while keeping other defaults
      const emptyValues: DefaultValues<FormValues> = {
        day_of_week: selectedDay,
        no_of_slots: 1,
        is_available: true,
      };
      reset(emptyValues);
    }
  }, [selectedDay, availability, reset]);

  const toHHmmss = (t: Time) =>
    format(new Date(0, 0, 0, t.hour, t.minute), "HH:mm:ss");

  /**
   * Submit handler for single entry.
   * @param {FormValues} values Single availability form values
   * @returns {Promise<void>} Resolves when saved
   * @example
   * await onSubmit({ day_of_week: 'Monday', start_time: new Time(9,0), end_time: new Time(17,0), no_of_slots: 4, is_available: true })
   */
  const onSubmit = async (values: FormValues) => {
    try {
      const payloadBase = {
        start_time: toHHmmss(values.start_time),
        end_time: toHHmmss(values.end_time),
        no_of_slots: Number(values.no_of_slots),
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

  /**
   * Submit handler for multiple entries (bulk mode).
   * @param {MultiFormValues} values Multi-form values containing an array of entries
   * @returns {Promise<void>} Resolves when saved
   * @example
   * await onSubmitBulk({ entries: [{ day_of_week: 'Mon', start_time: new Time(9,0), end_time: new Time(12,0), no_of_slots: 4, is_available: true }] })
   */
  const onSubmitBulk = async (values: MultiFormValues) => {
    try {
      const entries = values.entries || [];
      if (!entries.length) {
        toast.error("Validation", "Please add at least one schedule entry");
        return;
      }

      const existingDays = new Set(availability.map((a) => a.day_of_week));

      const toCreate: CreateAvailabilityItem[] = [];
      const toUpdate: {
        day_of_week: string;
        payload: UpdateAvailabilityRequest;
      }[] = [];

      entries.forEach((v) => {
        const base = {
          start_time: toHHmmss(v.start_time as unknown as Time),
          end_time: toHHmmss(v.end_time as unknown as Time),
          no_of_slots: Number(v.no_of_slots),
        };
        if (existingDays.has(v.day_of_week)) {
          toUpdate.push({ day_of_week: v.day_of_week, payload: base });
        } else {
          toCreate.push({ day_of_week: v.day_of_week, ...base });
        }
      });

      // First create new ones (single bulk POST)
      if (toCreate.length) {
        await createAvailability(toCreate);
      }
      // Then patch existing ones (multiple PATCH calls)
      if (toUpdate.length) {
        await Promise.all(toUpdate.map((u) => updateAvailability(u)));
      }

      toast.success(
        "Availability Saved",
        `Processed ${entries.length} schedule${entries.length > 1 ? "s" : ""}`
      );
      setOpen(false);
    } catch (error: unknown) {
      const err = error as ApiResponseError;
      console.error(err);
      toast.error("Error", err?.message ?? "Failed to save availability");
    }
  };

  // Basic time validation for single entry: end > start
  const start = useWatch({ control, name: "start_time" }) as Time | undefined;
  const end = useWatch({ control, name: "end_time" }) as Time | undefined;
  const timeError =
    start && end && !isBefore(timeToDate(start), timeToDate(end))
      ? "End time must be after start time"
      : undefined;

  /**
   * AvailabilityRow
   * Renders a single row of availability inputs within the bulk mode form.
   * @param {{ index: number; onRemove: () => void }} props Row index and remove handler
   * @returns {JSX.Element}
   */
  const AvailabilityRow: React.FC<{
    index: number;
    onRemove: () => void;
  }> = ({ index, onRemove }) => {
    const d = useWatch({
      control: bulkControl,
      name: `entries.${index}.day_of_week`,
    }) as string | undefined;
    const s = useWatch({
      control: bulkControl,
      name: `entries.${index}.start_time`,
    }) as Time | undefined;
    const e = useWatch({
      control: bulkControl,
      name: `entries.${index}.end_time`,
    }) as Time | undefined;

    const existingForRow = React.useMemo(
      () => availability.find((a) => a.day_of_week === d),
      [d]
    );

    const rowError =
      s && e && (e.hour < s.hour || (e.hour === s.hour && e.minute <= s.minute))
        ? "End time must be after start time"
        : undefined;

    return (
      <div className="border rounded-md p-3 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Forger
            name={`entries.${index}.day_of_week`}
            component={TextSelect}
            label="Day of Week"
            options={days}
            placeholder="Select day"
          />
          <div className="flex items-end gap-3">
            <div className="w-full">
              <Forger
                name={`entries.${index}.start_time`}
                component={TimeInput}
                label="Start Time"
              />
            </div>
            <div className="w-full">
              <Forger
                name={`entries.${index}.end_time`}
                component={TimeInput}
                label="End Time"
              />
            </div>
          </div>
          <Forger
            name={`entries.${index}.no_of_slots`}
            component={TextInput}
            label="Number of Slots"
            placeholder="e.g. 4"
          />
          <div className="flex items-center gap-3 mt-2">
            <Switch
              checked={!!existingForRow?.is_available}
              onCheckedChange={async (checked) => {
                if (!d || !existingForRow) return;
                try {
                  await toggleAvailability({
                    day_of_week: d,
                    is_available: checked,
                  });
                  toast.success(
                    "Availability",
                    `${d} is now ${checked ? "Available" : "Unavailable"}`
                  );
                } catch (error) {
                  const err = error as ApiResponseError;
                  console.error(err);
                  toast.error(
                    "Error",
                    err?.message ?? "Failed to toggle availability"
                  );
                }
              }}
              disabled={!existingForRow || isToggling}
              aria-label="Available toggle"
            />
            <span className="text-sm text-muted-foreground">
              {existingForRow
                ? existingForRow.is_available
                  ? "Available"
                  : "Unavailable"
                : "Create schedule to enable toggle"}
            </span>
          </div>
        </div>
        {rowError ? (
          <p className="text-xs text-red-600 mt-1">{rowError}</p>
        ) : null}
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          // reset bulk mode state when closed
          setBulkMode(false);
          bulkReset({
            entries: [
              {
                day_of_week: "Monday",
                no_of_slots: 1,
                is_available: true,
              } as unknown as FormValues,
            ],
          });
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[860px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Availability</DialogTitle>
          <DialogDescription>
            Define your weekly availability, number of appointment slots, and
            manage exceptions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-medium text-sm sm:text-base">Weekly Pattern</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {bulkMode
                ? "Add multiple schedules and save them at once."
                : "Pick a day and set the working window and number of slots."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Bulk mode
            </span>
            <Switch
              checked={bulkMode}
              onCheckedChange={setBulkMode}
              aria-label="Toggle bulk mode"
            />
          </div>
        </div>

        {!bulkMode ? (
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
                name="no_of_slots"
                component={TextInput}
                label="Number of Slots"
                placeholder="e.g. 4"
              />

              <div className="flex items-center gap-3 mt-2">
                <Switch
                  checked={!!existingForSelectedDay?.is_available}
                  onCheckedChange={async (checked) => {
                    if (!selectedDay || !existingForSelectedDay) return;
                    try {
                      await toggleAvailability({
                        day_of_week: selectedDay,
                        is_available: checked,
                      });
                      toast.success(
                        "Availability",
                        `${selectedDay} is now ${
                          checked ? "Available" : "Unavailable"
                        }`
                      );
                    } catch (error) {
                      const err = error as ApiResponseError;
                      console.error(err);
                      toast.error(
                        "Error",
                        err?.message ?? "Failed to toggle availability"
                      );
                    }
                  }}
                  disabled={!existingForSelectedDay || isToggling}
                  aria-label="Available toggle"
                />
                <span className="text-sm text-muted-foreground">
                  {existingForSelectedDay
                    ? existingForSelectedDay.is_available
                      ? "Available"
                      : "Unavailable"
                    : "Create schedule to enable toggle"}
                </span>
              </div>
            </div>

            {timeError ? (
              <p className="text-xs text-red-600 mt-1">{timeError}</p>
            ) : null}

            <Separator className="my-4" />

            <div className="mt-4 flex items-center gap-2 justify-end">
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
        ) : (
          <Forge control={bulkControl} onSubmit={onSubmitBulk} debug>
            <div className="space-y-4">
              {multiFields.map((field, idx) => (
                <AvailabilityRow
                  key={field.id ?? idx}
                  index={idx}
                  onRemove={() => remove(idx)}
                />
              ))}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({
                      day_of_week: "Monday",
                      no_of_slots: 1,
                      is_available: true,
                    } as unknown as FormValues)
                  }
                >
                  Add another day
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mt-4 flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Saving..." : "Save All"}
              </Button>
            </div>
          </Forge>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;

/**
 * Convert a Time object to a Date anchored at epoch using date-fns set.
 * @param {Time} t The Time instance to convert
 * @returns {Date} JS Date representing the same hours and minutes
 */
const timeToDate = (t: Time) =>
  set(new Date(0), {
    hours: t.hour,
    minutes: t.minute,
    seconds: 0,
    milliseconds: 0,
  });
