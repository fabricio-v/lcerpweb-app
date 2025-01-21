import { IProdutoResponse } from "@/interfaces/ProdutoResponse";
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
