import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import api from "../axios";

export const requestEmpresasAvailables = async (token: string) => {
  return api.get<IEmpresaResponse[]>("/empresas/availables", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
