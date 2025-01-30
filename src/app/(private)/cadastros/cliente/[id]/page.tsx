"use client";

import { Combobox } from "@/components/combobox/Combobox";
import { InputCorreios } from "@/components/input/InputCorreios";
import { InputReceitaFederal } from "@/components/input/InputReceitaFederal";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Switch } from "@/components/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "./components/Breadcrumbs";
import CollapsibleSection from "./components/CollapsibleSection";

export const formClienteSchema = z.object({
  id: z.number().optional(),
  ativo: z.boolean(),
  nome: z.string().min(1, {
    message: "Informe o Nome do cliente",
  }),
  razaoSocial: z.string().optional(),
  cpfCnpj: z.string().optional(),
  tipoPessoaFisicaJuridica: z.string(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  referencia: z.string().optional(),
  cep: z.string().optional(),
  cidade: z.string().min(1, {
    message: "Selecione uma Cidade",
  }),
  estado: z.string().min(1, {
    message: "Selecione um Estado",
  }),
});

function CadastrosClienteNovo({ params }: any) {
  const { back } = useRouter();

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(false);
  const [isShowSectionFiliacao, setIsShowSectionFiliacao] = useState(false);
  const [isShowSectionEmpresa, setIsShowSectionEmpresa] = useState(false);
  const [isShowSectionConjuge, setIsShowSectionConjuge] = useState(false);
  const [isShowSectionAvalista, setIsShowSectionAvalista] = useState(false);
  const [isShowSectionFoto, setIsShowSectionFoto] = useState(false);
  const [isShowSectionObservacao, setIsShowSectionObservacao] = useState(false);

  const form = useForm<z.infer<typeof formClienteSchema>>({
    resolver: zodResolver(formClienteSchema),
    defaultValues: {
      id: undefined,
      ativo: true,
      nome: "",
      razaoSocial: "",
      cpfCnpj: "",
      tipoPessoaFisicaJuridica: "F",
      endereco: "",
      numero: "",
      bairro: "",
      referencia: "",
      cep: "",
      cidade: "",
      estado: "",
    },
  });

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-[minmax(auto,150px)_minmax(auto,300px)_minmax(auto,300px)_minmax(auto,300px)]">
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
              name="tipoPessoaFisicaJuridica"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={[
                        { label: "Pessoa Física", value: "F" },
                        { label: "Pessoa Jurídica", value: "J" },
                      ]}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Tipo pessoa"
                      disableFilter
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputReceitaFederal
                      label={
                        form.watch("tipoPessoaFisicaJuridica") === "F"
                          ? "CPF"
                          : "CNPJ"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={[
                        { label: "Não contribuinte", value: "9" },
                        { label: "Contribuinte ICMS", value: "1" },
                        { label: "Contribuinte isento", value: "2" },
                      ]}
                      valueSelected={""}
                      onChangeValueSelected={() => {}}
                      label="Identificador IE"
                      disableFilter
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-[1fr_1fr_200px]">
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
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Razão Social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Apelido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-6">
            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="RG"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "J"}
                      info="Campo específico para Pessoa Física"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Emissão"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "J"}
                      info="Campo específico para Pessoa Física"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Órgão"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "J"}
                      info="Campo específico para Pessoa Física"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="IE"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "F"}
                      info="Campo específico para Pessoa Jurídica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="IM"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "F"}
                      info="Campo específico para Pessoa Jurídica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="ISUF"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "F"}
                      info="Campo específico para Pessoa Jurídica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-[1fr_120px_1fr_200px]">
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Endereço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputCorreios label="CEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-[1fr_250px_1fr]">
            <FormField
              control={form.control}
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Referência" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      label="Estado"
                      data={[]}
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
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      label="Cidade"
                      data={[]}
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

          <div className="flex flex-1 flex-col gap-4 pb-2 md:grid md:grid-cols-[minmax(auto,150px)_minmax(auto,150px)_minmax(auto,150px)_1fr_1fr]">
            <FormField
              control={form.control}
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Contato 1" {...field} />
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
                    <InputWithLabel label="Contato 2" {...field} />
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
                    <InputWithLabel label="Contato 3" {...field} />
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
                    <InputWithLabel label="Email 1" {...field} />
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
                    <InputWithLabel label="Email 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionGeral, form]);

  const renderAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionAdicionais}
        title="Adicionais"
        changeShow={setIsShowSectionAdicionais}
        isOpcional
      >
        <div>
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    classNameContainer=""
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
      </CollapsibleSection>
    );
  }, [isShowSectionAdicionais, form]);

  const renderFiliacao = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionFiliacao}
        title="Filiacao"
        changeShow={setIsShowSectionFiliacao}
        isOpcional
      >
        <></>
      </CollapsibleSection>
    );
  }, [isShowSectionFiliacao, form]);

  const renderEmpresa = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionEmpresa}
        title="Empresa"
        changeShow={setIsShowSectionEmpresa}
        isOpcional
      >
        <></>
      </CollapsibleSection>
    );
  }, [isShowSectionEmpresa, form]);

  const renderConjuge = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionConjuge}
        title="Conjuge"
        changeShow={setIsShowSectionConjuge}
        isOpcional
      >
        <></>
      </CollapsibleSection>
    );
  }, [isShowSectionConjuge, form]);

  const renderAvalista = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionAvalista}
        title="Avalista"
        changeShow={setIsShowSectionAvalista}
        isOpcional
      >
        <></>
      </CollapsibleSection>
    );
  }, [isShowSectionAvalista, form]);

  const renderFoto = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionFoto}
        title="Foto"
        changeShow={setIsShowSectionFoto}
        isOpcional
      >
        <></>
      </CollapsibleSection>
    );
  }, [isShowSectionFoto, form]);

  const renderObservacao = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionObservacao}
        title="Observação"
        changeShow={setIsShowSectionObservacao}
        isOpcional
      >
        <Textarea />
      </CollapsibleSection>
    );
  }, [isShowSectionObservacao, form]);

  const resetForm = () => {
    form.reset();
  };

  const handleSave = async (data: z.infer<typeof formClienteSchema>) => {};

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-scroll overflow-x-hidden bg-lc-gray-light px-3 py-4 md:pl-8 md:pr-5">
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
            {params.id === String(null) ? "Novo cliente" : "Editar cliente"}
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
                toast.warning("Preencha todos os campos obrigatórios");
              })}
            >
              {renderGeral}

              {renderAdicionais}

              {renderFiliacao}

              {renderEmpresa}

              {renderConjuge}

              {renderAvalista}

              {renderFoto}

              {renderObservacao}

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

export default CadastrosClienteNovo;
