import { IUsuarioFuncaoResponse } from "@/interfaces/response/UsuarioFuncaoResponse";
import api from "../axios";

export const requestUsuarioFuncoesAvailables = async (token: string) => {
  return api.get<IUsuarioFuncaoResponse[]>(`/usuario-funcoes`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
