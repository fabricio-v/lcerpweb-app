import { IUsuarioResponse } from "@/interfaces/response/UsuarioResponse";
import api from "../axios";

export const requestAllUsuarios = async (token: string) => {
  return api.get<IUsuarioResponse[]>("/usuarios", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
