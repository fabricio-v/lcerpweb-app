import { IOrigemResponse } from "@/interfaces/response/OrigemResponse";
import api from "../axios";

export const requestOrigemAvailables = async (token: string) => {
  return api.get<IOrigemResponse[]>("/origem/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
