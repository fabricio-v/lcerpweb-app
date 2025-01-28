export interface IProdutoInput {
  id: number | null;
  nome: string;
  descricao: string;
  codigo: string;
  referencia: string;
  codigoBarras: string;
  ativo: boolean;
  idCategoria: number;
  idSubcategoria: number;
  idFabricante: number;
  idUnidade: number;
  precoCusto: number;
  precoVenda: number;
  markup: number;
  margemLucro: number;
  podeGrade: boolean;
  tipoGrade: string | null;
  empresas: number[];
  precosTabelaPreco: IProdutoPrecosTabelaPrecoInput[];
  precosLeveXPagueY: IProdutoPrecoLeveXPagueYInput[];
  precosAtacado: IProdutoPrecoAtacadoInput[];
  tributacao: {
    idCst: number;
    idCfop: number;
    idNcm: number;
    idCest: number;
    idOrigem: number;
  };
  variacoes: IProdutoVariacaoInput[];
  codigosAdicionais: string[];
}

export interface IProdutoVariacaoInput {
  id: number | null;
  idProduto: number;
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
  idUnidade: number;
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
