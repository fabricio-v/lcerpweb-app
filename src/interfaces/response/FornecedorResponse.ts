import { ICidadeResponse } from "./CidadeResponse";
import { IEstadoResponse } from "./EstadoResponse";
import { IPaisResponse } from "./PaisResponse";

export interface IFornecedorResponse {
  id: string;
  codInterno: number;
  ativo: boolean;
  isCliente: boolean;
  isFornecedor: boolean;
  isTransportadora: boolean;
  isFuncionario: boolean;
  tipoPessoa: string;
  nome: string;
  razaoSocial: string;
  apelido: string;
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
  cidade: ICidadeResponse;
  estado: IEstadoResponse;
  pais: IPaisResponse;
  contato1: string;
  contato2: string;
  contato3: string;
  email: string;
  email2: string;

  sexo: string;
  estadoCivil: string;
  obs: string;
  datahoraCadastro: string;
}
