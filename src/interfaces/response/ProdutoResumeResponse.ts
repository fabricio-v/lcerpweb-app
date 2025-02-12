export interface IProdutoResumeResponse {
  id: string;
  codInterno: number;
  codigo: string;
  referencia: string;
  codigoBarras: string;
  nome: string;
  descricao: string;
  categoria: {
    id: string;
    nome: string;
  };
  subcategoria: {
    id: string;
    nome: string;
  };
  fabricante: {
    id: string;
    nome: string;
  };
  unidade: {
    id: string;
    nome: string;
  };
  estoque: number;
  precoVenda: number;
  ativo: boolean;
}
