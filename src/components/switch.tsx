import { Label } from "@/components/ui/label";
import { Switch as SwitchPrimitive } from "@/components/ui/switch";

interface Props extends React.ComponentProps<typeof SwitchPrimitive> {
  className?: string;
  title: string;
}

export function Switch({ title, ...rest }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <SwitchPrimitive {...rest} />
      <Label className="text-sm">{title}</Label>
    </div>
  );
}
