import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
  disableFilter?: boolean;
  disabled?: boolean;
}

export const Combobox: React.FC<Props> = ({
  label,
  data,
  valueSelected,
  messageWhenNotfound = "Nenhum registro",
  onChangeValueSelected,
  disableFilter = false,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  return (
    <div className="flex w-full flex-1 flex-col gap-1.5">
      {label && (
        <Label
          htmlFor={label}
          className="text-[12px] font-semibold text-foreground/70"
        >
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border"
            disabled={disabled}
          >
            <p className="truncate">
              {valueSelected
                ? data.find((item) => item.value === valueSelected)?.label
                : "Selecione"}
            </p>
            <ChevronsUpDown className="ml-2 h-4 w-full shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            {!disableFilter && (
              <CommandInput
                datatype="label"
                placeholder="Digite para filtrar..."
                className="h-9"
                // onValueChange={() => {
                //   console.log("onValueChange");
                // }}
              />
            )}
            <CommandList>
              <CommandEmpty>{messageWhenNotfound}</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.value}
                    // value={item.value}
                    value={item.label}
                    onSelect={(currentValue: any) => {
                      onChangeValueSelected(item.value);
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
