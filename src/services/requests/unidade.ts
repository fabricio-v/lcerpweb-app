import { IUnidadeInput } from "@/interfaces/dto/UnidadeInput";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import api from "../axios";

export const requestUnidadesAll = async (token: string) => {
  return api.get<IUnidadeResponse[]>("/unidades/all", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestUnidadeById = async (id: number, token: string) => {
  return api.get<IUnidadeResponse>(`/unidades/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestUnidadesAvailables = async (token: string) => {
  return api.get<IUnidadeResponse[]>("/unidades/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestUnidadesByFilters = async (
  token: string,
  genericFilter: string | null,
  ativo: boolean | null,
  nome: string | null,
  descricao: string | null,
) => {
  return api.get<IUnidadeResponse[]>("/unidades", {
    params: {
      filter: genericFilter,
      ativo,
      nome,
      descricao,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestInsertOrUpdateUnidade = async (
  unidade: IUnidadeInput,
  token: string,
) => {
  return api.post<IUnidadeResponse>("/unidades", unidade, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestChangeStatusUnidade = async (
  token: string,
  idCategoria: string,
  status: boolean,
) => {
  return api.post<IUnidadeResponse>(
    `/unidades/${idCategoria}/change-status`,
    {},
    {
      params: { status },
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
};
