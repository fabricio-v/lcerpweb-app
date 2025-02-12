export interface IFuncionarioInput {
  id: string | null;
  ativo: boolean;
  isCliente: boolean;
  isFornecedor: boolean;
  isTransportadora: boolean;
  isFuncionario: boolean;
  tipoPessoa: string;
  nome: string;
  apelido: string;
  cpfCnpj: string;
  rg: string;
  rgOrgao: string;
  rgDataEmissao: string | null;
  dataNascimento: string | null;

  endereco: string;
  numero: string;
  bairro: string;
  referencia: string;
  cep: string;

  idCidade: number;
  idEstado: number;
  idPais: number;
  idPaisNacionalidade: number | null;
  idCidadeNaturalidade: number | null;
  idEstadoNaturalidade: number | null;
  idCidadeConjuge: number | null;
  idEstadoConjuge: number | null;

  idCidadeFiliacao: number | null;
  idEstadoFiliacao: number | null;

  contato1: string;
  contato2: string;
  contato3: string;
  email: string;
  email2: string;

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
  conjugeDataNascimento: string | null;
  conjugeEmpresa: string;
  conjugeEmpresaCargo: string;
  conjugeEmpresaRenda: number;
  conjugeEmpresaAdmissao: string | null;

  funcionarioStatus: string;
  funcionarioCtps: string | null;
  funcionarioSalario: number | null;
  funcionarioDataAdmissao: string | null;
  funcionarioDataDemissao: string | null;
  funcionarioDataAfastamento: string | null;

  sexo: string;
  estadoCivil: string;
  obs: string;

  usuario: IUsuarioInput | null;
}

export interface IUsuarioInput {
  id: string | null;
  grupo: string;
  idUsuarioFuncao: number;
  ativo: boolean;
  master: boolean;
  nome: string;
  email: string;
  senha: string;
  descontoPermitido: number;
  permissoes: string[];
}
