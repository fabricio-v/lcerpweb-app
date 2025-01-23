import { ICestResponse } from "./CestResponse";
import { ICfopResponse } from "./CfopResponse";
import { ICstResponse } from "./CstResponse";
import { INcmResponse } from "./NcmResponse";
import { IOrigemResponse } from "./OrigemResponse";

export interface IProdutoResponse {
  id: number | undefined;
  codigo: string;
  referencia: string;
  codigoBarras: string;
  nome: string;
  descricao: string;
  categoria: {
    id: number;
    nome: string;
  };
  subcategoria: {
    id: number;
    nome: string;
  };
  fabricante: {
    id: number;
    nome: string;
  };
  unidade: {
    id: number;
    nome: string;
  };
  precos: IProdutoPrecoResponse[];
  empresas: number[];
  tributacao: {
    cfop: ICfopResponse;
    cst: ICstResponse;
    ncm: INcmResponse;
    cest: ICestResponse;
    origem: IOrigemResponse;
  };
  variacoes: IProdutoVariacaoResponse[];
}

export interface IProdutoPrecoResponse {
  id: number;
  tabelaPrecoId: number;
  tabelaPrecoNome: string;
  preco: number;
  markup: number;
  margemLucro: number;
  quantidadeMinima: number;
}

export interface IProdutoVariacaoResponse {
  id: number;
  codigo: string;
  variacao: string;
  estoque: [];
}
