import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export interface ComboboxDataProps {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  data: ComboboxDataProps[];
  valueSelected: string | number;
  messageWhenNotfound?: string;
  onChangeValueSelected: (value: string | number) => void;
}

export const Combobox: React.FC<Props> = ({
  label,
  data,
  valueSelected,
  messageWhenNotfound = "Nenhum registro encontrado",
  onChangeValueSelected,
}) => {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  return (
    <div className="grid items-center gap-1.5">
      {label && <Label htmlFor={label}>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <p>
              {valueSelected
                ? data.find((item) => item.value === valueSelected)?.label
                : "Selecione"}
            </p>
            <ChevronsUpDown className="ml-2 h-4 w-full shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-ful p-0">
          <Command>
            {/* <CommandInput placeholder="Digite aqui para filtrar..." /> */}
            <CommandList>
              <CommandEmpty>{messageWhenNotfound}</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue: any) => {
                      onChangeValueSelected(
                        currentValue === valueSelected ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        valueSelected === item.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
