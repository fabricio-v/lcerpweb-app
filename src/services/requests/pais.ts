import { IPaisResponse } from "@/interfaces/response/PaisResponse";
import api from "../axios";

export const requestAllPaises = async (token: string) => {
  return api.get<IPaisResponse[]>(`/paises`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
