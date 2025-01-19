import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputWithLabel({ label, ...rest }: Props) {
  return (
    <div className="grid w-full items-center gap-1.5 md:w-[300px]">
      <Label htmlFor={label} className="text-[10px] text-lc-tertiary">
        {label}
      </Label>
      <Input {...rest} />
    </div>
  );
}
