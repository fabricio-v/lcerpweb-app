"use client";

import { Combobox } from "@/components/combobox/Combobox";
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
import { Textarea } from "@/components/ui/textarea";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { EstadoCivilPessoa } from "@/constants/EstadoCivilPessoa";
import { Messages } from "@/constants/Messages";
import { SexoPessoa } from "@/constants/SexoPessoa";
import useSearchCidades from "@/hooks/useSearchCidades";
import useSearchEstados from "@/hooks/useSearchEstados";
import useSearchPaises from "@/hooks/useSearchPaises";
import { IClienteInput } from "@/interfaces/dto/ClienteInput";
import { IPessoaEnderecoInput } from "@/interfaces/dto/PessoaEnderecoInput";
import { IClienteResponse } from "@/interfaces/response/ClienteResponse";
import { IPessoaEnderecoResponse } from "@/interfaces/response/PessoaEnderecoResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import {
  requestClienteById,
  requestInsertOrUpdateCliente,
} from "@/services/requests/cliente";
import { formataDataBRParaUSA, formataDataUSAParaBR } from "@/utils/Format";
import { buildMessageException, isValidDateDDMMYYYY } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AddItemListaEnderecosAdicionais from "./components/AddItemListaEnderecosAdicionais";
import Breadcrumbs from "./components/Breadcrumbs";
import CollapsibleSection from "./components/CollapsibleSection";

export const formClienteSchema = z.object({
  id: z.number().optional(),
  ativo: z.boolean(),
  isCliente: z.boolean(),
  isFornecedor: z.boolean(),
  isTransportadora: z.boolean(),
  isFuncionario: z.boolean(),
  tipoPessoa: z.string(),
  nome: z.string().min(1, {
    message: "Informe o Nome do cliente",
  }),
  razaoSocial: z.string().optional(),
  apelido: z.string().optional(),

  cpfCnpj: z.string().optional(),
  ieIndicador: z.string().min(1, {
    message: "Selecione o Indicador IE",
  }),
  ie: z.string().optional(),
  im: z.string().optional(),
  isuf: z.string().optional(),
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

  naturalidadeCidade: z.string().optional(),
  naturalidadeEstado: z.string().optional(),

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

  empresaNome: z.string().optional(),
  empresaContato: z.string().optional(),
  empresaEndereco: z.string().optional(),
  empresaNumero: z.string().optional(),
  empresaBairro: z.string().optional(),
  empresaCep: z.string().optional(),
  empresaCargo: z.string().optional(),
  empresaRenda: z.number().optional(),
  empresaAdmissao: z.string().optional(),
  empresaCidade: z.string().optional(),
  empresaEstado: z.string().optional(),

  avalistaNome: z.string().optional(),
  avalistaCpf: z.string().optional(),
  avalistaRg: z.string().optional(),
  avalistaContato: z.string().optional(),
  avalistaEndereco: z.string().optional(),
  avalistaNumero: z.string().optional(),
  avalistaBairro: z.string().optional(),
  avalistaCep: z.string().optional(),
  avalistaEmpresa: z.string().optional(),
  avalistaEmpresaCargo: z.string().optional(),
  avalistaEmpresaRenda: z.number().optional(),
  avalistaDataNascimento: z.string().optional(),
  avalistaEmpresaAdmissao: z.string().optional(),
  avalistaCidade: z.string().optional(),
  avalistaEstado: z.string().optional(),

  tabelaPreco: z.number().optional(),
  sexo: z.string(),
  estadoCivil: z.string(),
  limiteCredito: z.number().optional(),
  obs: z.string().optional(),
});

