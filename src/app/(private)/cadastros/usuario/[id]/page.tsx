"use client";

import CollapsibleSection from "@/components/CollapsibleSection";
import { Combobox } from "@/components/combobox/Combobox";
import { ComboboxSearchCidade } from "@/components/combobox/ComboboxSearchCidade";
import { ComboboxSearchPais } from "@/components/combobox/ComboboxSearchPais";
import { CepInput } from "@/components/input/CepInput";
import { CpfCnpjInput } from "@/components/input/CpfCnpjInput";
import { DateInput } from "@/components/input/DateInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { PhoneInput } from "@/components/input/PhoneInput";
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
import { EstadoCivilPessoa } from "@/constants/EstadoCivilPessoa";
import { SexoPessoa } from "@/constants/SexoPessoa";
import useSearchEstados from "@/hooks/useSearchEstados";
import { ICidadeResponse } from "@/interfaces/response/CidadeResponse";
import { IPaisResponse } from "@/interfaces/response/PaisResponse";
import { isValidDateDDMMYYYY } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "../components/Breadcrumbs";

export const formUsuarioSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, {
    message: "Informe o Nome do usuário",
  }),
  grupo: z.string().min(1, {
    message: "Selecione o grupo",
  }),
  status: z.string().min(1, {
    message: "Selecione o status",
  }),
  emailAcesso: z.string(),
  senha: z.string(),
  senhaConfirmacao: z.string(),

  tipoPessoa: z.string(),
  cpfCnpj: z.string().optional(),
  apelido: z.string().optional(),
  rg: z.string().optional(),
  rgOrgao: z.string().optional(),
  rgDataEmissao: z
    .string()
    .optional()
    .refine((val) => !val || isValidDateDDMMYYYY(val), {
      message: "Data inválida. Deve ter o formato DD/MM/YYYY",
    }),
  dataNascimento: z
    .string()
    .optional()
    .refine((val) => !val || isValidDateDDMMYYYY(val), {
      message: "Data inválida",
    }),
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
  pais: z.string().min(1, {
    message: "Selecione um País",
  }),

  contato1: z.string().optional(),
  contato2: z.string().optional(),
  contato3: z.string().optional(),
  email: z.string().optional(),
  email2: z.string().optional(),

  sexo: z.string(),
  estadoCivil: z.string(),
});

