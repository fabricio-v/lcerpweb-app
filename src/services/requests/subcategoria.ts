import { ISubcategoriaResponse } from "@/interfaces/response/SubcategoriaResponse";
import api from "../axios";

export const requestSubcategoriasAvailables = async (token: string) => {
  return api.get<ISubcategoriaResponse[]>("/subcategorias/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
