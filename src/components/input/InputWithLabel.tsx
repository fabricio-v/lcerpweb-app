import { InputHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputWithLabel({ label, ...rest }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col-reverse gap-1.5">
      <Input
        {...rest}
        id={label}
        className="peer" // Adiciona a classe peer para referência
      />
      <Label
        htmlFor={label}
        className="text-[10px] text-lc-tertiary peer-focus:text-lc-sunsetsky-light"
      >
        {label}
      </Label>
    </div>
  );
}