function UsuariosNovo({ params }: any) {
  const { back } = useRouter();

  const form = useForm<z.infer<typeof formUsuarioSchema>>({
    resolver: zodResolver(formUsuarioSchema),
    defaultValues: {
      id: undefined,
      nome: "",
      grupo: "",
      status: "ADMITIDO",
      emailAcesso: "",
      senha: "",
      senhaConfirmacao: "",

      tipoPessoa: "F",
      apelido: "",
      cpfCnpj: "",
      rg: "",
      rgOrgao: "",
      rgDataEmissao: "",
      dataNascimento: "",

      endereco: "",
      numero: "",
      bairro: "",
      referencia: "",
      cep: "",
      cidade: "",
      estado: "",
      pais: "1058",

      contato1: "",
      contato2: "",
      contato3: "",
      email: "",
      email2: "",

      sexo: SexoPessoa[0].value,
      estadoCivil: EstadoCivilPessoa[0].value,
    },
  });

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(true);
  const [isShowSectionFuncionario, setIsShowSectionFuncionario] =
    useState(true);
  const [isShowSectionPermissoes, setIsShowSectionPermissoes] = useState(true);
  const [isShowSectionObservacao, setIsShowSectionObservacao] = useState(false);

  const [paisSelected, setPaisSelected] = useState<IPaisResponse | undefined>();

  const [cidadeSelected, setCidadeSelected] = useState<
    ICidadeResponse | undefined
  >();

  const { dataEstados, loadEstados } = useSearchEstados();

  const resetForm = () => {
    form.reset();
  };

  const handleSave = async (data: z.infer<typeof formUsuarioSchema>) => {};

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[minmax(auto,150px)_1fr_1fr_1fr]">
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
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Nome" maxLength={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grupo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={[]}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Grupo"
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={[
                        { label: "Admitido", value: "ADMITIDO" },
                        { label: "Demitido", value: "DEMITIDO" },
                        { label: "Férias", value: "FERIAS" },
                      ]}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Status"
                      disableFilter
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="emailAcesso"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      type="email"
                      label="Email"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      type="password"
                      label="Senha"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senhaConfirmacao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      type="password"
                      label="Confirme sua senha"
                      maxLength={100}
                      {...field}
                    />
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
      >
        <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4">
          <FormField
            control={form.control}
            name="apelido"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PercentInput label="Desconto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionAdicionais, form]);

  const renderFuncionario = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionFuncionario}
        title="Dados do funcionário"
        changeShow={setIsShowSectionFuncionario}
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[1fr_1fr_1fr_1fr]">
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CpfCnpjInput
                      typeInput={
                        form.watch("tipoPessoa") === "F" ? "cpf" : "cnpj"
                      }
                      label={form.watch("tipoPessoa") === "F" ? "CPF" : "CNPJ"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="RG"
                      disabled={form.watch("tipoPessoa") === "J"}
                      maxLength={17}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rgDataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput
                      label="Emissão"
                      disabled={form.watch("tipoPessoa") === "J"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rgOrgao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Órgão"
                      disabled={form.watch("tipoPessoa") === "J"}
                      maxLength={17}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4">
            <FormField
              control={form.control}
              name="rgDataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput label="Data nascimento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={SexoPessoa.map((item) => {
                        return { label: item.label, value: item.value };
                      })}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Sexo"
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
              name="estadoCivil"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={EstadoCivilPessoa.map((item) => {
                        return { label: item.label, value: item.value };
                      })}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Estado civil"
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
              name="rgOrgao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MonetaryInput label="Salário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4">
            <FormField
              control={form.control}
              name="rgOrgao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="CTPS" maxLength={17} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rgDataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput label="Data admissão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rgDataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput label="Data afastamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rgDataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput label="Data demissão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CepInput label="CEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Endereço"
                      maxLength={100}
                      {...field}
                    />
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
                    <InputWithLabel label="Número" maxLength={10} {...field} />
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
                    <InputWithLabel label="Bairro" maxLength={50} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4">
            <FormField
              control={form.control}
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Referência"
                      maxLength={150}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboboxSearchPais
                      label="Pais"
                      onChangeValueSelected={(pais) => {
                        setPaisSelected(pais);
                        form.setValue("pais", pais.id + "");
                        form.clearErrors("pais");
                      }}
                      valueSelected={paisSelected}
                    />
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
                      data={dataEstados.estados.map((item) => {
                        return {
                          label: item.uf + " - " + item.nome,
                          value: item.id + "",
                        };
                      })}
                      valueSelected={field.value}
                      onChangeValueSelected={(value) => {
                        field.onChange(value);
                        form.setValue("cidade", "");
                      }}
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
                    <ComboboxSearchCidade
                      label="Cidade"
                      idEstado={
                        form.watch("estado")
                          ? Number(form.watch("estado"))
                          : null
                      }
                      onChangeValueSelected={(cidade) => {
                        setCidadeSelected(cidade);
                        form.setValue("cidade", cidade.id + "");
                        form.clearErrors("cidade");
                      }}
                      valueSelected={cidadeSelected}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-5">
            <FormField
              control={form.control}
              name="contato1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput label="Contato 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput label="Contato 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato3"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput label="Contato 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Email 1" maxLength={50} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="Email 2" maxLength={50} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionFuncionario, form]);

  const renderPermissoes = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionPermissoes}
        title="Permissões"
        changeShow={setIsShowSectionPermissoes}
      >
        <></>
      </CollapsibleSection>
    );
  }, [isShowSectionPermissoes, form]);

  const renderObservacao = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionObservacao}
        title="Observação"
        changeShow={setIsShowSectionObservacao}
      >
        <Textarea />
      </CollapsibleSection>
    );
  }, [isShowSectionObservacao, form]);

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
            {params.id === String(null) ? "Novo usuário" : "Editar usuário"}
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
              })}
            >
              {renderGeral}

              {renderAdicionais}

              {renderFuncionario}

              {renderPermissoes}

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

export default UsuariosNovo;
