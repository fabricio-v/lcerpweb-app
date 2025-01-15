export interface LoginResponse {
  token: string;
  expiresIn: number;
  idUsuario: number;
  nome: string;
  email: string;
  permissoes: string[];
}
