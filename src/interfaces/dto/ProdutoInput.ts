export interface IProdutoInput {
  id: string | null;
  nome: string;
  descricao: string;
  codigo: string;
  referencia: string;
  codigoBarras: string;
  ativo: boolean;
  idCategoria: string;
  idSubcategoria: string;
  idFabricante: string;
  idUnidade: string;
  precoCusto: number;
  precoVenda: number;
  markup: number;
  margemLucro: number;
  podeGrade: boolean;
  tipoGrade: string | null;
  empresas: string[];
  precosTabelaPreco: IProdutoPrecosTabelaPrecoInput[];
  precosLeveXPagueY: IProdutoPrecoLeveXPagueYInput[];
  precosAtacado: IProdutoPrecoAtacadoInput[];
  tributacao: {
    idCst: string;
    idCfop: string;
    idNcm: string;
    idCest: string;
    idOrigem: string;
  };
  variacoes: IProdutoVariacaoInput[];
  codigosAdicionais: string[];
}

export interface IProdutoVariacaoInput {
  id: string | null;
  idProduto: string;
  codigo: string;
  variacao: string;
}

export interface IProdutoPrecosTabelaPrecoInput {
  idTabelaPreco: number;
  preco: number;
  markup: number;
  margemLucro: number;
}

export interface IProdutoPrecoLeveXPagueYInput {
  preco: number;
  markup: number;
  margemLucro: number;
  quantidadeMinima: number;
}

export interface IProdutoPrecoAtacadoInput {
  idUnidade: string;
  codigo: string;
  quantidade: number;
  preco: number;
  markup: number;
  margemLucro: number;
}

// export interface IProdutoPrecosAdicionaisInput {
//   idTabelaPreco: number;
//   preco: number;
//   markup: number;
//   margemLucro: number;
//   quantidadeMinima: number;
// }
