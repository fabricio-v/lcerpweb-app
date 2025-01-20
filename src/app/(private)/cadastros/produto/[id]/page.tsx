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
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, CircleMinus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Breadcrumbs from "./components/breadcrumbs";
import CollapsibleSection from "./components/collapsibleSection";

function CadastrosProdutoNovo({ params }: any) {
  const { back } = useRouter();
  const isMobile = useIsMobile();

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionGrade, setIsShowSectionGrade] = useState(false);
  const [isShowSectionTributacao, setIsShowSectionTributacao] = useState(false);
  const [isShowSectionPrecos, setIsShowSectionPrecos] = useState(false);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(false);
  const [isShowSectionEmpresas, setIsShowSectionEmpresas] = useState(false);

  const [grade, setGrade] = useState<"SIM" | "NAO">("NAO");

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div>
          <div className="flex flex-1 flex-col gap-4 pb-2 md:flex-row">
            <InputWithLabel label="Código interno" />
            <InputWithLabel label="Código" />
            <InputWithLabel label="Referência" />
            <InputWithLabel label="Código barras" />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:flex-row">
            <InputWithLabel label="Nome" />
            <InputWithLabel label="Descrição" />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:flex-row">
            <Combobox
              label="Categoria"
              data={[]}
              valueSelected=""
              onChangeValueSelected={() => {}}
            />
            <Combobox
              label="Subcategoria"
              data={[]}
              valueSelected=""
              onChangeValueSelected={() => {}}
            />
            <Combobox
              label="Fabricante"
              data={[]}
              valueSelected=""
              onChangeValueSelected={() => {}}
            />
            <Combobox
              label="Unidade"
              data={[]}
              valueSelected=""
              onChangeValueSelected={() => {}}
            />
            <Combobox
              label="Grade"
              data={[]}
              valueSelected=""
              onChangeValueSelected={() => {}}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:flex-row">
            <AmountInput label="Estoque" />
            <MonetaryInput label="Custo" />
            <MonetaryInput label="Preço venda" />
            <PercentInput label="Markup" />
            <PercentInput label="Lucro" />
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionGeral]);

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
          <div className="flex flex-1 flex-col items-end gap-4 pb-4 md:flex-row">
            <Combobox
              label="Tabela de preços"
              data={[]}
              valueSelected=""
              onChangeValueSelected={() => {}}
            />
            <MonetaryInput label="Quantidade mínima" />
            <MonetaryInput label="Preço de venda" />
            <PercentInput label="Markup" />
            <PercentInput label="Lucro" />
            <Button
              size={isMobile ? "default" : "icon"}
              variant={"outline"}
              className={isMobile ? "w-full" : ""}
            >
              <Plus />
              {isMobile && "Adicionar preço"}
            </Button>
          </div>

          <Separator />

          <div className="flex flex-1 flex-col gap-3 py-4">
            <div className="flex flex-1 flex-col items-end gap-4 md:flex-row">
              <Combobox
                label={isMobile ? "Tabela de preços" : ""}
                data={[]}
                valueSelected=""
                onChangeValueSelected={() => {}}
              />
              <MonetaryInput label={isMobile ? "Quantidade mínima" : ""} />
              <MonetaryInput label={isMobile ? "Preço de venda" : ""} />
              <PercentInput label={isMobile ? "Markup" : ""} />
              <PercentInput label={isMobile ? "Lucro" : ""} />

              <Button
                size={isMobile ? "default" : "icon"}
                variant={"ghost"}
                className={isMobile ? "w-full text-red-600" : ""}
              >
                <CircleMinus color="red" />
                {isMobile && "Remover preço"}
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionPrecos]);

  const renderAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionAdicionais}
        title="Adicionais"
        changeShow={setIsShowSectionAdicionais}
        isOpcional
      >
        <div>
          <Switch title="Pode receber desconto" />
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
        isOpcional
      >
        <div></div>
      </CollapsibleSection>
    );
  }, [isShowSectionEmpresas]);

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
