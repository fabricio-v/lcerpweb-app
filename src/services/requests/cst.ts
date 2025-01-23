import { ICstResponse } from "@/interfaces/response/CstResponse";
import api from "../axios";

export const requestCstAvailables = async (token: string) => {
  return api.get<ICstResponse[]>("/cst/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
