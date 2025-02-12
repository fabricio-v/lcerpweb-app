export interface IFornecedorInput {
  id: string | null;
  ativo: boolean;
  isCliente: boolean;
  isTransportadora: boolean;
  isFuncionario: boolean;
  nome: string;
  razaoSocial: string;
  apelido: string;
  tipoPessoa: string;
  cpfCnpj: string;
  ie: string;
  im: string;
  isuf: string;
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

  contato1: string;
  contato2: string;
  contato3: string;
  email: string;
  email2: string;

  sexo: string;
  estadoCivil: string;
  obs: string;
}
