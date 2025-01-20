"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Label } from "../ui/label";

export interface AmountInputProps
  extends Omit<NumericFormatProps, "customInput"> {
  className?: string;
  label: string;
}

const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ className, label, ...props }, ref) => {
    const handleValueChange = (values: {
      value: string;
      floatValue?: number;
    }) => {
      const { floatValue } = values;

      // Impede valores maiores que 9.999.999,99
      if (floatValue !== undefined && floatValue > 9999999.999) {
        return false;
      }

      return true;
    };

    return (
      <div className="flex w-full flex-1 flex-col gap-1.5">
        <Label htmlFor={label} className="text-[10px] text-lc-tertiary">
          {label}
        </Label>
        <NumericFormat
          customInput={Input}
          thousandSeparator=""
          decimalSeparator=","
          prefix=""
          decimalScale={3}
          fixedDecimalScale
          allowNegative={false}
          allowLeadingZeros={false}
          getInputRef={ref}
          isAllowed={handleValueChange}
          placeholder={"0,000"}
          className={cn("text-right", className)}
          {...props}
        />
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";

export { AmountInput };