function CadastrosClienteNovo({ params }: any) {
  const { back } = useRouter();

  const { showLoading, hideLoading } = useLoadingStore();

  const { loadEstados, dataEstados } = useSearchEstados();
  const { loadCidades, dataCidades } = useSearchCidades();
  const { loadPaises, dataPaises } = useSearchPaises();

  const [cliente, setCliente] = useState<IClienteResponse>();

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
  const [isShowSectionTipoPessoa, setIsShowSectionTipoPessoa] = useState(false);
  const [isShowSectionAdicionais, setIsShowSectionAdicionais] = useState(false);
  const [isShowSectionEnderecoAdicionais, setIsShowSectionEnderecoAdicionais] =
    useState(false);
  const [isShowSectionFiliacao, setIsShowSectionFiliacao] = useState(false);
  const [isShowSectionEmpresa, setIsShowSectionEmpresa] = useState(false);
  const [isShowSectionConjuge, setIsShowSectionConjuge] = useState(false);
  const [isShowSectionAvalista, setIsShowSectionAvalista] = useState(false);
  const [isShowSectionFoto, setIsShowSectionFoto] = useState(false);
  const [isShowSectionObservacao, setIsShowSectionObservacao] = useState(false);

  const [enderecosAdicionaisLista, setEnderecosAdicionaisLista] = useState<
    IPessoaEnderecoResponse[]
  >([]);

  const form = useForm<z.infer<typeof formClienteSchema>>({
    resolver: zodResolver(formClienteSchema),
    defaultValues: {
      id: undefined,
      ativo: true,
      isCliente: true,
      isFornecedor: false,
      isTransportadora: false,
      isFuncionario: false,
      tipoPessoa: "F",
      nome: "",
      razaoSocial: "",
      apelido: "",

      cpfCnpj: "",
      ieIndicador: "9",
      ie: "",
      im: "",
      isuf: "",
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

      empresaNome: "",
      empresaContato: "",
      empresaEndereco: "",
      empresaNumero: "",
      empresaBairro: "",
      empresaCep: "",
      empresaCargo: "",
      empresaRenda: 0,
      empresaAdmissao: "",
      empresaCidade: "",
      empresaEstado: "",

      avalistaNome: "",
      avalistaCpf: "",
      avalistaRg: "",
      avalistaContato: "",
      avalistaEndereco: "",
      avalistaNumero: "",
      avalistaBairro: "",
      avalistaCep: "",
      avalistaEmpresa: "",
      avalistaEmpresaCargo: "",
      avalistaEmpresaRenda: 0,
      avalistaDataNascimento: "",
      avalistaEmpresaAdmissao: "",
      avalistaCidade: "",
      avalistaEstado: "",

      tabelaPreco: undefined,
      sexo: SexoPessoa[0].value,
      estadoCivil: EstadoCivilPessoa[0].value,
      limiteCredito: 0,
      obs: "",
    },
  });

  const carregaCliente = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestClienteById(token!.toString(), params.id);

      if (response.status === 200) {
        setCliente(response.data);
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
      await carregaCliente();
    }

    await loadPaises();
    await loadEstados();

    hideLoading();
  };

  const resetForm = () => {
    form.reset();
  };

  const handleSave = async (data: z.infer<typeof formClienteSchema>) => {
    try {
      showLoading();

      const enderecosAdicionaisAux: IPessoaEnderecoInput[] =
        enderecosAdicionaisLista.map((item) => ({
          ...item,
          idCidade: item.cidade.id,
          idEstado: item.estado.id,
        }));

      const newCliente: IClienteInput = {
        id: data.id || null,
        ativo: data.ativo,
        isCliente: data.isCliente,
        isFornecedor: data.isFornecedor,
        isTransportadora: data.isTransportadora,
        isFuncionario: data.isFuncionario,
        nome: data.nome,
        razaoSocial: data.razaoSocial || "",
        apelido: data.apelido || "",
        tipoPessoa: data.tipoPessoa,
        cpfCnpj: data.cpfCnpj || "",
        ieIndicador: Number(data.ieIndicador),
        ie: data.ie || "",
        im: data.im || "",
        isuf: data.isuf || "",
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
        idCidadeNaturalidade: data.naturalidadeCidade
          ? Number(data.naturalidadeCidade)
          : null,
        idEstadoNaturalidade: data.naturalidadeEstado
          ? Number(data.naturalidadeEstado)
          : null,
        idCidadeConjuge: data.conjugeCidade ? Number(data.conjugeCidade) : null,
        idEstadoConjuge: data.conjugeEstado ? Number(data.conjugeEstado) : null,
        idCidadeEmpresa: data.empresaCidade ? Number(data.empresaCidade) : null,
        idEstadoEmpresa: data.empresaEstado ? Number(data.empresaEstado) : null,
        idCidadeFiliacao: data.filiacaoCidade
          ? Number(data.filiacaoCidade)
          : null,
        idEstadoFiliacao: data.filiacaoEstado
          ? Number(data.filiacaoEstado)
          : null,
        idCidadeAvalista: data.avalistaCidade
          ? Number(data.avalistaCidade)
          : null,
        idEstadoAvalista: data.avalistaEstado
          ? Number(data.avalistaEstado)
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

        empresaNome: data.empresaNome || "",
        empresaContato: data.empresaContato || "",
        empresaEndereco: data.empresaEndereco || "",
        empresaNumero: data.empresaNumero || "",
        empresaBairro: data.empresaBairro || "",
        empresaCep: data.empresaCep || "",
        empresaCargo: data.empresaCargo || "",
        empresaRenda: data.empresaRenda || 0,
        empresaAdmissao: data.empresaAdmissao || null,

        avalistaNome: data.avalistaNome || "",
        avalistaCpf: data.avalistaCpf || "",
        avalistaRg: data.avalistaRg || "",
        avalistaContato: data.avalistaContato || "",
        avalistaEndereco: data.avalistaEndereco || "",
        avalistaNumero: data.avalistaNumero || "",
        avalistaBairro: data.avalistaBairro || "",
        avalistaCep: data.avalistaCep || "",
        avalistaEmpresa: data.avalistaEmpresa || "",
        avalistaEmpresaCargo: data.avalistaEmpresaCargo || "",
        avalistaEmpresaRenda: data.avalistaEmpresaRenda || 0,
        avalistaDataNascimento: data.avalistaDataNascimento || null,
        avalistaEmpresaAdmissao: data.avalistaEmpresaAdmissao || null,

        idTabelaPreco: data.tabelaPreco ? Number(data.tabelaPreco) : null,
        sexo: data.sexo || "",
        estadoCivil: data.estadoCivil || "",
        limiteCredito: data.limiteCredito || 0,
        obs: data.obs || "",

        enderecosAdicionais: enderecosAdicionaisAux,
      };
      const token = await getCookieClient(CookiesKeys.TOKEN);
      const response = await requestInsertOrUpdateCliente(newCliente, token!);

      if (response.status === 200) {
        toast.success(
          `Cliente ${data.id === null ? "cadastrado" : "atualizado"} com sucesso`,
        );
        if (data.id !== null) {
          back();
        } else {
          resetForm();
        }
      }

      hideLoading();
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

            <FormField
              control={form.control}
              name="tipoPessoa"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={[
                        { label: "Pessoa Física", value: "F" },
                        { label: "Pessoa Jurídica", value: "J" },
                        { label: "Estrangeira", value: "E" },
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
              name="ieIndicador"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      data={[
                        { label: "Não contribuinte", value: "9" },
                        { label: "Contribuinte ICMS", value: "1" },
                        { label: "Contribuinte isento", value: "2" },
                      ]}
                      valueSelected={field.value}
                      onChangeValueSelected={field.onChange}
                      label="Indicador IE"
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
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Razão Social"
                      maxLength={100}
                      disabled={form.watch("tipoPessoa") !== "J"}
                      {...field}
                    />
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

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-6">
            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="RG"
                      disabled={form.watch("tipoPessoa") === "J"}
                      info="Campo específico para Pessoa Física"
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
              name="rgOrgao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Órgão"
                      disabled={form.watch("tipoPessoa") === "J"}
                      info="Campo específico para Pessoa Física"
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
              name="ie"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="IE"
                      disabled={form.watch("tipoPessoa") !== "J"}
                      info="Campo específico para Pessoa Jurídica"
                      maxLength={20}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="im"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="IM"
                      disabled={form.watch("tipoPessoa") !== "J"}
                      info="Campo específico para Pessoa Jurídica"
                      maxLength={20}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isuf"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="ISUF"
                      disabled={form.watch("tipoPessoa") !== "J"}
                      info="Campo específico para Pessoa Jurídica"
                      maxLength={10}
                      {...field}
                    />
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
                    <Combobox
                      label="País"
                      data={dataPaises.paises.map((item) => {
                        return {
                          label: item.nome,
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
                    <Combobox
                      label="Cidade"
                      data={dataCidades.cidades.map((item) => {
                        return {
                          label: item.nome,
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
  }, [isShowSectionGeral, form, dataEstados, dataCidades, dataPaises]);

  const renderTipoPessoa = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionTipoPessoa}
        title="Tipo pessoa"
        changeShow={setIsShowSectionTipoPessoa}
        isOpcional
      >
        <div className="flex flex-1 flex-col gap-6">
          {/* <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-4"> */}
          <FormField
            control={form.control}
            name="isCliente"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    classNameContainer=""
                    title={"Cliente"}
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
                    classNameContainer=""
                    title={"Fornecedor"}
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
                    classNameContainer=""
                    title={"Transportadora"}
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
            name="isFuncionario"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    classNameContainer=""
                    title={"Funcionário"}
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

  const renderEnderecosAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionEnderecoAdicionais}
        title="Endereços adicionais"
        changeShow={setIsShowSectionEnderecoAdicionais}
        isOpcional
      >
        <AddItemListaEnderecosAdicionais
          enderecosAdicionaisLista={enderecosAdicionaisLista}
          estados={dataEstados.estados}
          onAdd={(item) => {
            setEnderecosAdicionaisLista((prev) => {
              const index = prev.findIndex(
                (endereco) => endereco.id === item.id,
              );

              if (index !== -1) {
                // Atualiza o item existente
                return prev.map((endereco, i) =>
                  i === index ? { ...endereco, ...item } : endereco,
                );
              } else {
                // Adiciona um novo item
                return [...prev, item];
              }
            });
          }}
          onRemove={(item) => {
            setEnderecosAdicionaisLista((prev) => {
              return prev.filter((i) => i.id !== item.id);
            });
          }}
        />
      </CollapsibleSection>
    );
  }, [
    isShowSectionEnderecoAdicionais,
    enderecosAdicionaisLista,
    form,
    dataEstados,
  ]);

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
            <Combobox
              label="Nacionalidade"
              data={dataPaises.paises.map((item) => {
                return {
                  label: item.nome,
                  value: item.id + "",
                };
              })}
              valueSelected={""}
              onChangeValueSelected={() => {}}
            />

            <Combobox
              label="Estado naturalidade"
              data={dataEstados.estados.map((item) => {
                return {
                  label: item.uf + " - " + item.nome,
                  value: item.id + "",
                };
              })}
              valueSelected={""}
              onChangeValueSelected={(value) => {}}
            />

            <Combobox
              label="Cidade naturalidade"
              data={dataCidades.cidades.map((item) => {
                return {
                  label: item.nome,
                  value: item.id + "",
                };
              })}
              valueSelected={""}
              onChangeValueSelected={() => {}}
            />
          </div>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
            <Combobox
              label="Vendedor"
              data={[]}
              valueSelected={""}
              onChangeValueSelected={(value) => {}}
            />

            <Combobox
              label="Tabela de preço"
              data={[]}
              valueSelected={""}
              onChangeValueSelected={(value) => {}}
            />

            <MonetaryInput label="Limite de crédito" />
          </div>
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionAdicionais, form, dataCidades, dataEstados, dataPaises]);

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

  useEffect(() => {
    showLoading();
    setTimeout(() => {
      load();
    }, 500);
  }, []);

  useEffect(() => {
    if (cliente !== undefined) {
      form.setValue("id", Number(params.id));
      form.setValue("ativo", cliente.ativo);
      form.setValue("isCliente", cliente.isCliente);
      form.setValue("isFornecedor", cliente.isFornecedor);
      form.setValue("isTransportadora", cliente.isTransportadora);
      form.setValue("isFuncionario", cliente.isFuncionario);
      form.setValue("tipoPessoa", cliente.tipoPessoa);
      form.setValue("nome", cliente.nome);
      form.setValue("razaoSocial", cliente.razaoSocial);
      form.setValue("apelido", cliente.apelido);

      form.setValue("cpfCnpj", cliente.cpfCnpj);
      form.setValue("ieIndicador", cliente.ieIndicador + "");
      form.setValue("ie", cliente.ie);
      form.setValue("im", cliente.im);
      form.setValue("isuf", cliente.isuf);
      form.setValue("rg", cliente.rg);
      form.setValue("rgOrgao", cliente.rgOrgao);
      form.setValue(
        "rgDataEmissao",
        formataDataUSAParaBR(cliente.rgDataEmissao),
      );
      form.setValue(
        "dataNascimento",
        formataDataUSAParaBR(cliente.dataNascimento),
      );

      form.setValue("endereco", cliente.endereco);
      form.setValue("numero", cliente.numero);
      form.setValue("bairro", cliente.bairro);
      form.setValue("referencia", cliente.referencia);
      form.setValue("cep", cliente.cep);
      form.setValue("cidade", String(cliente.cidade.id));
      form.setValue("estado", String(cliente.estado.id));

      form.setValue("contato1", cliente.contato1);
      form.setValue("contato2", cliente.contato2);
      form.setValue("contato3", cliente.contato3);
      form.setValue("email", cliente.email);
      form.setValue("email2", cliente.email2);

      form.setValue("filiacaoPai", cliente.filiacaoPai);
      form.setValue("filiacaoPaiContato", cliente.filiacaoPaiContato);
      form.setValue("filiacaoMae", cliente.filiacaoMae);
      form.setValue("filiacaoMaeContato", cliente.filiacaoMaeContato);
      form.setValue("filiacaoEndereco", cliente.filiacaoEndereco);
      form.setValue("filiacaoNumero", cliente.filiacaoNumero);
      form.setValue("filiacaoBairro", cliente.filiacaoBairro);
      form.setValue("filiacaoReferencia", cliente.filiacaoReferencia);
      form.setValue("filiacaoCep", cliente.filiacaoCep);

      form.setValue("conjugeNome", cliente.conjugeNome);
      form.setValue("conjugeCpf", cliente.conjugeCpf);
      form.setValue("conjugeRg", cliente.conjugeRg);
      form.setValue("conjugeContato", cliente.conjugeContato);
      form.setValue("conjugeEndereco", cliente.conjugeEndereco);
      form.setValue("conjugeNumero", cliente.conjugeNumero);
      form.setValue("conjugeBairro", cliente.conjugeBairro);
      form.setValue("conjugeCep", cliente.conjugeCep);
      form.setValue(
        "conjugeDataNascimento",
        cliente.conjugeDataNascimento || "",
      );
      form.setValue("conjugeEmpresa", cliente.conjugeEmpresa);
      form.setValue("conjugeEmpresaCargo", cliente.conjugeEmpresaCargo);
      form.setValue("conjugeEmpresaRenda", cliente.conjugeEmpresaRenda);
      form.setValue(
        "conjugeEmpresaAdmissao",
        cliente.conjugeEmpresaAdmissao || "",
      );

      form.setValue("empresaNome", cliente.empresaNome);
      form.setValue("empresaContato", cliente.empresaContato);
      form.setValue("empresaEndereco", cliente.empresaEndereco);
      form.setValue("empresaNumero", cliente.empresaNumero);
      form.setValue("empresaBairro", cliente.empresaBairro);
      form.setValue("empresaCep", cliente.empresaCep);
      form.setValue("empresaCargo", cliente.empresaCargo);
      form.setValue("empresaRenda", cliente.empresaRenda);
      form.setValue("empresaAdmissao", cliente.empresaAdmissao || "");

      form.setValue("avalistaNome", cliente.avalistaNome);
      form.setValue("avalistaCpf", cliente.avalistaCpf);
      form.setValue("avalistaRg", cliente.avalistaRg);
      form.setValue("avalistaContato", cliente.avalistaContato);
      form.setValue("avalistaEndereco", cliente.avalistaEndereco);
      form.setValue("avalistaNumero", cliente.avalistaNumero);
      form.setValue("avalistaBairro", cliente.avalistaBairro);
      form.setValue("avalistaCep", cliente.avalistaCep);
      form.setValue("avalistaEmpresa", cliente.avalistaEmpresa);
      form.setValue("avalistaEmpresaCargo", cliente.avalistaEmpresaCargo);
      form.setValue("avalistaEmpresaRenda", cliente.avalistaEmpresaRenda);
      form.setValue(
        "avalistaDataNascimento",
        cliente.avalistaDataNascimento || "",
      );
      form.setValue(
        "avalistaEmpresaAdmissao",
        cliente.avalistaEmpresaAdmissao || "",
      );

      form.setValue(
        "tabelaPreco",
        cliente.tabelaPreco ? cliente.tabelaPreco.id : undefined,
      );
      form.setValue("sexo", cliente.sexo);
      form.setValue("estadoCivil", cliente.estadoCivil);
      form.setValue("limiteCredito", cliente.limiteCredito);
      form.setValue("obs", cliente.obs);

      setEnderecosAdicionaisLista(cliente.enderecosAdicionais);
    }
  }, [cliente, params]);

  useEffect(() => {
    if (form.watch("estado") !== "") {
      loadCidades(Number(form.watch("estado")));
    } else {
      loadCidades(null);
    }
  }, [form.watch("estado")]);

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
                console.log(errors);
                toast.warning("Preencha todos os campos obrigatórios");
              })}
            >
              {renderGeral}

              {renderEnderecosAdicionais}

              {renderAdicionais}

              {renderFiliacao}

              {renderEmpresa}

              {renderConjuge}

              {renderAvalista}

              {renderTipoPessoa}

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
