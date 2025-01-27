import { IProdutoInput } from "@/interfaces/dto/ProdutoInput";
import { IProdutoResponse } from "@/interfaces/response/ProdutoResponse";
import { IProdutoResumeResponse } from "@/interfaces/response/ProdutoResumeResponse";
import { IProdutoRefResponse } from "@/interfaces/response/ref/ProdutoRefResponse";
import { IResponsePaged } from "@/interfaces/response/ResponsePaged";
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

export const requestProdutoResumeByFilters = async (
  token: string,
  ativo: boolean | null,
  nome: string | null,
  descricao: string | null,
  codigoInterno: string | null,
  codigoBarras: string | null,
  codigo: string | null,
  referencia: string | null,
  idCategoria: number | null,
  idSubcategoria: number | null,
  idFabricante: number | null,
  idUnidade: number | null,
  idEmpresa: number,
  page: number,
  size: number,
) => {
  return api.get<IResponsePaged<IProdutoResumeResponse>>(`/produtos`, {
    params: {
      ativo,
      nome,
      descricao,
      id: codigoInterno,
      codigoBarras,
      codigo,
      referencia,
      idCategoria,
      idSubcategoria,
      idFabricante,
      idUnidade,
      idEmpresa,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const requestInsertOrUpdateProduto = async (
  produto: IProdutoInput,
  token: string,
  idEmpresa: string,
) => {
  return api.post<IProdutoRefResponse>("/produtos", produto, {
    params: { idEmpresa },
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
