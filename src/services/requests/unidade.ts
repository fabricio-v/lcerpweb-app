import { IUnidadeResponse } from "@/interfaces/UnidadeResponse";
import api from "../axios";

export const requestUnidadesAll = async (token: string) => {
  return api.get<IUnidadeResponse[]>("/unidades/all", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestUnidadesAvailables = async (token: string) => {
  return api.get<IUnidadeResponse[]>("/unidades/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
