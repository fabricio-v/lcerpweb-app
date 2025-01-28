import { ISubcategoriaInput } from "@/interfaces/dto/SubcategoriaInput";
import { ISubcategoriaResponse } from "@/interfaces/response/SubcategoriaResponse";
import api from "../axios";

export const requestSubcategoriaById = async (id: number, token: string) => {
  return api.get<ISubcategoriaResponse>(`/subcategorias/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestSubcategoriasAvailables = async (token: string) => {
  return api.get<ISubcategoriaResponse[]>("/subcategorias/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestSubcategoriaByFilters = async (
  token: string,
  genericFilter: string | null,
  ativo: boolean | null,
  nome: string | null,
) => {
  return api.get<ISubcategoriaResponse[]>("/subcategorias", {
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

export const requestInsertOrUpdateSubcategoria = async (
  fabricante: ISubcategoriaInput,
  token: string,
) => {
  return api.post<ISubcategoriaResponse>("/subcategorias", fabricante, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestChangeStatusSubcategoria = async (
  token: string,
  idSubcategoria: number,
  status: boolean,
) => {
  return api.post<ISubcategoriaResponse>(
    `/subcategorias/${idSubcategoria}/change-status`,
    {},
    {
      params: { status },
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
};
