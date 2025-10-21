/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterOptions } from "react-hook-form";

export type TextSelectProps = {
  name?: string;
  label?: string | any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange?: RegisterOptions["onChange"];
  onBlur?: RegisterOptions["onBlur"];
  value: RegisterOptions["value"];
  disabled?: boolean;
};

export const TextSelect = ({ label, ...rest }: TextSelectProps) => {
  return (
    <div className={rest?.containerClass ?? ""}>
      <Label
        htmlFor={typeof label === "string" ? label : ""}
        className="mb-1 sm:mb-2 block text-xs text-stone-900"
      >
        {label}
      </Label>

      <Select
        value={rest.value as string | undefined}
        onValueChange={(value) => {
          rest?.onChange?.(value as any);
          rest?.onBlur?.({} as any);
        }}
        onOpenChange={(open) => {
          if (!open) rest?.onBlur?.({} as any);
        }}
        disabled={rest.disabled}
      >
        <SelectTrigger className="w-full bg-white text-xs sm:text-sm !text-stone-600 sm:!h-10 touch-manipulation px-3 sm:px-4">
          <SelectValue
            className="!text-xs sm:!text-sm !text-gray-300 !truncate"
            placeholder={rest?.placeholder}
          />
        </SelectTrigger>
        <SelectContent className="max-h-60 sm:max-h-80">
          {rest?.options?.map((item) => (
            <SelectItem 
              key={item.value} 
              value={item.value}
              className="text-xs sm:text-sm py-2 sm:py-3 touch-manipulation"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {rest.error ? (
        <span className="text-xs text-red-500 mt-1 sm:mt-2">{rest.error}</span>
      ) : rest.helperText ? (
        <span className="text-xs text-gray-500 mt-1 sm:mt-2">{rest.helperText}</span>
      ) : null}
    </div>
  );
};
