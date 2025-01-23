"use client";

import { Combobox } from "@/components/combobox/Combobox";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Switch } from "@/components/switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ListFilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Filter({
  onSearch,
  changeIsLoading,
}: {
  onSearch: (value: string) => void;
  changeIsLoading: (value: boolean) => void;
}) {
  const isMobile = useIsMobile();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400); // Ajuste o tempo de debounce aqui

    return () => {
      clearTimeout(handler); // Limpa o timeout anterior ao digitar novamente
    };
  }, [searchValue]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (containerRef.current) {
      // Atualiza a largura do popover com base na largura da div pai
      setPopoverWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex max-w-[600px] flex-1 items-end gap-2"
    >
      <InputWithLabel
        label="Pesquisa por nome, barras, código interno, código e referência"
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
            maxHeight: !isMobile ? "75vh" : "50vh", // Cresce até 80% da altura da viewport
            overflowY: "auto", // Ativa o scroll vertical, se necessário
          }}
        >
          <h1>Pesquisa avançada</h1>
          {/* <div className="flex items-center justify-between">
            <Button
              size={"icon"}
              variant={"ghost"}
              className=""
              onClick={() => setIsOpenPopover(false)}
            >
              <X />
            </Button>
          </div> */}

          <Separator className="my-2 mt-4" />

          <div className="my-4 gap-2">
            <div className="flex flex-col gap-3">
              <Switch title="Ativo" className="flex" />

              <div className="flex gap-3">
                <InputWithLabel label="Nome" />

                <InputWithLabel label="Descrição" />
              </div>

              <div className="flex gap-3">
                <InputWithLabel label="código interno" />

                <InputWithLabel label="Código barras" />
              </div>

              <div className="flex gap-3">
                <InputWithLabel label="Referência" />

                <InputWithLabel label="Código" />
              </div>

              <div className="flex gap-3">
                <Combobox
                  label="Categoria"
                  data={[]}
                  valueSelected={""}
                  onChangeValueSelected={() => {}}
                />

                <Combobox
                  label="Subcategoria"
                  data={[]}
                  valueSelected={""}
                  onChangeValueSelected={() => {}}
                />
              </div>

              <div className="flex gap-3">
                <Combobox
                  label="Fabricante"
                  data={[]}
                  valueSelected={""}
                  onChangeValueSelected={() => {}}
                />

                <Combobox
                  label="Unidade"
                  data={[]}
                  valueSelected={""}
                  onChangeValueSelected={() => {}}
                />
              </div>

              {/* <ComboboxSearchCfop
                label="CFOP"
                valueSelected={undefined}
                onChangeValueSelected={() => {}}
              />
              <ComboboxSearchNcm
                label="NCM"
                valueSelected={undefined}
                onChangeValueSelected={() => {}}
              /> */}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end">
            <Button>Pesquisar</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Filter;
