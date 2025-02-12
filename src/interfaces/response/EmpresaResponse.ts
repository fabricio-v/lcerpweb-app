export interface IEmpresaResponse {
  id: string;
  codInterno: number;
  ativo: boolean;
  matriz: boolean;
  cnpj: string;
  nome: string;
  razaoSocial: string;
  endereco: string;
  numero: string;
  bairro: string;
  cep: string;
  contato1: string;
  contato2: string;
  contato3: string;
  email: string;
  cidade: {
    id: number;
    nome: string;
  };
  estado: {
    id: number;
    uf: string;
    nome: string;
  };
  localEstoqueVenda: {
    id: string;
    nome: string;
  };
}
