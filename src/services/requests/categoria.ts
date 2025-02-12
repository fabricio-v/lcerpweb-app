import { ICategoriaInput } from "@/interfaces/dto/CategoriaInput";
import { ICategoriaResponse } from "@/interfaces/response/CategoriaResponse";
import api from "../axios";

export const requestCategoriaById = async (id: number, token: string) => {
  return api.get<ICategoriaResponse>(`/categorias/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

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
  ativo: boolean | null,
  nome: string | null,
) => {
  return api.get<ICategoriaResponse[]>("/categorias", {
    params: {
      filter: genericFilter,
      ativo,
      nome,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestInsertOrUpdateCategoria = async (
  categoria: ICategoriaInput,
  token: string,
) => {
  return api.post<ICategoriaResponse>("/categorias", categoria, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestChangeStatusCategoria = async (
  token: string,
  idCategoria: string,
  status: boolean,
) => {
  return api.post<ICategoriaResponse>(
    `/categorias/${idCategoria}/change-status`,
    {},
    {
      params: { status },
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
};
