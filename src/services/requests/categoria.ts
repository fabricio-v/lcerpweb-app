import { ICategoriaResponse } from "@/interfaces/CategoriaResponse";
import api from "../axios";

export const requestCategoriasAvailables = async (token: string) => {
  return api.get<ICategoriaResponse[]>("/categorias/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
