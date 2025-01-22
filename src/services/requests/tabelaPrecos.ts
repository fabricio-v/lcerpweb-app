import { ITabelaPrecosResponse } from "@/interfaces/TabelaPrecosResponse";
import api from "../axios";

export const requestTabelaPrecosAvailables = async (token: string) => {
  return api.get<ITabelaPrecosResponse[]>("/tabela-precos/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
