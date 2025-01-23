import { Check, Search } from "lucide-react";
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
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { INcmResponse } from "@/interfaces/response/NcmResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { cn } from "@/lib/utils";
import { requestNcmByFilter } from "@/services/requests/ncm";
import { buildMessageException } from "@/utils/Funcoes";
import { toast } from "sonner";
import { Label } from "../ui/label";

export interface ComboboxDataProps {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  valueSelected: INcmResponse | undefined;
  messageWhenNotfound?: string;
  onChangeValueSelected: (ncm: INcmResponse) => void;
  disabled?: boolean;
}

export const ComboboxSearchNcm: React.FC<Props> = ({
  label,
  messageWhenNotfound = "Nenhum registro",
  onChangeValueSelected,
  disabled = false,
  valueSelected,
}) => {
  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [data, setData] = useState<INcmResponse[]>([]);

  const searchNcm = async (search: string) => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestNcmByFilter(token!.toString(), search);

      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error: any) {
      if (error?.response?.status < 500) {
        toast.warning(Messages.TOAST_INFO_TITLE, {
          description: buildMessageException(error),
        });
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchValue);
    }, 400); // Ajuste o tempo de debounce aqui

    return () => {
      clearTimeout(handler); // Limpa o timeout anterior ao digitar novamente
    };
  }, [searchValue]);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
      searchNcm(debouncedSearchTerm);
    } else if (debouncedSearchTerm.trim().length === 0) {
      setData([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="flex w-full flex-1 flex-col gap-1.5">
      {label && (
        <Label htmlFor={label} className="text-[10px] text-lc-tertiary">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <p className="truncate">
              {valueSelected
                ? valueSelected.codigo + " - " + valueSelected.descricao
                : "Selecione"}
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
              <CommandEmpty>{messageWhenNotfound}</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id + " " + item.codigo + " " + item.descricao}
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
                    {item.codigo + " - " + item.descricao}
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
