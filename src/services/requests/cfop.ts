import { ICfopResponse } from "@/interfaces/response/CfopResponse";
import api from "../axios";

export const requestCfopAvailables = async (token: string) => {
  return api.get<ICfopResponse[]>("/cfop/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestCfopByFilter = async (token: string, filter: string) => {
  return api.get<ICfopResponse[]>("/cfop", {
    params: { filter },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
