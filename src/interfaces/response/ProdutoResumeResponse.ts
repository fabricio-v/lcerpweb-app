export interface IProdutoResumeResponse {
  id: number;
  codigo: string;
  referencia: string;
  codigoBarras: string;
  nome: string;
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
