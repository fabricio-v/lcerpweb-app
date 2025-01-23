import { ICestResponse } from "@/interfaces/response/CestResponse";
import api from "../axios";

export const requestCestAvailables = async (token: string) => {
  return api.get<ICestResponse[]>("/cest/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestCestByFilter = async (token: string, filter: string) => {
  return api.get<ICestResponse[]>("/cest", {
    params: { filter },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
