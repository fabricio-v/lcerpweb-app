// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { forwardRef, ForwardRefExoticComponent } from "react";
// import * as RPNInput from "react-phone-number-input";
// import { Label } from "../ui/label";

// type PhoneInputProps = Omit<
//   React.ComponentProps<"input">,
//   "onChange" | "value" | "ref"
// > &
//   Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
//     onChange?: (value: RPNInput.Value) => void;
//     className?: string;
//     label: string;
//   };

// const PhoneInput: ForwardRefExoticComponent<PhoneInputProps> = forwardRef<
//   React.ElementRef<typeof RPNInput.default>,
//   PhoneInputProps
// >(({ className, onChange, label, value, ...props }, ref) => {
//   const formattedValue =
//     typeof value === "string" && !value.startsWith("+55")
//       ? `+55${value}`
//       : value;

//   return (
//     <div className="flex w-full flex-1 flex-col gap-1.5">
//       <Label
//         htmlFor={label}
//         className="text-[12px] font-semibold text-foreground/70"
//       >
//         {label}
//       </Label>
//       <RPNInput.default
//         ref={ref}
//         defaultCountry="BR"
//         className={cn("flex", className)}
//         countrySelectComponent={() => {
//           return null;
//         }}
//         inputComponent={InputComponent}
//         smartCaret={false}
//         value={formattedValue}
//         onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
//         {...props}
//       />
//     </div>
//   );
// });

// const InputComponent = forwardRef<
//   HTMLInputElement,
//   React.ComponentProps<"input">
// >(({ className, ...props }, ref) => (
//   <Input className={className} maxLength={15} {...props} ref={ref} />
// ));
// InputComponent.displayName = "InputComponent";

// PhoneInput.displayName = "PhoneInput";

// export { PhoneInput };

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { PatternFormat, type NumericFormatProps } from "react-number-format";
import { Label } from "../ui/label";

export interface PhoneInputProps
  extends Omit<NumericFormatProps, "customInput"> {
  className?: string;
  label: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, value, ...props }, ref) => {
    return (
      <div className="flex w-full flex-1 flex-col gap-1.5">
        <Label
          htmlFor={label}
          className="text-[12px] font-semibold text-foreground/70"
        >
          {label}
        </Label>
        <PatternFormat
          format={"(##) #####-####"}
          mask=""
          allowEmptyFormatting={false}
          customInput={Input}
          getInputRef={ref}
          value={value}
          className={cn("text-left", className)}
          {...props}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
