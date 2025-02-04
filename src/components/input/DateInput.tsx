import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useRef, useState } from "react";
import InputMask, { ReactInputMask } from "react-input-mask";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Label } from "../ui/label";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  info?: string;
}

const CardInfo = ({ info, label }: { info: string; label: string }) => {
  return (
    <HoverCard openDelay={500}>
      <HoverCardTrigger asChild>
        <InfoIcon size={12} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col justify-between gap-1">
          <h1 className="text-sm font-semibold">{label}</h1>
          <p>{info}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const DateInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      info,
      maxLength,
      value,
      disabled,
      className,
      onBlur,
      onFocus,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [date, setDate] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
      onChange && onChange(e);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const inputRef = useRef<ReactInputMask>(null);

    return (
      <div className="flex w-full flex-1 flex-col-reverse gap-1.5">
        <InputMask
          {...rest}
          id={label}
          ref={ref || inputRef}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lc-sunsetsky-light disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          type="text"
          maskChar={""}
          mask="99/99/9999"
          value={date}
          onChange={handleChange}
          maxLength={maxLength}
          onFocus={(e) => {
            handleFocus();
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            handleBlur();
            onBlur && onBlur(e);
          }}
          disabled={disabled}
        />

        <Label
          // htmlFor={label}
          className={cn(
            "peer-focus:text-lc-sunsetsky-ligh flex items-center gap-1 text-[12px] font-semibold text-foreground/70",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <div className="flex flex-1 items-end justify-between">
            <div className="flex items-center gap-1">
              {label}
              {info && <CardInfo info={info} label={label} />}
            </div>
            {maxLength && isFocused && (
              <p className="text-right text-[10px] font-light text-muted-foreground/50">
                {value?.toString().length}/{maxLength}
              </p>
            )}
          </div>
        </Label>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export { DateInput };
