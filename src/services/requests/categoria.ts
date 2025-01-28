import { ICategoriaResponse } from "@/interfaces/response/CategoriaResponse";
import api from "../axios";

export const requestCategoriasAvailables = async (token: string) => {
  return api.get<ICategoriaResponse[]>("/categorias/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestCategoriasByFilters = async (
  token: string,
  genericFilter: string | null,
) => {
  return api.get<ICategoriaResponse[]>("/categorias", {
    params: {
      filter: genericFilter,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
