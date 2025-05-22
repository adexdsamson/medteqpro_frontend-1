/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Children, cloneElement, createElement, useImperativeHandle } from "react";
import { FieldValues, FormProvider } from "react-hook-form";
import { ForgeProps } from "../types";
import { isButtonSlot, isElementSlot, isInputSlot, isNestedSlot } from "../utils";
import { Forger } from "../Forger";

export const Forge = <TFieldValues extends FieldValues = FieldValues>({
  className,
  children,
  onSubmit,
  control,
  ref,
  isNative
}: ForgeProps<TFieldValues>) => {
  const updatedChildren = Children.map(children, (child) => {
    if (isButtonSlot(child)) {
      return cloneElement(child, {
        onClick: control.handleSubmit(onSubmit),
      } as any);
    }

    if (isInputSlot(child) && isNative) {
      return createElement(child.type, {
        ...{
          ...(child.props as any),
          ...control.register((child.props as any).name),
          key: (child as any).props.name,
        },
      });
    }

    if (isNestedSlot(child)) {
      return createElement(child.type, {
        ...{
          ...(child.props as any),
          children: Children.map((child as any).props.children, (child) => {
            return isButtonSlot(child)
              ? cloneElement(child, {
                  onClick: control.handleSubmit(onSubmit),
                } as any)
              : child;
          }),
        },
      });
    }

    return isElementSlot(child)
      ? cloneElement(child, { control } as any)
      : undefined;
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        onSubmit: control.handleSubmit(onSubmit),
      };
    },
    [onSubmit, control]
  );

  const renderFieldProps = control.hasFields
    ? control?.fields?.map((inputs, index) => <Forger key={index} {...inputs} />)
    : null;

  return (
    <FormProvider {...control as unknown as any} control={control as unknown as any}>
      <div className={className}>
        {renderFieldProps}
        {updatedChildren}
      </div>
    </FormProvider>
  );
};
