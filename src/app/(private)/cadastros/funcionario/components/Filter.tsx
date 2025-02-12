"use client";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ListFilterIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Filter({
  onSearch,
  onAdvancedSearch,
}: {
  onSearch: (value: string) => void;
  onAdvancedSearch: (status: string | null, nome: string | null) => void;
}) {
  const isMobile = useIsMobile();

  const [searchValue, setSearchValue] = useState("");

  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>();

  const [status, setStatus] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(searchValue);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (containerRef.current) {
      // Atualiza a largura do popover com base na largura da div pai
      setPopoverWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handleAvancedSearch = (formData: FormData) => {
    const nome = formData.get("nome") ? (formData.get("nome") as string) : null;
    onAdvancedSearch(status, nome);
    setIsOpenPopover(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex max-w-[600px] flex-1 items-end gap-2"
    >
      <InputWithLabel
        label="Pesquisa por nome"
        placeholder="Digite aqui para pesquisar"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        readOnly={isOpenPopover}
      />
      <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            variant={isMobile ? "outline" : "ghost"}
            className="text-0 p-2"
          >
            <ListFilterIcon />
            <span className="hidden md:block">Pesquisa avançada</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="overflow-hidden"
          style={{
            width: popoverWidth,
            maxHeight: !isMobile ? "60vh" : "50vh", // Cresce até 80% da altura da viewport
            overflowY: "auto", // Ativa o scroll vertical, se necessário
          }}
        >
          <h1>Pesquisa avançada</h1>

          <Separator className="my-2 mt-4" />

          <form action={handleAvancedSearch} className="my-4 gap-2">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <InputWithLabel name="nome" label="Nome" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="peer-focus:text-lc-sunsetsky-ligh flex items-center gap-1 font-gothamBold text-[10px] text-foreground/70">
                  Status
                </Label>
                <ToggleGroup
                  className="w-min select-none rounded-md border"
                  type="single"
                  defaultValue="todos"
                  onValueChange={(value) => {
                    if (value === "ADMITIDO") {
                      setStatus("ADMITIDO");
                    } else if (value === "FERIAS") {
                      setStatus("FERIAS");
                    } else if (value === "DEMITIDO") {
                      setStatus("DEMITIDO");
                    } else {
                      setStatus(null);
                    }
                  }}
                >
                  <ToggleGroupItem value="todos" disabled={status === null}>
                    Todos
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="ativos"
                    disabled={status === "ADMITIDO"}
                  >
                    Admitidos
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="inativos"
                    disabled={status === "DEMITIDO"}
                  >
                    Demitidos
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="inativos"
                    disabled={status === "FERIAS"}
                  >
                    Férias
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <Button type="submit">
                <Search />
                Pesquisar
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Filter;
