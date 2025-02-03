import { IPessoaEnderecoInput } from "./PessoaEnderecoInput";

export interface IClienteInput {
  id: number | null;
  ativo: boolean;
  nome: string;
  razaoSocial: string;
  apelido: string;
  tipoPessoaFisicaJuridica: string;
  cpfCnpj: string;
  ieIndicador: number;
  ie: string;
  im: string;
  isuf: string;
  rg: string;
  rgOrgao: string;
  rgDataEmissao: string;
  dataNascimento: string;

  endereco: string;
  numero: string;
  bairro: string;
  referencia: string;
  cep: string;

  idCidade: number;
  idEstado: number;
  idPais: number;
  idCidadeEntrega: number | null;
  idEstadoEntrega: number | null;
  idCidadeNaturalidade: number | null;
  idEstadoNaturalidade: number | null;
  idCidadeConjuge: number | null;
  idEstadoConjuge: number | null;
  idCidadeEmpresa: number | null;
  idEstadoEmpresa: number | null;
  idCidadeFiliacao: number | null;
  idEstadoFiliacao: number | null;
  idCidadeAvalista: number | null;
  idEstadoAvalista: number | null;

  contato1: string;
  contato2: string;
  contato3: string;
  email: string;
  email2: string;

  enderecoEntrega: string;
  numeroEntrega: string;
  bairroEntrega: string;
  referenciaEntrega: string;
  cepEntrega: string;

  filiacaoPai: string;
  filiacaoPaiContato: string;
  filiacaoMae: string;
  filiacaoMaeContato: string;
  filiacaoEndereco: string;
  filiacaoNumero: string;
  filiacaoBairro: string;
  filiacaoReferencia: string;
  filiacaoCep: string;

  conjugeNome: string;
  conjugeCpf: string;
  conjugeRg: string;
  conjugeContato: string;
  conjugeEndereco: string;
  conjugeNumero: string;
  conjugeBairro: string;
  conjugeCep: string;
  conjugeDataNascimento: string;
  conjugeEmpresa: string;
  conjugeEmpresaCargo: string;
  conjugeEmpresaRenda: number;
  conjugeEmpresaAdmissao: string;

  empresaNome: string;
  empresaContato: string;
  empresaEndereco: string;
  empresaNumero: string;
  empresaBairro: string;
  empresaCep: string;
  empresaCargo: string;
  empresaRenda: number;
  empresaAdmissao: string;

  avalistaNome: string;
  avalistaCpf: string;
  avalistaRg: string;
  avalistaContato: string;
  avalistaEndereco: string;
  avalistaNumero: string;
  avalistaBairro: string;
  avalistaCep: string;
  avalistaEmpresa: string;
  avalistaEmpresaCargo: string;
  avalistaEmpresaRenda: number;
  avalistaDataNascimento: string;
  avalistaEmpresaAdmissao: string;

  idTabelaPreco: number;
  sexo: string;
  estadoCivil: string;
  limiteCredito: number;
  obs: string;
  enderecosAdicionais: IPessoaEnderecoInput[];
}
