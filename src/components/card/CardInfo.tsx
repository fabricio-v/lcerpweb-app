import { InfoIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export default ({ info, label }: { info: string; label: string }) => {
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
