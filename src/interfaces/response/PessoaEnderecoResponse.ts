import { ICidadeResponse } from "./CidadeResponse";
import { IEstadoResponse } from "./EstadoResponse";

export interface IPessoaEnderecoResponse {
  cidade: ICidadeResponse;
  estado: IEstadoResponse;
  descricao: string;
  endereco: string;
  numero: string;
  bairro: string;
  referencia: string;
  cep: string;
}
