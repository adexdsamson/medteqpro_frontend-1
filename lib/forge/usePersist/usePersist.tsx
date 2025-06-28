/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSubscribe } from "../useSubscribe";
import { Control, FieldValues, EventType } from "react-hook-form";

type ForgePersist<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  handler: (
    payload: FieldValues,
    formState: {
      name?: string | undefined;
      type?: EventType | undefined;
      values: FieldValues;
    }
  ) => void;
};

export const usePersist = <TFieldProps extends FieldValues = FieldValues>({
  control,
  handler,
}: ForgePersist<TFieldProps>) => {
  useSubscribe({
    disabled: false,
    subject: (control as any)._subjects.state,
    next: (formState) => {
      handler((formState as any).values, (formState as any));
    },
  });
};
