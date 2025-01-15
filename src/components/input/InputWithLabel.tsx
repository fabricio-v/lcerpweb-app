import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputWithLabel({ label, ...rest }: Props) {
  return (
    <div className="grid items-center gap-1.5">
      <Label htmlFor={label} className="text-xs text-lc-tertiary">
        {label}
      </Label>
      <Input {...rest} />
    </div>
  );
}
