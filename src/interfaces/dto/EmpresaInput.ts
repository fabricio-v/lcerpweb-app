export interface IEmpresaInput {
  id: string | null;
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
  idCidade: number;
  idEstado: number;
  idLocalEstoqueVenda: string;
}
