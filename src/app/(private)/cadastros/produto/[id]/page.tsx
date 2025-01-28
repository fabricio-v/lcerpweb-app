"use client";

import { Combobox } from "@/components/combobox/Combobox";
import { ComboboxSearchCfop } from "@/components/combobox/ComboboxSearchCfop";
import { AmountInput } from "@/components/input/AmountInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { Switch } from "@/components/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import {
  IProdutoInput,
  IProdutoPrecoAtacadoInput,
  IProdutoPrecosTabelaPrecoInput,
} from "@/interfaces/dto/ProdutoInput";
import { ICategoriaResponse } from "@/interfaces/response/CategoriaResponse";
import { ICestResponse } from "@/interfaces/response/CestResponse";
import { ICfopResponse } from "@/interfaces/response/CfopResponse";
import { ICstResponse } from "@/interfaces/response/CstResponse";
import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";
import { INcmResponse } from "@/interfaces/response/NcmResponse";
import { IOrigemResponse } from "@/interfaces/response/OrigemResponse";
import {
  IProdutoPrecoAtacadoResponse,
  IProdutoPrecoLeveXPagueYResponse,
  IProdutoPrecoTabelaPrecoResponse,
  IProdutoResponse,
} from "@/interfaces/response/ProdutoResponse";
import { ISubcategoriaResponse } from "@/interfaces/response/SubcategoriaResponse";
import { ITabelaPrecosResponse } from "@/interfaces/response/TabelaPrecosResponse";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import { requestCategoriasAvailables } from "@/services/requests/categoria";
import { requestCstAvailables } from "@/services/requests/cst";
import { requestEmpresasAvailables } from "@/services/requests/empresa";
import { requestFabricantesAvailables } from "@/services/requests/fabricante";
import { requestOrigemAvailables } from "@/services/requests/origem";
import {
  requestInsertOrUpdateProduto,
  requestProdutoById,
} from "@/services/requests/produto";
import { requestSubcategoriasAvailables } from "@/services/requests/subcategoria";
import { requestTabelaPrecosAvailables } from "@/services/requests/tabelaPrecos";
import { requestUnidadesAvailables } from "@/services/requests/unidade";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Breadcrumbs from "./components/breadcrumbs";
import CollapsibleSection from "./components/collapsibleSection";
import CompanyItem from "./components/companyItem";

import { ComboboxSearchCest } from "@/components/combobox/ComboboxSearchCest";
import { ComboboxSearchNcm } from "@/components/combobox/ComboboxSearchNcm";
import { PercentInput } from "@/components/input/PercentInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddItemListaAtacado from "./components/AddItemListaAtacado";
import AddItemListaLeveXPagueY from "./components/AddItemListaLeveXPagueY";
import AddItemListaTabelaPrecos from "./components/AddItemListaTabelaPrecos";
import ItemListaAtacado from "./components/ItemListaAtacado";
import ItemListaLeveXPagueY from "./components/ItemListaLeveXPagueY";
import ItemListaTabelaPrecos from "./components/ItemListaTabelaPrecos";

export const formProdutoSchema = z.object({
  id: z.number().optional(),
  ativo: z.boolean(),
  codigo: z.string().optional(),
  referencia: z.string().optional(),
  codigoBarras: z.string().optional(),
  nome: z.string().min(1, {
    message: "Informe o Nome do produto",
  }),
  descricao: z.string().optional(),
  categoria: z.string().min(1, {
    message: "Selecione uma Categoria",
  }),
  subcategoria: z.string().min(1, {
    message: "Selecione uma Subcategoria",
  }),
  fabricante: z.string().min(1, {
    message: "Selecione um Fabricante",
  }),
  unidade: z.string().min(1, {
    message: "Selecione uma Unidade",
  }),
  precoCusto: z.number().optional(),
  precoVenda: z
    .number({
      required_error: "Informe o preço de venda.", // Mensagem quando for undefined
      invalid_type_error: "Informe o preço de venda.", // Mensagem quando o tipo for inválido
    })
    .min(0.01, { message: "Informe o preço de venda." }),
  markupPerc: z.number().optional(),
  lucroPerc: z.number().optional(),
  cst: z.string().min(1, {
    message: "Selecione um CST",
  }),
  cfop: z.string().min(1, {
    message: "Selecione um CFOP",
  }),
  ncm: z.string().min(1, {
    message: "Selecione um NCM",
  }),
  cest: z.string().min(1, {
    message: "Selecione um CEST",
  }),
  origem: z.string().min(1, {
    message: "Selecione uma Origem",
  }),
  empresasSelecionadas: z.number().min(1, {
    message: "Selecione pelo menos uma empresa.",
  }),
});

