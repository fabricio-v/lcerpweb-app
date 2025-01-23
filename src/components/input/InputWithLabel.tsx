import { InfoIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";
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

export function InputWithLabel({ label, info, ...rest }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col-reverse gap-1.5">
      <Input
        {...rest}
        id={label}
        // className="peer" // Adiciona a classe peer para referência
      />
      <Label
        // htmlFor={label}
        className="peer-focus:text-lc-sunsetsky-ligh flex items-center gap-1 font-gothamBold text-[10px] text-foreground/70"
      >
        {label}
        {info && <CardInfo info={info} label={label} />}
      </Label>
    </div>
  );
}
