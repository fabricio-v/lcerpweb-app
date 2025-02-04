import { Label } from "@/components/ui/label";
import { Switch as SwitchPrimitive } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import CardInfo from "./card/CardInfo";

interface Props extends React.ComponentProps<typeof SwitchPrimitive> {
  className?: string;
  classNameContainer?: string;
  title: string;
  label?: string;
  info?: string;
}

export function Switch({
  title,
  classNameContainer,
  disabled,
  label,
  info,
  ...rest
}: Props) {
  return (
    <div className="flex w-full flex-1 flex-col gap-1.5">
      {label && (
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
          </div>
        </Label>
      )}

      <div
        className={cn(
          "flex h-[36px] items-center space-x-2",
          classNameContainer,
        )}
      >
        <SwitchPrimitive {...rest} disabled={disabled} />
        <Label className="text-[12px] font-semibold text-foreground/70">
          {title}
        </Label>
      </div>
    </div>
  );
}
