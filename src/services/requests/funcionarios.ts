import { IFuncionarioInput } from "@/interfaces/dto/FuncionarioInput";
import { IFuncionarioResponse } from "@/interfaces/response/FuncionarioResponse";
import api from "../axios";

export const requestFuncionarioById = async (token: string, id: number) => {
  return api.get<IFuncionarioResponse>(`/funcionarios/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestAllFuncionarios = async (token: string) => {
  return api.get<IFuncionarioResponse[]>("/funcionarios", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestInsertOrUpdateFuncionario = async (
  funcionario: IFuncionarioInput,
  token: string,
) => {
  return api.post<IFuncionarioResponse>("/funcionarios", funcionario, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
