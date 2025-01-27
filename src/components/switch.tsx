import { Label } from "@/components/ui/label";
import { Switch as SwitchPrimitive } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<typeof SwitchPrimitive> {
  className?: string;
  classNameContainer?: string;
  title: string;
}

export function Switch({ title, classNameContainer, ...rest }: Props) {
  return (
    <div className={cn("flex items-center space-x-2", classNameContainer)}>
      <SwitchPrimitive {...rest} />
      <Label className="text-[12px] font-semibold">{title}</Label>
    </div>
  );
}
