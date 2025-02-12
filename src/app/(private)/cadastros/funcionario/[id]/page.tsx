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
import { PhoneInput } from "@/components/input/PhoneInput";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { EstadoCivilPessoa } from "@/constants/EstadoCivilPessoa";
import { Messages } from "@/constants/Messages";
import { SexoPessoa } from "@/constants/SexoPessoa";
import { StatusFuncionario } from "@/constants/StatusFuncionario";
import useSearchEstados from "@/hooks/useSearchEstados";
import useSearchGruposUsuario from "@/hooks/useSearchGruposUsuario";
import useSearchUsuarioFuncao from "@/hooks/useSearchUsuarioFuncao";
import { IFuncionarioInput } from "@/interfaces/dto/FuncionarioInput";
import { ICidadeResponse } from "@/interfaces/response/CidadeResponse";
import { IFuncionarioResponse } from "@/interfaces/response/FuncionarioResponse";
import { IPaisResponse } from "@/interfaces/response/PaisResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import {
  requestFuncionarioById,
  requestInsertOrUpdateFuncionario,
} from "@/services/requests/funcionarios";
import { formataDataBRParaUSA, formataDataUSAParaBR } from "@/utils/Format";
import { buildMessageException, isValidDateDDMMYYYY } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "./components/Breadcrumbs";

export const formFuncionarioSchema = z
  .object({
    id: z.string().optional(),
    codInterno: z.number().optional(),
    ativo: z.boolean(),
    isCliente: z.boolean(),
    isFornecedor: z.boolean(),
    isTransportadora: z.boolean(),
    tipoPessoa: z.string(),
    nome: z.string().min(1, {
      message: "Informe o Nome do funcionário",
    }),
    apelido: z.string().optional(),

    cpfCnpj: z.string().optional(),

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

    nacionalidadePais: z.any().optional(),
    naturalidadeCidade: z.any().optional(),
    naturalidadeEstado: z.any().optional(),

    contato1: z.string().optional(),
    contato2: z.string().optional(),
    contato3: z.string().optional(),
    email: z.string().optional(),
    email2: z.string().optional(),

    filiacaoPai: z.string().optional(),
    filiacaoPaiContato: z.string().optional(),
    filiacaoMae: z.string().optional(),
    filiacaoMaeContato: z.string().optional(),
    filiacaoEndereco: z.string().optional(),
    filiacaoNumero: z.string().optional(),
    filiacaoBairro: z.string().optional(),
    filiacaoReferencia: z.string().optional(),
    filiacaoCep: z.string().optional(),
    filiacaoCidade: z.string().optional(),
    filiacaoEstado: z.string().optional(),

    conjugeNome: z.string().optional(),
    conjugeCpf: z.string().optional(),
    conjugeRg: z.string().optional(),
    conjugeContato: z.string().optional(),
    conjugeEndereco: z.string().optional(),
    conjugeNumero: z.string().optional(),
    conjugeBairro: z.string().optional(),
    conjugeCep: z.string().optional(),
    conjugeDataNascimento: z.string().optional(),
    conjugeEmpresa: z.string().optional(),
    conjugeEmpresaCargo: z.string().optional(),
    conjugeEmpresaRenda: z.number().optional(),
    conjugeEmpresaAdmissao: z.string().optional(),
    conjugeCidade: z.string().optional(),
    conjugeEstado: z.string().optional(),

    funcionarioStatus: z.string(),
    funcionarioCtps: z.string().optional(),
    funcionarioSalario: z.number().optional(),
    funcionarioDataAdmissao: z.string().optional(),
    funcionarioDataDemissao: z.string().optional(),
    funcionarioDataAfastamento: z.string().optional(),

    sexo: z.string(),
    estadoCivil: z.string(),
    obs: z.string().optional(),

    usuarioId: z.string().optional(),
    usuarioGrupo: z.any().optional(),
    usuarioFuncao: z.any().optional(),
    usuarioAtivo: z.boolean().optional(),
    usuarioMaster: z.boolean(),
    usuarioEmail: z.string().email("E-mail inválido").optional(),
    usuarioSenha: z.string().optional(),
    usuarioSenhaConfirmacao: z.string().optional(),
    usuarioDescontoPermitido: z.number().optional(),
    // permissoes: string[];
  })
  .superRefine((data, ctx) => {
    const {
      usuarioId,
      usuarioEmail,
      usuarioGrupo,
      usuarioFuncao,
      usuarioSenha,
      usuarioSenhaConfirmacao,
    } = data;

    if (
      usuarioId !== undefined ||
      (usuarioEmail && usuarioEmail.trim().length > 0)
    ) {
      if (usuarioEmail === "") {
        ctx.addIssue({
          code: "custom",
          path: ["usuarioEmail"],
          message: "Email do usuário é obrigatório.",
        });
      }

      if (!usuarioGrupo) {
        ctx.addIssue({
          code: "custom",
          path: ["usuarioGrupo"],
          message: "Grupo do usuário é obrigatório.",
        });
      }
      if (!usuarioFuncao) {
        ctx.addIssue({
          code: "custom",
          path: ["usuarioFuncao"],
          message: "Função do usuário é obrigatória.",
        });
      }

      if (usuarioId === undefined) {
        if (!usuarioSenha) {
          ctx.addIssue({
            code: "custom",
            path: ["usuarioSenha"],
            message: "A senha é obrigatória.",
          });
        }
      }

      if (usuarioSenha !== usuarioSenhaConfirmacao) {
        ctx.addIssue({
          code: "custom",
          path: ["usuarioSenhaConfirmacao"],
          message: "As senhas devem ser iguais",
        });
      }
    }
  });

