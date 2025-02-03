"use client";

import { Combobox } from "@/components/combobox/Combobox";
import { CepInput } from "@/components/input/CepInput";
import { CpfCnpjInput } from "@/components/input/CpfCnpjInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
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
import { Messages } from "@/constants/Messages";
import useSearchCidades from "@/hooks/useSearchCidades";
import useSearchEstados from "@/hooks/useSearchEstados";
import { IClienteInput } from "@/interfaces/dto/ClienteInput";
import { IClienteResponse } from "@/interfaces/response/ClienteResponse";
import { IPessoaEnderecoResponse } from "@/interfaces/response/PessoaEnderecoResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import {
  requestClienteById,
  requestInsertOrUpdateCliente,
} from "@/services/requests/cliente";
import { buildMessageException } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "./components/Breadcrumbs";
import CollapsibleSection from "./components/CollapsibleSection";

export const formClienteSchema = z.object({
  id: z.number().optional(),
  ativo: z.boolean(),
  tipoPessoaFisicaJuridica: z.string(),
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
  rgDataEmissao: z.string().optional(),
  dataNascimento: z.string().optional(),

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
  pais: z.string().optional(),

  naturalidadeCidade: z.string().optional(),
  naturalidadeEstado: z.string().optional(),

  contato1: z.string().optional(),
  contato2: z.string().optional(),
  contato3: z.string().optional(),
  email: z.string().optional(),
  email2: z.string().optional(),

  enderecoEntrega: z.string().optional(),
  numeroEntrega: z.string().optional(),
  bairroEntrega: z.string().optional(),
  referenciaEntrega: z.string().optional(),
  cepEntrega: z.string().optional(),
  entregaCidade: z.string().optional(),
  entregaEstado: z.string().optional(),

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

  tabelaPreco: z.string().optional(),
  sexo: z.string().optional(),
  estadoCivil: z.string().optional(),
  limiteCredito: z.number().optional(),
  obs: z.string().optional(),
});

