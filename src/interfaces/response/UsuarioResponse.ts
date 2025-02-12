import { IUsuarioFuncaoResponse } from "./UsuarioFuncaoResponse";

export interface IUsuarioResponse {
  id: string;
  codInterno: number;
  nome: string;
  grupo: string;
  funcao: IUsuarioFuncaoResponse;
  email: string;
  ativo: boolean;
  permissoes: string[];
}
