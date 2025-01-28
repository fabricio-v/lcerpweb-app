import { ICestResponse } from "./CestResponse";
import { ICfopResponse } from "./CfopResponse";
import { ICstResponse } from "./CstResponse";
import { INcmResponse } from "./NcmResponse";
import { IOrigemResponse } from "./OrigemResponse";
import { IUnidadeRefResponse } from "./ref/UnidadeRefResponse";

export interface IProdutoResponse {
  id: number | undefined;
  ativo: boolean;
  codigo: string;
  referencia: string;
  codigoBarras: string;
  nome: string;
  descricao: string;
  precoVenda: number;
  precoCusto: number;
  markup: number;
  margemLucro: number;
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
  precosTabelaPreco: IProdutoPrecoTabelaPrecoResponse[];
  precosLeveXPagueY: IProdutoPrecoLeveXPagueYResponse[];
  precosAtacado: IProdutoPrecoAtacadoResponse[];
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

export interface IProdutoPrecoTabelaPrecoResponse {
  id: number;
  tabelaPrecoId: number;
  tabelaPrecoNome: string;
  preco: number;
  markup: number;
  margemLucro: number;
}

export interface IProdutoPrecoLeveXPagueYResponse {
  id: number;
  preco: number;
  markup: number;
  margemLucro: number;
  quantidadeMinima: number;
}

export interface IProdutoPrecoAtacadoResponse {
  id: number;
  unidade: IUnidadeRefResponse;
  codigo: string;
  quantidade: number;
  preco: number;
  markup: number;
  margemLucro: number;
}

// export interface IProdutoPrecoResponse {
//   id: number;
//   tabelaPrecoId?: number;
//   tabelaPrecoNome?: string;
//   preco: number;
//   markup: number;
//   margemLucro: number;
//   quantidadeMinima: number;
// }

// export interface IProdutoCodigoEmbalagemResponse {
//   id: number;
//   idUnidade: number;
//   nomeUnidade: string;
//   codigo: string;
//   quantidade: number;
//   preco: number;
//   total: number;
//   markup: number;
//   margemLucro: number;
// }

export interface IProdutoVariacaoResponse {
  id: number;
  codigo: string;
  variacao: string;
  estoque: [];
}
