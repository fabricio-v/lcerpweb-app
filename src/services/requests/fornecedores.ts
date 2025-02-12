import { IFornecedorInput } from "@/interfaces/dto/FornecedorInput";
import { IFornecedorResponse } from "@/interfaces/response/FornecedorResponse";
import api from "../axios";

export const requestFornecedorById = async (token: string, id: number) => {
  return api.get<IFornecedorResponse>(`/fornecedores/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestAllFornecedores = async (token: string) => {
  return api.get<IFornecedorResponse[]>("/fornecedores", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestInsertOrUpdateFornecedor = async (
  fornecedor: IFornecedorInput,
  token: string,
) => {
  return api.post<IFornecedorResponse>("/fornecedores", fornecedor, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
