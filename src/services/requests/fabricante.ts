import { IFabricanteResponse } from "@/interfaces/FabricanteResponse";
import api from "../axios";

export const requestFabricantesAvailables = async (token: string) => {
  return api.get<IFabricanteResponse[]>("/fabricantes/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
