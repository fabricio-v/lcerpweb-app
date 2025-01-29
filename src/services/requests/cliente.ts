import { IClienteResponse } from "@/interfaces/response/ClienteResponse";
import { IResponsePaged } from "@/interfaces/response/ResponsePaged";
import api from "../axios";

export const requestClientesByFilters = async (
  token: string,
  genericFilter: string | null,
  ativo: boolean | null,
  nome: string | null,
  cidade: number | null,
  estado: number | null,
  page: number,
  size: number,
) => {
  return api.get<IResponsePaged<IClienteResponse>>("/clientes", {
    params: {
      filter: genericFilter,
      ativo,
      nome,
      cidade,
      estado,
      page,
      size,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
