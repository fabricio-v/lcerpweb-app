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
  precos: [
    {
      tabelaPrecoId: number;
      tabelaPrecoNome: string;
      preco: number;
      markup: number;
      margemLucro: number;
      quantidadeMinima: number;
    },
    {
      tabelaPrecoId: number;
      tabelaPrecoNome: string;
      preco: number;
      markup: number;
      margemLucro: number;
      quantidadeMinima: number;
    },
  ];
  empresas: number[];
  tributacao: {
    cfop: {
      id: number;
      codigo: string;
    };
    cst: {
      id: number;
      codigo: string;
    };
    ncm: {
      id: number;
      codigo: string;
    };
    cest: {
      id: number;
      codigo: string;
    };
  };
  variacoes: [
    {
      id: number;
      codigo: string;
      variacao: string;
      estoque: [];
    },
    {
      id: number;
      codigo: string;
      variacao: string;
      estoque: [];
    },
    {
      id: number;
      codigo: string;
      variacao: string;
      estoque: [];
    },
  ];
}