function CadastrosClienteNovo({ params }: any) {
  const { back } = useRouter();

  const { showLoading, hideLoading } = useLoadingStore();

  const { loadEstados, dataEstados } = useSearchEstados();
  const { loadCidades, dataCidades } = useSearchCidades();

  const [cliente, setCliente] = useState<IClienteResponse>();

  const [isShowSectionGeral, setIsShowSectionGeral] = useState(true);
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
      tipoPessoaFisicaJuridica: "F",
      nome: "",
      razaoSocial: "",
      apelido: "",

      cpfCnpj: "",
      ieIndicador: "",
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
      pais: "",

      naturalidadeCidade: "",
      naturalidadeEstado: "",

      contato1: "",
      contato2: "",
      contato3: "",
      email: "",
      email2: "",

      enderecoEntrega: "",
      numeroEntrega: "",
      bairroEntrega: "",
      referenciaEntrega: "",
      cepEntrega: "",
      entregaCidade: "",
      entregaEstado: "",

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

      tabelaPreco: "",
      sexo: "",
      estadoCivil: "",
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

    await loadEstados();

    hideLoading();
  };

  const resetForm = () => {
    form.reset();
  };

  const handleSave = async (data: z.infer<typeof formClienteSchema>) => {
    try {
      console.log(data.estado);
      const newCliente: IClienteInput = {
        id: data.id || null,
        ativo: data.ativo,
        nome: data.nome,
        razaoSocial: data.razaoSocial || "",
        apelido: data.apelido || "",
        tipoPessoaFisicaJuridica: data.tipoPessoaFisicaJuridica,
        cpfCnpj: data.cpfCnpj || "",
        ieIndicador: Number(data.ieIndicador),
        ie: data.ie || "",
        im: data.im || "",
        isuf: data.isuf || "",
        rg: data.rg || "",
        rgOrgao: data.rgOrgao || "",
        rgDataEmissao: data.rgDataEmissao || "",
        dataNascimento: data.dataNascimento || "",

        endereco: data.endereco || "",
        numero: data.numero || "",
        bairro: data.bairro || "",
        referencia: data.referencia || "",
        cep: data.cep || "",

        idCidade: Number(data.cidade),
        idEstado: Number(data.estado),
        idPais: Number(data.pais),
        idCidadeEntrega: data.entregaCidade ? Number(data.entregaCidade) : null,
        idEstadoEntrega: data.entregaEstado ? Number(data.entregaEstado) : null,
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

        enderecoEntrega: data.enderecoEntrega || "",
        numeroEntrega: data.numeroEntrega || "",
        bairroEntrega: data.bairroEntrega || "",
        referenciaEntrega: data.referenciaEntrega || "",
        cepEntrega: data.cepEntrega || "",

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
        conjugeDataNascimento: data.conjugeDataNascimento || "",
        conjugeEmpresa: data.conjugeEmpresa || "",
        conjugeEmpresaCargo: data.conjugeEmpresaCargo || "",
        conjugeEmpresaRenda: data.conjugeEmpresaRenda || 0,
        conjugeEmpresaAdmissao: data.conjugeEmpresaAdmissao || "",

        empresaNome: data.empresaNome || "",
        empresaContato: data.empresaContato || "",
        empresaEndereco: data.empresaEndereco || "",
        empresaNumero: data.empresaNumero || "",
        empresaBairro: data.empresaBairro || "",
        empresaCep: data.empresaCep || "",
        empresaCargo: data.empresaCargo || "",
        empresaRenda: data.empresaRenda || 0,
        empresaAdmissao: data.empresaAdmissao || "",

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
        avalistaDataNascimento: data.avalistaDataNascimento || "",
        avalistaEmpresaAdmissao: data.avalistaEmpresaAdmissao || "",

        idTabelaPreco: Number(data.tabelaPreco),
        sexo: data.sexo || "",
        estadoCivil: data.estadoCivil || "",
        limiteCredito: data.limiteCredito || 0,
        obs: data.obs || "",

        enderecosAdicionais: [],
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

  const renderGeral = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionGeral}
        title="Geral"
        changeShow={setIsShowSectionGeral}
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[minmax(auto,150px)_minmax(auto,300px)_minmax(auto,300px)_minmax(auto,300px)]">
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
                    <CpfCnpjInput
                      typeInput={
                        form.watch("tipoPessoaFisicaJuridica") === "F"
                          ? "cpf"
                          : "cnpj"
                      }
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

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[1fr_1fr_200px]">
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
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "J"}
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
                    <InputWithLabel
                      label="Emissão"
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "J"}
                      info="Campo específico para Pessoa Física"
                      type="date"
                      placeholder=""
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
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "J"}
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
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "F"}
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
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "F"}
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
                      disabled={form.watch("tipoPessoaFisicaJuridica") === "F"}
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

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[1fr_120px_1fr_200px]">
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
          </div>

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[1fr_250px_1fr]">
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

          <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[minmax(auto,150px)_minmax(auto,150px)_minmax(auto,150px)_1fr_1fr]">
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
  }, [isShowSectionGeral, form, dataEstados, dataCidades]);

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

  const renderEnderecosAdicionais = useMemo(() => {
    return (
      <CollapsibleSection
        isShow={isShowSectionEnderecoAdicionais}
        title="Endereços adicionais"
        changeShow={setIsShowSectionEnderecoAdicionais}
        isOpcional
      >
        <div>
          {enderecosAdicionaisLista.map((item, index) => {
            return <p>{item.descricao}</p>;
          })}
        </div>
      </CollapsibleSection>
    );
  }, [isShowSectionEnderecoAdicionais, enderecosAdicionaisLista, form]);

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
      form.setValue(
        "tipoPessoaFisicaJuridica",
        cliente.tipoPessoaFisicaJuridica,
      );
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
      form.setValue("rgDataEmissao", cliente.rgDataEmissao);
      form.setValue("dataNascimento", cliente.dataNascimento);

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

      form.setValue("enderecoEntrega", cliente.enderecoEntrega);
      form.setValue("numeroEntrega", cliente.numeroEntrega);
      form.setValue("bairroEntrega", cliente.bairroEntrega);
      form.setValue("referenciaEntrega", cliente.referenciaEntrega);
      form.setValue("cepEntrega", cliente.cepEntrega);

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
      form.setValue("conjugeDataNascimento", cliente.conjugeDataNascimento);
      form.setValue("conjugeEmpresa", cliente.conjugeEmpresa);
      form.setValue("conjugeEmpresaCargo", cliente.conjugeEmpresaCargo);
      form.setValue("conjugeEmpresaRenda", cliente.conjugeEmpresaRenda);
      form.setValue("conjugeEmpresaAdmissao", cliente.conjugeEmpresaAdmissao);

      form.setValue("empresaNome", cliente.empresaNome);
      form.setValue("empresaContato", cliente.empresaContato);
      form.setValue("empresaEndereco", cliente.empresaEndereco);
      form.setValue("empresaNumero", cliente.empresaNumero);
      form.setValue("empresaBairro", cliente.empresaBairro);
      form.setValue("empresaCep", cliente.empresaCep);
      form.setValue("empresaCargo", cliente.empresaCargo);
      form.setValue("empresaRenda", cliente.empresaRenda);
      form.setValue("empresaAdmissao", cliente.empresaAdmissao);

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
      form.setValue("avalistaDataNascimento", cliente.avalistaDataNascimento);
      form.setValue("avalistaEmpresaAdmissao", cliente.avalistaEmpresaAdmissao);

      form.setValue("tabelaPreco", String(cliente.tabelaPreco.id));
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

              {renderFoto}

              {renderObservacao}

              <p>{form.watch("rgDataEmissao")}</p>

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
