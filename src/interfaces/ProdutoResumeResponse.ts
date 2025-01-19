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
    descricao: string;
  };
  estoque: number;
  precoVenda: number;
}
