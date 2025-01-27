"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Label } from "../ui/label";

export interface MonetaryInputProps
  extends Omit<NumericFormatProps, "customInput"> {
  className?: string;
  label: string;
}

const MonetaryInput = forwardRef<HTMLInputElement, MonetaryInputProps>(
  ({ className, label, ...props }, ref) => {
    const handleValueChange = (values: {
      value: string;
      floatValue?: number;
    }) => {
      const { floatValue } = values;

      // Impede valores maiores que 9.999.999,99
      if (floatValue !== undefined && floatValue > 9999999.99) {
        return false;
      }

      return true;
    };

    return (
      <div className="flex w-full flex-1 flex-col gap-1.5">
        <Label
          htmlFor={label}
          className="text-[12px] font-semibold text-foreground/70"
        >
          {label}
        </Label>
        <NumericFormat
          customInput={Input}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          allowLeadingZeros={false}
          getInputRef={ref}
          isAllowed={handleValueChange}
          placeholder={"R$ 0,00"}
          className={cn("text-right", className)}
          {...props}
        />
      </div>
    );
  },
);

MonetaryInput.displayName = "MonetaryInput";

export { MonetaryInput };
