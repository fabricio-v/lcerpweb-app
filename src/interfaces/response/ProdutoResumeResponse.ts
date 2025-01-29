export interface IProdutoResumeResponse {
  id: number;
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
  estoque: number;
  precoVenda: number;
  ativo: boolean;
}
