import { INcmResponse } from "@/interfaces/response/NcmResponse";
import api from "../axios";

export const requestNcmAvailables = async (token: string) => {
  return api.get<INcmResponse[]>("/ncm/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestNcmByFilter = async (token: string, filter: string) => {
  return api.get<INcmResponse[]>("/ncm", {
    params: { filter },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
