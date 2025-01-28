import { IFabricanteInput } from "@/interfaces/dto/FabricanteInput";
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";
import api from "../axios";

export const requestFabricanteById = async (id: number, token: string) => {
  return api.get<IFabricanteResponse>(`/fabricantes/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestFabricantesAvailables = async (token: string) => {
  return api.get<IFabricanteResponse[]>("/fabricantes/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestFabricanteByFilters = async (
  token: string,
  genericFilter: string | null,
  ativo: boolean | null,
  nome: string | null,
) => {
  return api.get<IFabricanteResponse[]>("/fabricantes", {
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

export const requestInsertOrUpdateFabricante = async (
  fabricante: IFabricanteInput,
  token: string,
) => {
  return api.post<IFabricanteResponse>("/fabricantes", fabricante, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestChangeStatusFabricante = async (
  token: string,
  idFabricante: number,
  status: boolean,
) => {
  return api.post<IFabricanteResponse>(
    `/fabricantes/${idFabricante}/change-status`,
    {},
    {
      params: { status },
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
};
