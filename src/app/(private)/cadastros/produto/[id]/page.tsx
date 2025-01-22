"use client";

import { Combobox } from "@/components/combobox/Combobox";
import { AmountInput } from "@/components/input/AmountInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Switch } from "@/components/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { ICategoriaResponse } from "@/interfaces/CategoriaResponse";
import { IEmpresaResponse } from "@/interfaces/EmpresaResponse";
import { IFabricanteResponse } from "@/interfaces/FabricanteResponse";
import {
  IProdutoPrecoResponse,
  IProdutoResponse,
} from "@/interfaces/ProdutoResponse";
import { ISubcategoriaResponse } from "@/interfaces/SubcategoriaResponse";
import { ITabelaPrecosResponse } from "@/interfaces/TabelaPrecosResponse";
import { IUnidadeResponse } from "@/interfaces/UnidadeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import { requestCategoriasAvailables } from "@/services/requests/categoria";
import { requestEmpresasAvailables } from "@/services/requests/empresa";
import { requestFabricantesAvailables } from "@/services/requests/fabricante";
import { requestProdutoById } from "@/services/requests/produto";
import { requestSubcategoriasAvailables } from "@/services/requests/subcategoria";
import { requestTabelaPrecosAvailables } from "@/services/requests/tabelaPrecos";
import { requestUnidadesAvailables } from "@/services/requests/unidade";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddItemListaPrecos from "./components/addItemListaPrecos";
import Breadcrumbs from "./components/breadcrumbs";
import CollapsibleSection from "./components/collapsibleSection";
import CompanyItem from "./components/companyItem";
import ItemListaPrecos from "./components/itemListaPrecos";

