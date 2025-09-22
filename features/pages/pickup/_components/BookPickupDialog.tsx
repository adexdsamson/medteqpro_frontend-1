"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Forge, Forger, useForge } from "@/lib/forge";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { TimeInput } from "@/components/FormInputs/TimeInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToastHandler } from "@/hooks/useToaster";
import { useCreatePickup } from "@/features/services/pickupService";
import { useGetDrugOrders, DrugOrder } from "@/features/services/drugManagementService";
import { Time } from "@internationalized/date";
// Removed date-fns dependency; we format time manually to avoid extra deps

/**
 * BookPickupDialog Props
 * @property children Optional trigger button or element to open the dialog
 */
export type BookPickupDialogProps = {
  children?: React.ReactNode;
};

const schema = yup.object({
  drug_order_id: yup.string().required("Drug order is required"),
  pickup_date: yup.string().optional(), // ISO string constructed from date+time
  pickup_date_date: yup.string().optional(),
  pickup_date_time: yup.mixed<Time>().optional(),
});

export type BookPickupFormData = yup.InferType<typeof schema>;

/**
 * BookPickupDialog renders a form in a modal to create a new pickup record.
 * It lets the user select an eligible drug order and optionally specify a pickup date/time.
 *
 * @param {BookPickupDialogProps} props Component props
 * @returns {JSX.Element} Dialog with form for booking a pickup
 * @example
 * <BookPickupDialog>
 *   <Button>Book Pickup</Button>
 * </BookPickupDialog>
 */
export default function BookPickupDialog({ children }: BookPickupDialogProps) {
  const [open, setOpen] = React.useState(false);
  const toast = useToastHandler();

  // Eligible orders: server may use either "ready_for_pickup" or "pending_pickup"
  const { data: ordersResp, isLoading: ordersLoading, error: ordersError } = useGetDrugOrders({ status: "ready_for_pickup" });
  React.useEffect(() => {
    if (ordersError) {
      toast.error("Failed to load eligible orders", ordersError as unknown as Error);
    }
  }, [ordersError, toast]);
  const orders: DrugOrder[] = React.useMemo(() => {
    const raw = (ordersResp?.data?.results as DrugOrder[]) || [];
    // Guard for potential backend label differences
    return raw.filter((o) => ["ready_for_pickup", "pending_pickup"].includes(String(o.status)));
  }, [ordersResp?.data?.results]);

  const orderOptions = React.useMemo(
    () =>
      orders.map((o) => {
        const itemsCount = o.items?.length ?? 0;
        const when = o.pickup_date ? new Date(o.pickup_date).toLocaleString() : "No date";
        const patient = o.patient ?? o.id;
        return {
          value: o.id,
          label: `${patient} • ${when} • ${itemsCount} item${itemsCount === 1 ? "" : "s"}`,
        };
      }),
    [orders]
  );

  const { control, reset } = useForge<BookPickupFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      drug_order_id: "",
      pickup_date_date: "",
      pickup_date_time: undefined,
    },
  });

  const { mutateAsync: createPickup, isPending } = useCreatePickup();

  /**
   * Submit handler to create a pickup record.
   * Combines date and time fields into an ISO string if provided.
   * @param {BookPickupFormData} data Form data
   * @throws Shows toast error if API request fails
   */
  const handleSubmit = async (data: BookPickupFormData) => {
    try {
      let pickup_date: string | undefined = undefined;
      if (data.pickup_date_date && data.pickup_date_time) {
        // Convert Time object to HH:mm:ss and construct ISO from date and time
        const hh = String(data.pickup_date_time.hour).padStart(2, "0");
        const mm = String(data.pickup_date_time.minute).padStart(2, "0");
        const timeStr = `${hh}:${mm}:00`;
        const iso = new Date(`${data.pickup_date_date}T${timeStr}`);
        pickup_date = iso.toISOString();
      } else if (data.pickup_date_date && !data.pickup_date_time) {
        // Date provided without time; treat as start of day
        const iso = new Date(`${data.pickup_date_date}T00:00:00`);
        pickup_date = iso.toISOString();
      }

      await createPickup({
        drug_order_id: data.drug_order_id,
        ...(pickup_date ? { pickup_date } : {}),
      });

      toast.success("Success", "Pickup booked successfully");
      setOpen(false);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Error", (error as { message?: string })?.message ?? "Failed to book pickup");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Book Pickup</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Book Pickup</DialogTitle>
          <DialogDescription>
            Record a new drug pickup by selecting a ready order and optionally setting the pickup timestamp.
          </DialogDescription>
        </DialogHeader>

        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Forger
              name="drug_order_id"
              component={TextSelect}
              label="Drug Order"
              placeholder={ordersLoading ? "Loading orders..." : "Select drug order"}
              options={orderOptions}
              disabled={ordersLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="pickup_date_date"
                component={TextDateInput}
                label="Pickup Date (optional)"
                placeholder="YYYY-MM-DD"
              />
              <Forger
                name="pickup_date_time"
                component={TimeInput}
                label="Pickup Time (optional)"
                placeholder="HH:MM"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
              {isPending ? "Booking..." : "Book Pickup"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}