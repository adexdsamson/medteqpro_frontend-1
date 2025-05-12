import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getFormatCurrency = (amount: number) => {
  const naira = Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return naira.format(amount);
};