function CadastrosProdutoNovo({ params }: any) {
  const { back } = useRouter();
  const isMobile = useIsMobile();
  const { showLoading, hideLoading } = useLoadingStore();

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionGrade, setIsShowSectionGrade] = useState(false);
  const [isShowSectionTributacao, setIsShowSectionTributacao] = useState(false);
  const [isShowSectionPrecos, setIsShowSectionPrecos] = useState(false);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(false);
  const [isShowSectionEmpresas, setIsShowSectionEmpresas] = useState(false);
  const [isShowSectionImagens, setIsShowSectionImagens] = useState(false);

  const [product, setProduct] = useState<IProdutoResponse>();

  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companiesList, setCompaniesList] = useState<IEmpresaResponse[]>([]);

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

  const [tabelaPrecoLista, setTabelaPrecoLista] = useState<
    ITabelaPrecosResponse[]
  >([]);

  const [tabelaPrecoDisponiveisLista, setTabelaPrecoDisponiveisLista] =
    useState<ITabelaPrecosResponse[]>([]);

  const [categorySelectedId, setCategorySelectedId] = useState<string | number>(
    "",
  );
  const [subcategorySelectedId, setSubcategorySelectedId] = useState<
    string | number
  >("");
  const [manufactureSelectedId, setManufactureSelectedId] = useState<
    string | number
  >("");
  const [unitSelectedId, setUnitSelectedId] = useState<string | number>("");
  const [tabelaPrecoSelectedId, setTabelaPrecoSelectedId] = useState<
    string | number
  >("");

  const [grade, setGrade] = useState<string | number>("NAO");

  const [estoque, setEstoque] = useState<number>();
  const [precoVenda, setPrecoVenda] = useState<number>();
  const [precoCusto, setPrecoCusto] = useState<number>();
  const [markupPerc, setMarkupPerc] = useState<number>();
  const [lucroPerc, setLucroPerc] = useState<number>();

  const [precosAdicionaisLista, setPrecosAdicionaisLista] = useState<
    IProdutoPrecoResponse[]
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
      back();

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

  const loadTabelaPrecos = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestTabelaPrecosAvailables(token!.toString());

      if (response.status === 200) {
        setTabelaPrecoLista(response.data);
        setTabelaPrecoDisponiveisLista(response.data);
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
    showLoading();
    if (params.id !== String(null)) {
      await loadProduct();
    }

    await loadCompanies();
    await loadCategories();
    await loadSubcategories();
    await loadManufactures();
    await loadUnits();
    await loadTabelaPrecos();

    hideLoading();
  };

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div>
          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-4">
            <InputWithLabel
              label="Código interno"
              info="Codigo gerado automaticamente pelo sistema. Não pode ser alterado."
              value={product?.id}
              disabled
            />
            <InputWithLabel
              label="Código barras"
              value={product?.codigoBarras}
            />
            <InputWithLabel label="Referência" value={product?.referencia} />
            <InputWithLabel label="Código" value={product?.codigo} />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-2">
            <InputWithLabel label="Nome" value={product?.nome} />
            <InputWithLabel label="Descrição" value={product?.descricao} />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-5">
            <Combobox
              label="Categoria"
              data={categoriesList.map((item) => {
                return { label: item.nome, value: item.id + "" };
              })}
              valueSelected={categorySelectedId}
              onChangeValueSelected={setCategorySelectedId}
            />
            <Combobox
              label="Subcategoria"
              data={subcategoriesList.map((item) => {
                return { label: item.nome, value: item.id + "" };
              })}
              valueSelected={subcategorySelectedId}
              onChangeValueSelected={setSubcategorySelectedId}
            />
            <Combobox
              label="Fabricante"
              data={manufacturesList.map((item) => {
                return { label: item.nome, value: item.id + "" };
              })}
              valueSelected={manufactureSelectedId}
              onChangeValueSelected={setManufactureSelectedId}
            />
            <Combobox
              label="Unidade"
              data={unitsList.map((item) => {
                return {
                  label: item.descricao + " - " + item.nome,
                  value: item.id + "",
                };
              })}
              valueSelected={unitSelectedId}
              onChangeValueSelected={setUnitSelectedId}
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
              disabled
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
            <MonetaryInput
              label="Custo"
              value={precoCusto}
              onValueChange={(v) => {
                setPrecoCusto(v.floatValue);
              }}
            />
            <MonetaryInput
              label="Preço venda"
              value={precoVenda}
              onValueChange={(v) => {
                setPrecoVenda(v.floatValue);
              }}
            />
            <PercentInput
              label="Markup"
              value={markupPerc}
              onValueChange={(v) => {
                setMarkupPerc(v.floatValue);
              }}
            />
            <PercentInput
              label="Lucro"
              value={lucroPerc}
              onValueChange={(v) => {
                setLucroPerc(v.floatValue);
              }}
            />
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [
    isShowSectionGeral,
    categoriesList,
    categorySelectedId,
    subcategoriesList,
    subcategorySelectedId,
    manufacturesList,
    manufactureSelectedId,
    unitsList,
    unitSelectedId,
    precoCusto,
    precoVenda,
    markupPerc,
    lucroPerc,
    estoque,
    grade,
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
              <div className="flex flex-1 flex-col gap-4 px-4 md:flex-row">
                <Combobox
                  label="CST"
                  data={[]}
                  valueSelected=""
                  onChangeValueSelected={() => {}}
                />
                <Combobox
                  label="CFOP"
                  data={[]}
                  valueSelected=""
                  onChangeValueSelected={() => {}}
                />
                <Combobox
                  label="NCM"
                  data={[]}
                  valueSelected=""
                  onChangeValueSelected={() => {}}
                />
                <Combobox
                  label="CEST"
                  data={[]}
                  valueSelected=""
                  onChangeValueSelected={() => {}}
                />
                <Combobox
                  label="Origem"
                  data={[]}
                  valueSelected=""
                  onChangeValueSelected={() => {}}
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
  }, [isShowSectionTributacao]);

  const renderPrecos = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionPrecos}
        title="Preços"
        changeShow={setIsShowSectionPrecos}
        isOpcional
      >
        <div>
          <AddItemListaPrecos
            data={tabelaPrecoDisponiveisLista}
            onAdd={(item) => {
              var existe = precosAdicionaisLista.find(
                (i) => i.tabelaPrecoId === item.tabelaPrecoId,
              );
              if (existe) {
                toast.warning(
                  `Tabela de preço ${existe.tabelaPrecoNome} já foi adicionada ao produto`,
                );
              } else {
                setPrecosAdicionaisLista((prev) => [...prev, item]);
              }
            }}
          />

          <Separator />

          <div className="flex flex-1 flex-col gap-3 py-4">
            {precosAdicionaisLista.map((item, index) => (
              <ItemListaPrecos
                item={item}
                key={index}
                onRemove={() => {
                  setPrecosAdicionaisLista((prev) =>
                    prev.filter((item, index2) => index2 !== index),
                  );
                }}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionPrecos, precosAdicionaisLista, tabelaPrecoDisponiveisLista]);

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
          <div className="flex flex-col flex-wrap gap-3 md:flex-row">
            {companiesList.map((company) => (
              <CompanyItem
                company={company}
                defaultValue={
                  params.id === String(null) ||
                  (product !== undefined &&
                    product.empresas.includes(company.id))
                }
              />
            ))}
          </div>
        )}
      </CollapsibleSection>
    );
  }, [isShowSectionEmpresas, isLoadingCompanies, companiesList, product]);

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

  useEffect(() => {
    load();
    console.log("entrou no useEffect de load");
  }, []);

  useEffect(() => {
    if (product !== undefined) {
      setCategorySelectedId(product.categoria.id + "");
      setSubcategorySelectedId(product.subcategoria.id + "");
      setManufactureSelectedId(product.fabricante.id + "");
      setUnitSelectedId(product.unidade.id + "");

      setPrecosAdicionaisLista([]);

      // let tabelasPrecosEmUso: number[] = [];

      product.precos.forEach((price) => {
        // tabelasPrecosEmUso.push(price.tabelaPrecoId);

        if (price.tabelaPrecoId === 1) {
          setPrecoCusto(price.preco);
        } else if (price.tabelaPrecoId === 2) {
          setPrecoVenda(price.preco);
          setMarkupPerc(price.markup);
          setLucroPerc(price.margemLucro);
        } else {
          setPrecosAdicionaisLista((precosAdicionaisLista) => [
            ...precosAdicionaisLista,
            price,
          ]);
        }
      });

      // setTabelaPrecoDisponiveisLista(
      //   tabelaPrecoLista.filter(
      //     (item) => !tabelasPrecosEmUso.includes(item.id),
      //   ),
      // );
    }
  }, [product /*tabelaPrecoLista*/]);

  return (
    <main className="flex h-[calc(100vh-50px)] flex-1 flex-col overflow-auto overflow-x-hidden p-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumbs />
      </div>

      {/* TITLE */}
      <div className="flex gap-1.5 py-3">
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

      <div className="flex flex-1 flex-col overflow-clip md:overflow-auto">
        {renderGeral}

        {grade === "SIM" && renderGrade}

        {renderTributacao}

        {renderPrecos}

        {renderAdicionais}

        {renderEmpresas}

        {renderImagens}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
        <Button
          className="md:w-28"
          variant={"secondary"}
          onClick={() => {
            back();
          }}
        >
          Voltar
        </Button>
        <Button className="md:w-28" variant={"secondary"}>
          Limpar
        </Button>
        <Button className="md:w-28">Salvar</Button>
      </div>
    </main>
  );
}

export default CadastrosProdutoNovo;
