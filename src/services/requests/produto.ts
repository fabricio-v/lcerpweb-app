import { IProdutoInput } from "@/interfaces/dto/ProdutoInput";
import { IProdutoResponse } from "@/interfaces/response/ProdutoResponse";
import { IProdutoRefResponse } from "@/interfaces/response/ref/ProdutoRefResponse";
import api from "../axios";

export const requestProdutoById = async (
  id: number,
  idEmpresa: number,
  token: string,
) => {
  return api.get<IProdutoResponse>(
    `/produtos/id?id=${id}&idEmpresa=${idEmpresa}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
};

export const requestInsertOrUpdateProduto = async (
  produto: IProdutoInput,
  token: string,
) => {
  return api.post<IProdutoRefResponse>("/produtos", produto, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
