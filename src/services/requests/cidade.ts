import { ICidadeResponse } from "@/interfaces/response/CidadeResponse";
import api from "../axios";

export const requestCidadesByEstado = async (
  token: string,
  idEstado: number,
) => {
  return api.get<ICidadeResponse[]>(`/cidades/estado/${idEstado}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
