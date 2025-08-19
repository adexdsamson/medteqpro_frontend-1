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
  value: RegisterOptions["value"];
  disabled?: boolean;
};

export const TextSelect = ({ label, ...rest }: TextSelectProps) => {
  return (
    <div className={rest?.containerClass ?? ""}>
      <Label
        htmlFor={typeof label === "string" ? label : ""}
        className="mb-1 sm:mb-2 block text-sm sm:text-base text-stone-900"
      >
        {label}
      </Label>

      <Select
        defaultValue={rest.value}
        onValueChange={(value) =>
          rest?.onChange?.({ target: { name: rest.name ?? "", value } })
        }
        disabled={rest.disabled}
      >
        <SelectTrigger className="w-full bg-white text-sm sm:text-base !text-stone-600 !h-11 sm:!h-12 touch-manipulation min-h-[44px] sm:min-h-[48px] px-3 sm:px-4">
          <SelectValue
            className="!text-sm sm:!text-base !text-gray-300"
            placeholder={rest?.placeholder}
          />
        </SelectTrigger>
        <SelectContent className="max-h-60 sm:max-h-80">
          {rest?.options?.map((item) => (
            <SelectItem 
              key={item.value} 
              value={item.value}
              className="text-sm sm:text-base py-2 sm:py-3 touch-manipulation"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {rest.error ? (
        <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2">{rest.error}</span>
      ) : rest.helperText ? (
        <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{rest.helperText}</span>
      ) : null}
    </div>
  );
};
