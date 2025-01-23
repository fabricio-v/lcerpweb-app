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
  podeGrade: boolean;
  tipoGrade: string | null;
  empresas: number[];
  precosAdicionais: IProdutoPrecosAdicionaisInput[];
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

export interface IProdutoPrecosAdicionaisInput {
  idTabelaPreco: number;
  preco: number;
  markup: number;
  margemLucro: number;
  quantidadeMinima: number;
}
