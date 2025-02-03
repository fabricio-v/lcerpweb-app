import { IEstadoResponse } from "@/interfaces/response/EstadoResponse";
import api from "../axios";

export const requestAllEstados = async (token: string) => {
  return api.get<IEstadoResponse[]>(`/estados`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
