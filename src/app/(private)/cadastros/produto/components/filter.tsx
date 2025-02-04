"use client";

import { Combobox } from "@/components/combobox/Combobox";
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
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { ICategoriaResponse } from "@/interfaces/response/CategoriaResponse";
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";
import { ISubcategoriaResponse } from "@/interfaces/response/SubcategoriaResponse";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestCategoriasAvailables } from "@/services/requests/categoria";
import { requestFabricantesAvailables } from "@/services/requests/fabricante";
import { requestSubcategoriasAvailables } from "@/services/requests/subcategoria";
import { requestUnidadesAvailables } from "@/services/requests/unidade";
import { buildMessageException } from "@/utils/Funcoes";
import { ListFilterIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function Filter({
  onSearch,
  onAdvancedSearch,
}: {
  onSearch: (value: string) => void;
  onAdvancedSearch: (
    ativo: boolean | null,
    nome: string | null,
    descricao: string | null,
    codigoInterno: string | null,
    codigoBarras: string | null,
    codigo: string | null,
    referencia: string | null,
    idCategoria: number | null,
    idSubcategoria: number | null,
    idFabricante: number | null,
    idUnidade: number | null,
  ) => void;
}) {
  const isMobile = useIsMobile();

  const [isListasCarregadas, setIsListasCarregadas] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>();

  const [status, setStatus] = useState<boolean | null>(null);
  const [idCategoria, setIdCategoria] = useState<any>();
  const [idSubcategoria, setIdSubcategoria] = useState<any>();
  const [idFabricante, setIdFabricante] = useState<any>();
  const [idUnidade, setIdUnidade] = useState<any>();

  const [categoriasLista, setCategoriasLista] = useState<ICategoriaResponse[]>(
    [],
  );

  const [subcategoriasLista, setSubcategoriasLista] = useState<
    ISubcategoriaResponse[]
  >([]);

  const [fabricantesLista, setFabricantesLista] = useState<
    IFabricanteResponse[]
  >([]);

  const [unidadesLista, setUnidadesLista] = useState<IUnidadeResponse[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 1000); // Ajuste o tempo de debounce aqui

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

  const carregaCategorias = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestCategoriasAvailables(token!.toString());

      if (response.status === 200) {
        setCategoriasLista(response.data);
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

  const carregaSubcategorias = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestSubcategoriasAvailables(token!.toString());

      if (response.status === 200) {
        setSubcategoriasLista(response.data);
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

  const carregaFabricantes = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestFabricantesAvailables(token!.toString());

      if (response.status === 200) {
        setFabricantesLista(response.data);
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

  const carregaUnidades = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestUnidadesAvailables(token!.toString());

      if (response.status === 200) {
        setUnidadesLista(response.data);
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

  const handleAvancedSearch = (formData: FormData) => {
    const nome = formData.get("nome") ? (formData.get("nome") as string) : null;

    const descricao = formData.get("descricao")
      ? (formData.get("descricao") as string)
      : null;

    const codigoInterno = formData.get("codigoInterno")
      ? (formData.get("codigoInterno") as string)
      : null;

    const codigoBarras = formData.get("codigoBarras")
      ? (formData.get("codigoBarras") as string)
      : null;

    const codigo = formData.get("codigo")
      ? (formData.get("codigo") as string)
      : null;

    const referencia = formData.get("referencia")
      ? (formData.get("referencia") as string)
      : null;

    onAdvancedSearch(
      status,
      nome,
      descricao,
      codigoInterno,
      codigoBarras,
      codigo,
      referencia,
      idCategoria || null,
      idSubcategoria || null,
      idFabricante || null,
      idUnidade || null,
    );
    setIsOpenPopover(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex max-w-[600px] flex-1 items-end gap-2"
    >
      <InputWithLabel
        // label="Pesquisa por nome, barras, código interno, código e referência"
        label="Pesquisa por nome e códigos"
        placeholder="Digite aqui para pesquisar"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        readOnly={isOpenPopover}
      />
      <Popover
        open={isOpenPopover}
        onOpenChange={(open) => {
          if (open && !isListasCarregadas) {
            setIsListasCarregadas(true);
            carregaCategorias();
            carregaSubcategorias();
            carregaFabricantes();
            carregaUnidades();
          }

          setIsOpenPopover(open);
        }}
      >
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

                <InputWithLabel name="descricao" label="Descrição" />
              </div>

              <div className="flex gap-3">
                <InputWithLabel name="codigoInterno" label="código interno" />

                <InputWithLabel name="codigoBarras" label="Código barras" />
              </div>

              <div className="flex gap-3">
                <InputWithLabel name="referencia" label="Referência" />

                <InputWithLabel name="codigo" label="Código" />
              </div>

              <div className="flex gap-3">
                <Combobox
                  label="Categoria"
                  data={categoriasLista.map((item) => {
                    return { label: item.nome, value: item.id + "" };
                  })}
                  valueSelected={idCategoria}
                  onChangeValueSelected={setIdCategoria}
                />

                <Combobox
                  label="Subcategoria"
                  data={subcategoriasLista.map((item) => {
                    return { label: item.nome, value: item.id + "" };
                  })}
                  valueSelected={idSubcategoria}
                  onChangeValueSelected={setIdSubcategoria}
                />
              </div>

              <div className="flex gap-3">
                <Combobox
                  label="Fabricante"
                  data={fabricantesLista.map((item) => {
                    return { label: item.nome, value: item.id + "" };
                  })}
                  valueSelected={idFabricante}
                  onChangeValueSelected={setIdFabricante}
                />

                <Combobox
                  label="Unidade"
                  data={unidadesLista.map((item) => {
                    return { label: item.nome, value: item.id + "" };
                  })}
                  valueSelected={idUnidade}
                  onChangeValueSelected={setIdUnidade}
                />
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
                    if (value === "todos") {
                      setStatus(null);
                    } else if (value === "ativos") {
                      setStatus(true);
                    } else {
                      setStatus(false);
                    }
                  }}
                >
                  <ToggleGroupItem value="todos" disabled={status === null}>
                    Todos
                  </ToggleGroupItem>
                  <ToggleGroupItem value="ativos" disabled={status === true}>
                    Ativos
                  </ToggleGroupItem>
                  <ToggleGroupItem value="inativos" disabled={status === false}>
                    Inativos
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
