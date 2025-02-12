export interface LoginResponse {
  token: string;
  expiresIn: number;
  idUsuario: string;
  nome: string;
  email: string;
  permissoes: string[];
}
