import { InfoIcon, Search } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Input } from "../ui/input";
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

export function InputReceitaFederal({
  label,
  info,
  maxLength,
  value,
  onBlur,
  onFocus,
  ...rest
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="flex w-full flex-1 items-center gap-1.5">
      <div className="flex w-full flex-1 flex-col-reverse gap-1.5">
        <Input
          {...rest}
          id={label}
          maxLength={maxLength}
          value={value}
          onFocus={(e) => {
            handleFocus();
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            handleBlur();
            onBlur && onBlur(e);
          }}
          // className="peer" // Adiciona a classe peer para referência
        />
        <Label
          // htmlFor={label}
          className="peer-focus:text-lc-sunsetsky-ligh flex items-center gap-1 text-[12px] font-semibold text-foreground/70"
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
      <Button type="button" size={"icon"} variant={"ghost"} className="mt-6">
        <Search />
      </Button>
    </div>
  );
}