function CadastrosFuncionarioNovo({ params }: any) {
  const { back } = useRouter();

  const { showLoading, hideLoading } = useLoadingStore();

  const { loadEstados, dataEstados } = useSearchEstados();

  const { loadGruposUsuario, data: dataGruposUsuario } =
    useSearchGruposUsuario();

  const { loadUsuarioFuncao, dataUsuarioFuncao } = useSearchUsuarioFuncao();

  const [funcionario, setFuncionario] = useState<IFuncionarioResponse>();

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionTipoPessoa, setIsShowSectionTipoPessoa] = useState(false);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(false);

  const [isShowSectionFiliacao, setIsShowSectionFiliacao] = useState(false);
  const [isShowSectionConjuge, setIsShowSectionConjuge] = useState(false);
  const [isShowSectionObservacao, setIsShowSectionObservacao] = useState(false);

  const [isShowSectionUsuario, setIsShowSectionUsuario] = useState(false);

  const [paisSelected, setPaisSelected] = useState<IPaisResponse | undefined>();

  const [paisNacionalidadeSelected, setPaisNacionalidadeSelected] = useState<
    IPaisResponse | undefined
  >();

  const [cidadeSelected, setCidadeSelected] = useState<
    ICidadeResponse | undefined
  >();

  const [cidadeNaturalidadeSelected, setCidadeNaturalidadeSelected] = useState<
    ICidadeResponse | undefined
  >();

  const form = useForm<z.infer<typeof formFuncionarioSchema>>({
    resolver: zodResolver(formFuncionarioSchema),
    defaultValues: {
      id: undefined,
      codInterno: undefined,
      ativo: true,
      isCliente: false,
      isFornecedor: false,
      isTransportadora: false,
      tipoPessoa: "F",
      nome: "",
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

      nacionalidadePais: "1058",
      naturalidadeCidade: "",
      naturalidadeEstado: "",

      contato1: "",
      contato2: "",
      contato3: "",
      email: "",
      email2: "",

      filiacaoPai: "",
      filiacaoPaiContato: "",
      filiacaoMae: "",
      filiacaoMaeContato: "",
      filiacaoEndereco: "",
      filiacaoNumero: "",
      filiacaoBairro: "",
      filiacaoReferencia: "",
      filiacaoCep: "",
      filiacaoCidade: "",
      filiacaoEstado: "",

      conjugeNome: "",
      conjugeCpf: "",
      conjugeRg: "",
      conjugeContato: "",
      conjugeEndereco: "",
      conjugeNumero: "",
      conjugeBairro: "",
      conjugeCep: "",
      conjugeDataNascimento: "",
      conjugeEmpresa: "",
      conjugeEmpresaCargo: "",
      conjugeEmpresaRenda: 0,
      conjugeEmpresaAdmissao: "",
      conjugeCidade: "",
      conjugeEstado: "",

      funcionarioStatus: "ADMITIDO",
      funcionarioCtps: "",
      funcionarioDataAdmissao: "",
      funcionarioDataAfastamento: "",
      funcionarioDataDemissao: "",
      funcionarioSalario: 0.0,

      sexo: SexoPessoa[0].value,
      estadoCivil: EstadoCivilPessoa[0].value,
      obs: "",

      usuarioId: undefined,
      usuarioDescontoPermitido: undefined,
      usuarioMaster: false,
      usuarioAtivo: true,
      usuarioGrupo: undefined,
      usuarioFuncao: undefined,
      usuarioEmail: "",
      usuarioSenha: "",
      usuarioSenhaConfirmacao: "",
    },
  });

  const carregaFuncionario = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestFuncionarioById(
        token!.toString(),
        params.id,
      );

      if (response.status === 200) {
        setFuncionario(response.data);
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
      await carregaFuncionario();
    }

    await loadEstados();
    await loadGruposUsuario();
    await loadUsuarioFuncao();

    hideLoading();
  };

  const resetForm = () => {
    form.reset();
    setCidadeSelected(undefined);
    setPaisSelected(undefined);
    setCidadeNaturalidadeSelected(undefined);
    setPaisNacionalidadeSelected(undefined);
  };

  const handleSave = async (data: z.infer<typeof formFuncionarioSchema>) => {
    try {
      showLoading();

      const newFuncionario: IFuncionarioInput = {
        id: data.id || null,
        ativo: data.ativo,
        isCliente: data.isCliente,
        isFornecedor: data.isFornecedor,
        isTransportadora: data.isTransportadora,
        isFuncionario: true,
        tipoPessoa: data.tipoPessoa,
        nome: data.nome,
        apelido: data.apelido || "",
        cpfCnpj: data.cpfCnpj || "",
        rg: data.rg || "",
        rgOrgao: data.rgOrgao || "",
        rgDataEmissao: data.rgDataEmissao
          ? formataDataBRParaUSA(data.rgDataEmissao)
          : null,
        dataNascimento: data.dataNascimento
          ? formataDataBRParaUSA(data.dataNascimento)
          : null,

        endereco: data.endereco || "",
        numero: data.numero || "",
        bairro: data.bairro || "",
        referencia: data.referencia || "",
        cep: data.cep || "",

        idCidade: Number(data.cidade),
        idEstado: Number(data.estado),
        idPais: Number(data.pais),
        idPaisNacionalidade: data.nacionalidadePais
          ? Number(data.nacionalidadePais)
          : null,
        idCidadeNaturalidade: data.naturalidadeCidade
          ? Number(data.naturalidadeCidade)
          : null,
        idEstadoNaturalidade: data.naturalidadeEstado
          ? Number(data.naturalidadeEstado)
          : null,
        idCidadeConjuge: data.conjugeCidade ? Number(data.conjugeCidade) : null,
        idEstadoConjuge: data.conjugeEstado ? Number(data.conjugeEstado) : null,
        idCidadeFiliacao: data.filiacaoCidade
          ? Number(data.filiacaoCidade)
          : null,
        idEstadoFiliacao: data.filiacaoEstado
          ? Number(data.filiacaoEstado)
          : null,

        contato1: data.contato1 || "",
        contato2: data.contato2 || "",
        contato3: data.contato3 || "",
        email: data.email || "",
        email2: data.email2 || "",

        filiacaoPai: data.filiacaoPai || "",
        filiacaoPaiContato: data.filiacaoPaiContato || "",
        filiacaoMae: data.filiacaoMae || "",
        filiacaoMaeContato: data.filiacaoMaeContato || "",
        filiacaoEndereco: data.filiacaoEndereco || "",
        filiacaoNumero: data.filiacaoNumero || "",
        filiacaoBairro: data.filiacaoBairro || "",
        filiacaoReferencia: data.filiacaoReferencia || "",
        filiacaoCep: data.filiacaoCep || "",

        conjugeNome: data.conjugeNome || "",
        conjugeCpf: data.conjugeCpf || "",
        conjugeRg: data.conjugeRg || "",
        conjugeContato: data.conjugeContato || "",
        conjugeEndereco: data.conjugeEndereco || "",
        conjugeNumero: data.conjugeNumero || "",
        conjugeBairro: data.conjugeBairro || "",
        conjugeCep: data.conjugeCep || "",
        conjugeDataNascimento: data.conjugeDataNascimento || null,
        conjugeEmpresa: data.conjugeEmpresa || "",
        conjugeEmpresaCargo: data.conjugeEmpresaCargo || "",
        conjugeEmpresaRenda: data.conjugeEmpresaRenda || 0,
        conjugeEmpresaAdmissao: data.conjugeEmpresaAdmissao || null,

        funcionarioStatus: data.funcionarioStatus,
        funcionarioCtps: data.funcionarioCtps || null,
        funcionarioSalario: data.funcionarioSalario || 0,
        funcionarioDataAdmissao: data.funcionarioDataAdmissao
          ? formataDataBRParaUSA(data.funcionarioDataAdmissao)
          : null,
        funcionarioDataDemissao: data.funcionarioDataDemissao
          ? formataDataBRParaUSA(data.funcionarioDataDemissao)
          : null,
        funcionarioDataAfastamento: data.funcionarioDataAfastamento
          ? formataDataBRParaUSA(data.funcionarioDataAfastamento)
          : null,

        sexo: data.sexo || "",
        estadoCivil: data.estadoCivil || "",
        obs: data.obs || "",

        usuario:
          !data.usuarioEmail || data.usuarioEmail.trim().length === 0
            ? null
            : {
                id: data.usuarioId || null,
                grupo: data.usuarioGrupo!,
                idUsuarioFuncao: data.usuarioFuncao!,
                ativo: data.usuarioAtivo!,
                master: false,
                nome: data.nome,
                email: data.usuarioEmail!,
                senha: data.usuarioSenha!,
                descontoPermitido: data.usuarioDescontoPermitido || 0,
                permissoes: [],
              },
      };

      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestInsertOrUpdateFuncionario(
        newFuncionario,
        token!,
      );

      if (response.status === 200) {
        toast.success(
          `Funcionário ${data.id === null ? "cadastrado" : "atualizado"} com sucesso`,
        );
        back();

        setTimeout(() => {
          hideLoading();
        }, 1);
      }
    } catch (error: any) {
      hideLoading();
      if (error?.response?.status < 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  };

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[minmax(auto,150px)_1fr]">
            <FormField
              control={form.control}
              name="codInterno"
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
              name="funcionarioStatus"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={StatusFuncionario.map((item) => {
                        return { label: item.label, value: item.value };
                      })}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Situação"
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
              name="apelido"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Apelido"
                      maxLength={100}
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
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel label="RG" maxLength={17} {...field} />
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
                    <DateInput label="Emissão" {...field} />
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
                    <InputWithLabel label="Órgão" maxLength={17} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput label="Data nascimento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4">
            <FormField
              control={form.control}
              name="funcionarioCtps"
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
              name="funcionarioDataAdmissao"
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
              name="funcionarioDataAfastamento"
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
              name="funcionarioDataDemissao"
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

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[200px_1fr_120px_1fr]">
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
                    <InputWithLabel
                      label="Email 1"
                      maxLength={50}
                      autoComplete="off"
                      {...field}
                    />
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
                    <InputWithLabel
                      label="Email 2"
                      maxLength={50}
                      autoComplete="off"
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
  }, [isShowSectionGeral, form, dataEstados, cidadeSelected, paisSelected]);

  const renderTipoPessoa = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionTipoPessoa}
        title="Tipo pessoa"
        changeShow={setIsShowSectionTipoPessoa}
        isOpcional
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
          <FormField
            control={form.control}
            name="isCliente"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    label="Cliente"
                    title={field.value === true ? "Sim" : "Não"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFornecedor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    label={"Fornecedor"}
                    title={field.value === true ? "Sim" : "Não"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isTransportadora"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    label={"Transportadora"}
                    title={field.value === true ? "Sim" : "Não"}
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
  }, [isShowSectionTipoPessoa, form]);

  const renderAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionAdicionais}
        title="Adicionais"
        changeShow={setIsShowSectionAdicionais}
        isOpcional
      >
        <div className="flex flex-col gap-6">
          <div className="flex">
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      classNameContainer="w-[120px]"
                      title={field.value === true ? "Ativo" : "Inativo"}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="Status"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
            {/* <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateInput label="Data nascimento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
          </div>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="nacionalidadePais"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboboxSearchPais
                      label="Nacionalidade"
                      onChangeValueSelected={(pais) => {
                        setPaisNacionalidadeSelected(pais);
                        form.setValue("nacionalidadePais", pais.id + "");
                        form.clearErrors("nacionalidadePais");
                      }}
                      valueSelected={paisNacionalidadeSelected}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="naturalidadeEstado"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      label="Estado naturalidade"
                      data={dataEstados.estados.map((item) => {
                        return {
                          label: item.uf + " - " + item.nome,
                          value: item.id + "",
                        };
                      })}
                      valueSelected={field.value}
                      onChangeValueSelected={(value) => {
                        field.onChange(value);
                        form.setValue("naturalidadeCidade", "");
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
              name="naturalidadeCidade"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboboxSearchCidade
                      label="Cidade naturalidade"
                      idEstado={
                        form.watch("naturalidadeEstado")
                          ? Number(form.watch("naturalidadeEstado"))
                          : null
                      }
                      onChangeValueSelected={(cidade) => {
                        setCidadeNaturalidadeSelected(cidade);
                        form.setValue("naturalidadeCidade", cidade.id + "");
                        form.clearErrors("naturalidadeCidade");
                      }}
                      valueSelected={cidadeNaturalidadeSelected}
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
  }, [
    isShowSectionAdicionais,
    form,
    dataEstados,
    cidadeNaturalidadeSelected,
    paisNacionalidadeSelected,
  ]);

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

  const renderObservacao = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionObservacao}
        title="Observação"
        changeShow={setIsShowSectionObservacao}
        isOpcional
      >
        <FormField
          control={form.control}
          name="obs"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CollapsibleSection>
    );
  }, [isShowSectionObservacao, form]);

  const renderUsuario = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionUsuario}
        title="Dados do usuário"
        changeShow={setIsShowSectionUsuario}
        isOpcional
      >
        <div>
          <Tabs defaultValue="dados">
            <TabsList className="w-full">
              <TabsTrigger value="dados" defaultChecked>
                Dados
              </TabsTrigger>
              <TabsTrigger disabled value="permissoes">
                Permissões
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados">
              <div className="flex flex-1 flex-col gap-4 px-4">
                <FormField
                  control={form.control}
                  name="usuarioAtivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          classNameContainer="w-[120px]"
                          title={field.value === true ? "Ativo" : "Inativo"}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          label="Status"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="usuarioGrupo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox
                            label="Grupo"
                            data={dataGruposUsuario.gruposUsuario.map(
                              (item) => {
                                return { label: item, value: item };
                              },
                            )}
                            valueSelected={field.value}
                            onChangeValueSelected={field.onChange}
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
                    name="usuarioFuncao"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox
                            label="Função"
                            data={dataUsuarioFuncao.usuarioFuncao.map(
                              (item) => {
                                return {
                                  label: item.nome,
                                  value: item.id + "",
                                };
                              },
                            )}
                            valueSelected={field.value}
                            onChangeValueSelected={field.onChange}
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
                    name="usuarioDescontoPermitido"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MonetaryInput
                            label="Desconto permitido"
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
                </div>

                <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="usuarioEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            label="Email"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usuarioSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            label="Senha"
                            type="password"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usuarioSenhaConfirmacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            label="Confirmação de senha"
                            type="password"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionUsuario, form, dataGruposUsuario, dataUsuarioFuncao]);

  useEffect(() => {
    showLoading();
    setTimeout(() => {
      load();
    }, 500);
  }, []);

  useEffect(() => {
    if (funcionario !== undefined) {
      form.setValue("id", params.id);
      form.setValue("codInterno", funcionario.codInterno);
      form.setValue("ativo", funcionario.ativo);
      form.setValue("isCliente", funcionario.isCliente);
      form.setValue("isFornecedor", funcionario.isFornecedor);
      form.setValue("isTransportadora", funcionario.isTransportadora);
      form.setValue("tipoPessoa", funcionario.tipoPessoa);
      form.setValue("nome", funcionario.nome);
      form.setValue("apelido", funcionario.apelido);

      form.setValue("cpfCnpj", funcionario.cpfCnpj);
      form.setValue("rg", funcionario.rg);
      form.setValue("rgOrgao", funcionario.rgOrgao);
      form.setValue(
        "rgDataEmissao",
        formataDataUSAParaBR(funcionario.rgDataEmissao),
      );
      form.setValue(
        "dataNascimento",
        formataDataUSAParaBR(funcionario.dataNascimento),
      );

      form.setValue("endereco", funcionario.endereco);
      form.setValue("numero", funcionario.numero);
      form.setValue("bairro", funcionario.bairro);
      form.setValue("referencia", funcionario.referencia);
      form.setValue("cep", funcionario.cep);
      form.setValue("cidade", String(funcionario.cidade.id));
      form.setValue("estado", String(funcionario.estado.id));

      form.setValue("contato1", funcionario.contato1);
      form.setValue("contato2", funcionario.contato2);
      form.setValue("contato3", funcionario.contato3);
      form.setValue("email", funcionario.email);
      form.setValue("email2", funcionario.email2);

      form.setValue(
        "nacionalidadePais",
        String(
          funcionario.paisNacionalidade ? funcionario.paisNacionalidade.id : "",
        ),
      );

      form.setValue(
        "naturalidadeCidade",
        String(
          funcionario.cidadeNaturalidade
            ? funcionario.cidadeNaturalidade.id
            : "",
        ),
      );

      form.setValue(
        "naturalidadeEstado",
        String(
          funcionario.estadoNaturalidade
            ? funcionario.estadoNaturalidade.id
            : "",
        ),
      );

      form.setValue("filiacaoPai", funcionario.filiacaoPai);
      form.setValue("filiacaoPaiContato", funcionario.filiacaoPaiContato);
      form.setValue("filiacaoMae", funcionario.filiacaoMae);
      form.setValue("filiacaoMaeContato", funcionario.filiacaoMaeContato);
      form.setValue("filiacaoEndereco", funcionario.filiacaoEndereco);
      form.setValue("filiacaoNumero", funcionario.filiacaoNumero);
      form.setValue("filiacaoBairro", funcionario.filiacaoBairro);
      form.setValue("filiacaoReferencia", funcionario.filiacaoReferencia);
      form.setValue("filiacaoCep", funcionario.filiacaoCep);

      form.setValue("conjugeNome", funcionario.conjugeNome);
      form.setValue("conjugeCpf", funcionario.conjugeCpf);
      form.setValue("conjugeRg", funcionario.conjugeRg);
      form.setValue("conjugeContato", funcionario.conjugeContato);
      form.setValue("conjugeEndereco", funcionario.conjugeEndereco);
      form.setValue("conjugeNumero", funcionario.conjugeNumero);
      form.setValue("conjugeBairro", funcionario.conjugeBairro);
      form.setValue("conjugeCep", funcionario.conjugeCep);
      form.setValue(
        "conjugeDataNascimento",
        funcionario.conjugeDataNascimento || "",
      );
      form.setValue("conjugeEmpresa", funcionario.conjugeEmpresa);
      form.setValue("conjugeEmpresaCargo", funcionario.conjugeEmpresaCargo);
      form.setValue("conjugeEmpresaRenda", funcionario.conjugeEmpresaRenda);
      form.setValue(
        "conjugeEmpresaAdmissao",
        funcionario.conjugeEmpresaAdmissao || "",
      );

      form.setValue("sexo", funcionario.sexo);
      form.setValue("estadoCivil", funcionario.estadoCivil);
      form.setValue("obs", funcionario.obs);

      funcionarioStatus: z.string(),
        form.setValue("funcionarioCtps", funcionario.funcionarioCtps || "");
      form.setValue("funcionarioSalario", funcionario.funcionarioSalario || 0);
      form.setValue(
        "funcionarioDataAdmissao",
        formataDataUSAParaBR(funcionario.funcionarioDataAdmissao) || "",
      );
      form.setValue(
        "funcionarioDataDemissao",
        formataDataUSAParaBR(funcionario.funcionarioDataDemissao) || "",
      );
      form.setValue(
        "funcionarioDataAfastamento",
        formataDataUSAParaBR(funcionario.funcionarioDataAfastamento) || "",
      );

      if (funcionario.usuario) {
        form.setValue("usuarioId", funcionario.usuario.id);
        form.setValue("usuarioAtivo", funcionario.usuario.ativo);
        form.setValue("usuarioGrupo", funcionario.usuario.grupo);
        form.setValue("usuarioFuncao", funcionario.usuario.funcao.id + "");
        form.setValue("usuarioEmail", funcionario.usuario.email);
      }

      setCidadeSelected(funcionario.cidade);

      setCidadeNaturalidadeSelected(
        funcionario.cidadeNaturalidade
          ? funcionario.cidadeNaturalidade
          : undefined,
      );
      setPaisSelected(funcionario.pais);
      setPaisNacionalidadeSelected(funcionario.paisNacionalidade);
    }
  }, [funcionario, params]);

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
            {params.id === String(null)
              ? "Novo funcionário"
              : "Editar funcionário"}
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

              {/* {renderFiliacao}

              {renderConjuge} */}

              {renderTipoPessoa}

              {renderObservacao}

              {renderUsuario}

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

export default CadastrosFuncionarioNovo;
