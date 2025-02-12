import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import api from "../axios";

export const requestEmpresasAvailables = async (token: string) => {
  return api.get<IEmpresaResponse[]>("/empresas/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestEmpresaById = async (token: string, id: string) => {
  return api.get<IEmpresaResponse>(`/empresas/${id}}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestInsertOrUpdateEmpresa = async (
  empresa: IEmpresaResponse,
  token: string,
) => {
  return api.post<IEmpresaResponse>("/empresas", empresa, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
