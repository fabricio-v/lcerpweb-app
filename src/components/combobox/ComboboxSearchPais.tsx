import { Check, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

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
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import useSearchPaises from "@/hooks/useSearchPaises";
import { IPaisResponse } from "@/interfaces/response/PaisResponse";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export interface ComboboxDataProps {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  valueSelected: IPaisResponse | undefined;
  messageWhenNotfound?: string;
  onChangeValueSelected: (cfop: IPaisResponse) => void;
  disabled?: boolean;
}

export const ComboboxSearchPais: React.FC<Props> = ({
  label,
  messageWhenNotfound = "Nenhum registro",
  onChangeValueSelected,
  disabled = false,
  valueSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { loadPaises, dataPaises, loading } = useSearchPaises();

  const debouncedSearchTerm = useDebouncedValue(searchValue);

  useEffect(() => {
    loadPaises(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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

      <Popover
        open={open}
        onOpenChange={(v) => {
          setSearchValue("");
          setOpen(v);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border shadow-sm"
            disabled={disabled}
          >
            <p className="truncate">
              {valueSelected ? valueSelected.nome : "Selecione"}
            </p>
            <Search className="ml-2 h-4 w-full shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              datatype="label"
              placeholder="Digite para pesquisar..."
              className="h-9"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {loading && (
                <CommandEmpty className="flex h-10 items-center justify-center">
                  <Loader2 className="animate-spin text-center" size={20} />
                </CommandEmpty>
              )}
              {dataPaises.paises.length === 0 &&
                searchValue.length > 0 &&
                !loading && <CommandEmpty>{messageWhenNotfound}</CommandEmpty>}
              <CommandGroup>
                {dataPaises.paises.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id + "  " + item.nome}
                    onSelect={(currentValue: any) => {
                      onChangeValueSelected(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        valueSelected?.id === item.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.nome}
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
