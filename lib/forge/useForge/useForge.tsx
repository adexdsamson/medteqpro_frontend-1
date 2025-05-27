"use client";

import { FieldValues, createFormControl, useFormState } from "react-hook-form";
import { UseForgeProps, UseForgeResult } from "../types";

/**
 * A custom hook that returns a form component and form control functions using the `react-hook-form` library.
 * @param {ForgeFormProps} options - The options for the form.
 * @returns {UseForgeFormResult} - The form control functions and the form component.
 */
export const useForge = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldProps = unknown
>({
  defaultValues,
  resolver,
  mode,
  fields,
  ...props
}: UseForgeProps<TFieldProps, TFieldValues>): UseForgeResult<TFieldValues> => {
  const { formControl: _, ...methods } = createFormControl<TFieldValues>({
    defaultValues,
    resolver,
    mode,
    ...props,
  });
  const formState = useFormState({ control: _.control })

  const hasFields =
    (typeof fields !== "undefined" && fields?.length !== 0) ?? false;

  return { ...methods, formState, control: { ...methods.control, hasFields, fields } };
};