function CadastrosProdutoNovo({ params }: any) {
  const { back } = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof formProdutoSchema>>({
    resolver: zodResolver(formProdutoSchema),
    defaultValues: {
      id: undefined,
      ativo: true,
      codigo: "",
      referencia: "",
      codigoBarras: "",
      nome: "",
      descricao: "",
      categoria: "",
      subcategoria: "",
      fabricante: "",
      unidade: "",
      precoVenda: undefined,
      precoCusto: undefined,
      markupPerc: undefined,
      lucroPerc: undefined,
      cst: "",
      cfop: "",
      ncm: "",
      cest: "",
      origem: "",
      empresasSelecionadas: 0,
    },
  });

  const { setValue, formState, getValues, clearErrors, reset } = form;

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionGrade, setIsShowSectionGrade] = useState(false);
  const [isShowSectionTributacao, setIsShowSectionTributacao] = useState(false);
  const [isShowSectionPrecos, setIsShowSectionPrecos] = useState(false);
  const [
    isShowSectionPrecoAtacadoEmbalagem,
    setIsShowSectionPrecoAtacadoEmbalagem,
  ] = useState(false);
  const [isShowSectionTabelaPreco, setIsShowSectionTabelaPreco] =
    useState(false);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(false);
  const [isShowSectionCodigosAdicionais, setIsShowSectionCodigosAdicionais] =
    useState(false);
  const [isShowSectionEmpresas, setIsShowSectionEmpresas] = useState(false);
  const [isShowSectionImagens, setIsShowSectionImagens] = useState(false);

  const [product, setProduct] = useState<IProdutoResponse>();

  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companiesList, setCompaniesList] = useState<IEmpresaResponse[]>([]);
  const [companiesSelecteds, setCompaniesSelecteds] = useState<number[]>([]);

  const [categoriesList, setCategoriesList] = useState<ICategoriaResponse[]>(
    [],
  );

  const [subcategoriesList, setSubcategoriesList] = useState<
    ISubcategoriaResponse[]
  >([]);

  const [manufacturesList, setManufacturesList] = useState<
    IFabricanteResponse[]
  >([]);

  const [unitsList, setUnitsList] = useState<IUnidadeResponse[]>([]);

  const [cstList, setCstList] = useState<ICstResponse[]>([]);
  const [origemList, setOrigemList] = useState<IOrigemResponse[]>([]);

  const [tabelaPrecoLista, setTabelaPrecoLista] = useState<
    ITabelaPrecosResponse[]
  >([]);

  const [cfopSelected, setCfopSelected] = useState<ICfopResponse>();
  const [ncmSelected, setNcmSelected] = useState<INcmResponse>();
  const [cestSelected, setCestSelected] = useState<ICestResponse>();

  const [grade, setGrade] = useState<string | number>("NAO");

  const [estoque, setEstoque] = useState<number>();

  const [precosTabelaPrecoLista, setPrecosTabelaPrecoLista] = useState<
    IProdutoPrecoTabelaPrecoResponse[]
  >([]);

  const [precosLeveXPagueYLista, setPrecosLeveXPagueYLista] = useState<
    IProdutoPrecoLeveXPagueYResponse[]
  >([]);

  const [precosAtacadoLista, setPrecosAtacadoLista] = useState<
    IProdutoPrecoAtacadoResponse[]
  >([]);

  const loadProduct = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const companySelectedId = await getCookieClient(
        CookiesKeys.COMPANY_SELECTED_ID,
      );

      const response = await requestProdutoById(
        params.id,
        Number(companySelectedId),
        token!.toString(),
      );

      if (response.status === 200) {
        setProduct(response.data);
      }
    } catch (error: any) {
      // back();

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

  const loadCategories = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestCategoriasAvailables(token!.toString());

      if (response.status === 200) {
        setCategoriesList(response.data);
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

  const loadSubcategories = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestSubcategoriasAvailables(token!.toString());

      if (response.status === 200) {
        setSubcategoriesList(response.data);
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

  const loadManufactures = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestFabricantesAvailables(token!.toString());

      if (response.status === 200) {
        setManufacturesList(response.data);
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

  const loadCompanies = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestEmpresasAvailables(token!.toString());

      if (response.status === 200) {
        setCompaniesList(response.data);
        setCompaniesSelecteds(response.data.map((company) => company.id));
      }
      setIsLoadingCompanies(false);
    } catch (error: any) {
      setIsLoadingCompanies(false);
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

  const loadUnits = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestUnidadesAvailables(token!.toString());

      if (response.status === 200) {
        setUnitsList(response.data);
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

  const loadCst = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestCstAvailables(token!.toString());

      if (response.status === 200) {
        setCstList(response.data);
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

  const loadOrigem = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestOrigemAvailables(token!.toString());

      if (response.status === 200) {
        setOrigemList(response.data);
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

  const loadTabelaPrecos = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestTabelaPrecosAvailables(token!.toString());

      if (response.status === 200) {
        setTabelaPrecoLista(response.data);
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

  const load = async () => {
    if (params.id !== String(null)) {
      await loadProduct();
    }

    await loadCompanies();
    await loadCategories();
    await loadSubcategories();
    await loadManufactures();
    await loadUnits();
    await loadCst();
    await loadOrigem();
    await loadTabelaPrecos();

    hideLoading();
  };

  const handleCustoBlur = () => {
    const precoCusto = form.watch("precoCusto");
    const precoVenda = form.watch("precoVenda");

    if (precoCusto && precoVenda) {
      const newMarkup = (precoVenda / precoCusto - 1) * 100;
      setValue("markupPerc", newMarkup);

      const newMargem =
        (((precoVenda as number) - (precoCusto as number)) / precoVenda) * 100;
      setValue("lucroPerc", newMargem);
    }
  };

  const handlePrecoVendaBlur = () => {
    const precoCusto = form.watch("precoCusto");
    const precoVenda = form.watch("precoVenda");

    if (precoVenda && precoCusto) {
      const newMarkup = (precoVenda / precoCusto - 1) * 100;
      setValue("markupPerc", newMarkup);

      const newLucro =
        (((precoVenda as number) - (precoCusto as number)) / precoVenda) * 100;
      setValue("lucroPerc", newLucro);
    } else if (precoVenda === 0) {
      setValue("markupPerc", 0.0);
      setValue("lucroPerc", 0.0);
    }
  };

  const handleMargemLucroBlur = () => {
    const lucroPerc = form.watch("lucroPerc");

    const precoCusto = form.watch("precoCusto");

    console.log(lucroPerc, precoCusto);

    if (lucroPerc && precoCusto) {
      const newPrecoVenda = (precoCusto as number) / (1 - lucroPerc / 100);
      setValue("precoVenda", newPrecoVenda);

      const newMarkup = (newPrecoVenda / precoCusto - 1) * 100;
      setValue("markupPerc", newMarkup);
    } else if (lucroPerc === 0) {
      setValue("precoVenda", precoCusto || 0);
      setValue("markupPerc", 0.0);
    }
  };

  const handleMarkupBlur = () => {
    const markupPerc = form.watch("markupPerc");
    const precoCusto = form.watch("precoCusto");

    if (markupPerc && precoCusto) {
      const newPrecoVenda = (precoCusto as number) + markupPerc;
      setValue("precoVenda", newPrecoVenda);

      const newMargem = (markupPerc / newPrecoVenda) * 100;
      setValue("lucroPerc", newMargem);
    } else if (markupPerc === 0) {
      setValue("precoVenda", precoCusto || 0);
      setValue("lucroPerc", 0.0);
    }
  };

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div className="flex flex-1 flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-4 pt-8">
            <div className="flex h-[150px] w-[150px] cursor-pointer items-center justify-center rounded-md border hover:border-[2px] hover:border-lc-sunsetsky-light hover:opacity-60">
              <p className="text-center text-xs opacity-20">
                Produto
                <br />
                sem imagem
              </p>
            </div>
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      classNameContainer="mb-4"
                      title={field.value === true ? "Ativo" : "Inativo"}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Código interno"
                        info="Codigo gerado automaticamente pelo sistema. Não pode ser alterado."
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigoBarras"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Código barras"
                        maxLength={15}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Referência"
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Código"
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-2 md:items-start">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel label="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel label="Descrição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-5">
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        label="Categoria"
                        data={categoriesList.map((item) => {
                          return { label: item.nome, value: item.id + "" };
                        })}
                        valueSelected={field.value}
                        onChangeValueSelected={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategoria"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        label="Subcategoria"
                        data={subcategoriesList.map((item) => {
                          return { label: item.nome, value: item.id + "" };
                        })}
                        valueSelected={field.value}
                        onChangeValueSelected={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fabricante"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        label="Fabricante"
                        data={manufacturesList.map((item) => {
                          return { label: item.nome, value: item.id + "" };
                        })}
                        valueSelected={field.value}
                        onChangeValueSelected={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidade"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        label="Unidade"
                        data={unitsList.map((item) => {
                          return {
                            label: item.descricao + " - " + item.nome,
                            value: item.id + "",
                          };
                        })}
                        valueSelected={field.value}
                        onChangeValueSelected={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Combobox
                label="Grade"
                data={[
                  { label: "SIM", value: "SIM" },
                  { label: "NÃO", value: "NAO" },
                ]}
                valueSelected={grade}
                onChangeValueSelected={setGrade}
                disableFilter
                // disabled
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-5">
              <AmountInput
                label="Estoque"
                value={estoque}
                onValueChange={(v) => {
                  setEstoque(v.floatValue);
                }}
              />

              <FormField
                control={form.control}
                name="precoCusto"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MonetaryInput
                        // {...field}
                        label="Custo"
                        onBlur={handleCustoBlur}
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v.floatValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precoVenda"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MonetaryInput
                        // {...field}
                        label="Preço venda"
                        onBlur={handlePrecoVendaBlur}
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v.floatValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="markupPerc"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PercentInput
                        // {...field}
                        label="Markup"
                        onBlur={handleMarkupBlur}
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v.floatValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lucroPerc"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PercentInput
                        // {...field}
                        label="Lucro"
                        value={field.value}
                        // onChange={field.onChange}
                        onBlur={handleMargemLucroBlur}
                        onValueChange={(v) => {
                          field.onChange(v.floatValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [
    isShowSectionGeral,
    categoriesList,
    subcategoriesList,
    manufacturesList,
    unitsList,
    estoque,
    grade,
    form,
  ]);

  const renderGrade = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGrade}
        title="Grade"
        changeShow={setIsShowSectionGrade}
      >
        <div></div>
      </CollapsibleSection>
    );
  }, [isShowSectionGrade]);

  const renderTributacao = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionTributacao}
        title="Tributação"
        changeShow={setIsShowSectionTributacao}
      >
        <div>
          <Tabs
            defaultValue="geral"
            // className="w-[400px]"
          >
            <TabsList className="w-full">
              <TabsTrigger value="geral" defaultChecked>
                Geral
              </TabsTrigger>
              <TabsTrigger value="icms">ICMS</TabsTrigger>
              <TabsTrigger value="pis">PIS</TabsTrigger>
              <TabsTrigger value="cofins">COFINS</TabsTrigger>
              <TabsTrigger value="ipi">IPI</TabsTrigger>
            </TabsList>
            <TabsContent value="geral">
              <div className="flex flex-1 flex-col gap-4 px-4">
                <FormField
                  control={form.control}
                  name="cst"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox
                          label="CST"
                          data={cstList.map((item) => {
                            return {
                              label: item.codigo + " - " + item.descricao,
                              value: item.id + "",
                            };
                          })}
                          valueSelected={field.value}
                          onChangeValueSelected={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cfop"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ComboboxSearchCfop
                          label="CFOP"
                          onChangeValueSelected={(cfop) => {
                            setCfopSelected(cfop);
                            setValue("cfop", cfop.id + "");
                            clearErrors("cfop");
                          }}
                          valueSelected={cfopSelected}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ncm"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ComboboxSearchNcm
                          label="NCM"
                          onChangeValueSelected={(ncm) => {
                            setNcmSelected(ncm);
                            setValue("ncm", ncm.id + "");
                            clearErrors("ncm");
                          }}
                          valueSelected={ncmSelected}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cest"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ComboboxSearchCest
                          label="CEST"
                          onChangeValueSelected={(cest) => {
                            setCestSelected(cest);
                            setValue("cest", cest.id + "");
                            clearErrors("cest");
                          }}
                          valueSelected={cestSelected}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origem"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox
                          label="Origem"
                          data={origemList.map((item) => {
                            return {
                              label: item.codigo + " - " + item.descricao,
                              value: item.id + "",
                            };
                          })}
                          valueSelected={field.value}
                          onChangeValueSelected={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="icms"></TabsContent>
            <TabsContent value="pis"></TabsContent>
            <TabsContent value="cofins"></TabsContent>
            <TabsContent value="ipi"></TabsContent>
          </Tabs>
        </div>
      </CollapsibleSection>
    );
  }, [
    isShowSectionTributacao,
    cstList,
    cfopSelected,
    ncmSelected,
    cestSelected,
    origemList,
  ]);

  const renderPrecosLeveXPagueY = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionPrecos}
        title="Preço por quantidade (Leve X pague Y)"
        changeShow={setIsShowSectionPrecos}
        isOpcional
      >
        <div>
          <AddItemListaLeveXPagueY
            precoCusto={form.watch("precoCusto") || 0}
            onAdd={(item) => {
              setPrecosLeveXPagueYLista((prev) => [...prev, item]);
            }}
          />

          <Separator />

          <div className="flex flex-1 flex-col gap-3 py-4">
            {precosLeveXPagueYLista.map((item, index) => (
              <ItemListaLeveXPagueY
                item={item}
                key={index}
                onRemove={() => {
                  setPrecosLeveXPagueYLista((prev) =>
                    prev.filter((item, index2) => index2 !== index),
                  );
                }}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionPrecos, precosLeveXPagueYLista, form.watch("precoCusto")]);

  const renderPrecosAtacadoEmbalagem = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionPrecoAtacadoEmbalagem}
        title="Preço por embalagem (Atacado)"
        changeShow={setIsShowSectionPrecoAtacadoEmbalagem}
        isOpcional
      >
        <div>
          <AddItemListaAtacado
            precoCusto={form.watch("precoCusto") || 0}
            onAdd={(item) => {
              setPrecosAtacadoLista((prev) => [...prev, item]);
            }}
            unidadeLista={unitsList}
          />

          <Separator />

          <div className="flex flex-1 flex-col gap-3 pt-4">
            {precosAtacadoLista.map((item, index) => (
              <ItemListaAtacado
                item={item}
                key={index}
                onRemove={() => {
                  setPrecosAtacadoLista((prev) =>
                    prev.filter((item, index2) => index2 !== index),
                  );
                }}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [
    isShowSectionPrecoAtacadoEmbalagem,
    precosAtacadoLista,
    form.watch("precoCusto"),
    unitsList,
  ]);

  const renderTabelaPreco = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionTabelaPreco}
        // isShow={true}
        title="Tabela de preço"
        changeShow={setIsShowSectionTabelaPreco}
        isOpcional
      >
        <div>
          <AddItemListaTabelaPrecos
            data={tabelaPrecoLista}
            precoCusto={form.watch("precoCusto") || 0}
            onAdd={(item) => {
              var existe = precosTabelaPrecoLista.find(
                (i) => i.tabelaPrecoId === item.tabelaPrecoId,
              );
              if (existe) {
                toast.warning(
                  `Tabela de preço ${existe.tabelaPrecoNome} já foi adicionada ao produto`,
                );
              } else {
                setPrecosTabelaPrecoLista((prev) => [...prev, item]);
              }
            }}
          />

          <Separator />

          <div className="flex flex-1 flex-col gap-3 py-4">
            {precosTabelaPrecoLista.map((item, index) => (
              <ItemListaTabelaPrecos
                item={item}
                key={index}
                onRemove={() => {
                  setPrecosTabelaPrecoLista((prev) =>
                    prev.filter((item, index2) => index2 !== index),
                  );
                }}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [
    isShowSectionTabelaPreco,
    precosTabelaPrecoLista,
    tabelaPrecoLista,
    form.watch("precoCusto"),
  ]);

  const renderAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionAdicionais}
        title="Adicionais"
        changeShow={setIsShowSectionAdicionais}
        isOpcional
      >
        <div>
          <Switch classNameContainer="mb-4" title="Pode receber desconto" />
          <Switch title="Pode ser vendido fracionado" />
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionAdicionais]);

  const renderCodigosAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionCodigosAdicionais}
        title="Códigos adicionais"
        changeShow={setIsShowSectionCodigosAdicionais}
        isOpcional
      >
        <div></div>
      </CollapsibleSection>
    );
  }, [isShowSectionCodigosAdicionais]);

  const renderEmpresas = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionEmpresas}
        title="Empresas"
        changeShow={setIsShowSectionEmpresas}
      >
        {isLoadingCompanies ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col flex-wrap gap-3 md:flex-row">
              {companiesList.map((company) => (
                <CompanyItem
                  company={company}
                  defaultValue={
                    params.id === String(null) ||
                    (product !== undefined &&
                      product.empresas.includes(company.id))
                  }
                  onChange={(company, isSelected) => {
                    if (isSelected) {
                      setCompaniesSelecteds((prev) => [...prev, company.id]);
                    } else {
                      setCompaniesSelecteds((prev) =>
                        prev.filter((id) => id !== company.id),
                      );
                    }
                  }}
                />
              ))}
            </div>
            <p>
              {formState.errors.empresasSelecionadas && (
                <p className="pt-4 text-[11px] font-medium text-destructive dark:text-red-300">
                  {formState.errors.empresasSelecionadas.message}
                </p>
              )}
            </p>
          </div>
        )}
      </CollapsibleSection>
    );
  }, [
    isShowSectionEmpresas,
    isLoadingCompanies,
    companiesList,
    product,
    formState.errors.empresasSelecionadas,
  ]);

  const renderImagens = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionImagens}
        title="Imagens"
        changeShow={setIsShowSectionImagens}
        isOpcional
      >
        <div></div>
      </CollapsibleSection>
    );
  }, [isShowSectionImagens]);

  const resetForm = () => {
    reset();
    setProduct(undefined);
    setCfopSelected(undefined);
    setNcmSelected(undefined);
    setCestSelected(undefined);
    setPrecosTabelaPrecoLista([]);
    setPrecosAtacadoLista([]);
    setPrecosLeveXPagueYLista([]);
  };

  const handleSave = async (data: z.infer<typeof formProdutoSchema>) => {
    try {
      const precosTabelaPrecoAux: IProdutoPrecosTabelaPrecoInput[] =
        precosTabelaPrecoLista.map((item) => ({
          ...item,
          idTabelaPreco: item.tabelaPrecoId,
        }));

      const precosAtacadoAux: IProdutoPrecoAtacadoInput[] =
        precosAtacadoLista.map((item) => ({
          ...item,
          idUnidade: item.unidade.id,
        }));

      const newProduto: IProdutoInput = {
        id: data.id || null,
        codigo: data.codigo || "",
        referencia: data.referencia || "",
        codigoBarras: data.codigoBarras || "",
        nome: data.nome,
        descricao: data.descricao || "",
        ativo: data.ativo,
        idCategoria: Number(data.categoria),
        idSubcategoria: Number(data.subcategoria),
        idFabricante: Number(data.fabricante),
        idUnidade: Number(data.unidade),
        precoCusto: data.precoCusto || 0,
        precoVenda: data.precoVenda,
        markup: data.markupPerc || 0,
        margemLucro: data.lucroPerc || 0,
        podeGrade: false,
        tipoGrade: null,
        empresas: companiesSelecteds,
        precosTabelaPreco: precosTabelaPrecoAux,
        precosLeveXPagueY: precosLeveXPagueYLista,
        precosAtacado: precosAtacadoAux,
        tributacao: {
          idCst: Number(data.cst),
          idCfop: Number(data.cfop),
          idNcm: Number(data.ncm),
          idCest: Number(data.cest),
          idOrigem: Number(data.origem),
        },
        variacoes: [],
        codigosAdicionais: [],
      };

      const token = await getCookieClient(CookiesKeys.TOKEN);
      const idEmpresa = await getCookieClient(CookiesKeys.COMPANY_SELECTED_ID);

      const response = await requestInsertOrUpdateProduto(
        newProduto,
        token!,
        idEmpresa!,
      );

      if (response.status === 200) {
        toast.success(
          `Produto ${data.id === null ? "cadastrado" : "atualizado"} com sucesso`,
        );
        if (data.id !== null) {
          back();
        } else {
          resetForm();
        }
      }
    } catch (error: any) {
      if (error?.response?.status < 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  };

  useEffect(() => {
    showLoading();
    setTimeout(() => {
      load();
    }, 500);
  }, []);

  useEffect(() => {
    if (product !== undefined) {
      setValue("id", Number(params.id));
      setValue("ativo", product.ativo);
      setValue("codigo", product.codigo);
      setValue("referencia", product.referencia);
      setValue("codigoBarras", product.codigoBarras);
      setValue("nome", product.nome);
      setValue("descricao", product.descricao);
      setValue("categoria", product.categoria.id + "");
      setValue("subcategoria", product.subcategoria.id + "");
      setValue("fabricante", product.fabricante.id + "");
      setValue("unidade", product.unidade.id + "");
      setValue("cst", product.tributacao.cst.id + "");
      setValue("origem", product.tributacao.origem.id + "");
      setValue("cfop", product.tributacao.cfop.id + "");
      setValue("ncm", product.tributacao.ncm.id + "");
      setValue("cest", product.tributacao.cest.id + "");
      setValue("precoVenda", product.precoVenda);
      setValue("precoCusto", product.precoCusto);
      setValue("markupPerc", product.markup);
      setValue("lucroPerc", product.margemLucro);

      setPrecosTabelaPrecoLista(product.precosTabelaPreco);
      setPrecosLeveXPagueYLista(product.precosLeveXPagueY);
      setPrecosAtacadoLista(product.precosAtacado);

      setCfopSelected(product.tributacao.cfop);
      setNcmSelected(product.tributacao.ncm);
      setCestSelected(product.tributacao.cest);

      setCompaniesSelecteds(product.empresas);
    }
  }, [product, params]);

  useEffect(() => {
    setValue("empresasSelecionadas", companiesSelecteds.length);

    if (companiesSelecteds.length === 0) {
      form.setError("empresasSelecionadas", {
        message: "Selecione ao menos uma empresa",
      });
    } else {
      form.clearErrors("empresasSelecionadas");
    }
  }, [companiesSelecteds]);

  return (
    <main className="flex h-[calc(100vh-50px)] flex-1 flex-col overflow-scroll overflow-x-hidden bg-lc-gray px-3 py-4 md:pl-8 md:pr-5">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumbs />
      </div>

      <div className="mt-3 flex flex-col rounded-lg bg-white p-4 dark:bg-lc-tertiary">
        {/* TITLE */}
        <div className="flex gap-1.5 pb-3">
          <button
            onClick={() => {
              back();
            }}
          >
            <ChevronLeft size={25} />
          </button>
          <h1>
            {params.id === String(null) ? "Novo produto" : "Editar produto"}
          </h1>
        </div>

        <Separator className="my-3" />
        <div className="flex flex-1 flex-col">
          <Form {...form}>
            <form
              onKeyDown={(event: React.KeyboardEvent<HTMLFormElement>) => {
                if (event.key === "Enter") {
                  event.preventDefault(); // Previne o envio do formulário
                }
              }}
              className="flex flex-1 flex-col"
              onSubmit={form.handleSubmit(handleSave, (errors) => {
                console.log(errors);
                toast.warning("Preencha todos os campos obrigatórios");

                if (
                  errors.cst ||
                  errors.origem ||
                  errors.cfop ||
                  errors.ncm ||
                  errors.cest
                ) {
                  setIsShowSectionTributacao(true);
                }

                if (errors.empresasSelecionadas) {
                  setIsShowSectionEmpresas(true);
                }
              })}
            >
              {renderGeral}

              {grade === "SIM" && renderGrade}

              {renderTributacao}

              {renderEmpresas}

              {renderTabelaPreco}

              {renderPrecosLeveXPagueY}

              {renderPrecosAtacadoEmbalagem}

              {renderAdicionais}

              {renderCodigosAdicionais}

              {renderImagens}

              <Separator className="my-4" />

              <div className="flex flex-col-reverse justify-end gap-2 pt-2 md:flex-row">
                <Button
                  type="button"
                  className="md:w-28"
                  variant={"outline"}
                  onClick={() => {
                    back();
                  }}
                >
                  <ChevronLeft />
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="md:w-28"
                  variant={"outline"}
                  onClick={resetForm}
                >
                  Limpar
                </Button>
                <Button type="submit" className="md:w-28">
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default CadastrosProdutoNovo;
