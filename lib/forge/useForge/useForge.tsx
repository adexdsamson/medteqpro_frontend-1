'use strict';

import {
  FieldValues,
  createFormControl
} from "react-hook-form";
import { ForgeProps, UseForgeResult } from "../types";


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
}: ForgeProps<TFieldProps, TFieldValues>): UseForgeResult<TFieldValues> => {
  const { formControl: _, ...methods } = createFormControl<TFieldValues>({ defaultValues, resolver, mode, ...props });

  const hasFields =
    typeof fieldProps !== "undefined" && fieldProps?.length !== 0 && _;

  return { ...methods, control: { ...methods.control, hasFields, fields } };
};
