import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  isShow: boolean;
  changeShow: (show: boolean) => void;
  children: React.ReactNode;
  isOpcional?: boolean;
}

function CollapsibleSection({
  title,
  isShow,
  isOpcional = false,
  changeShow,
  children,
}: Props) {
  return (
    <Collapsible open={isShow} onOpenChange={changeShow}>
      <CollapsibleTrigger asChild>
        <div className="mb-2 flex cursor-pointer items-center justify-between gap-2 rounded-md bg-lc-gray px-4 py-2">
          <div>
            <span className="font-gothamBold text-sm">{title}</span>
            {isOpcional && (
              <span className="text-lc-tertiar pl-2 text-xs">(Opcional)</span>
            )}
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isShow ? "" : "-rotate-90"
            }`}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-4 pb-10 pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default CollapsibleSection;
