import { ICidadeResponse } from "./CidadeResponse";
import { IEstadoResponse } from "./EstadoResponse";

export interface IClienteResponse {
  id: number;
  ativo: boolean;
  nome: string;
  razaoSocial: string;
  apelido: string;
  cpfCnpj: string;
  tipoPessoaFisicaJuridica: string;
  endereco: string;
  numero: string;
  bairro: string;
  referencia: string;
  cep: string;
  contato1: string;
  contato2: string;
  contato3: string;
  email: string;
  email2: string;
  cidade: ICidadeResponse;
  estado: IEstadoResponse;
}
