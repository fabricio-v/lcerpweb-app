import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { forwardRef } from "react";
import { PatternFormat, type NumericFormatProps } from "react-number-format";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export interface CepInputProps extends Omit<NumericFormatProps, "customInput"> {
  className?: string;
  label: string;
}

const CepInput = forwardRef<HTMLInputElement, CepInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex w-full flex-1 items-center gap-1.5">
        <div className="flex w-full flex-1 flex-col gap-1.5">
          <Label
            htmlFor={label}
            className="text-[12px] font-semibold text-foreground/70"
          >
            {label}
          </Label>
          <PatternFormat
            format={"#####-###"}
            mask=""
            allowEmptyFormatting={false}
            customInput={Input}
            getInputRef={ref}
            className={cn("text-left", className)}
            {...props}
          />
        </div>
        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          className="mt-6"
          info="Consultar CEP"
        >
          <Search />
        </Button>
      </div>
    );
  },
);

CepInput.displayName = "CepInput";

export { CepInput };
