"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IFuncionarioResponse } from "@/interfaces/response/FuncionarioResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestAllFuncionarios } from "@/services/requests/funcionarios";
import { useState } from "react";

export default function useSearchFuncionario() {
  const [data, setData] = useState({
    funcionarios: [],
    totalItens: 0,
  } as {
    funcionarios: IFuncionarioResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadFuncionarios = async () =>
    //   {
    //   genericFilter,
    //   ativo,
    //   nome,
    // }: {
    //   genericFilter?: string | null;
    //   ativo?: boolean | null;
    //   nome?: string | null;
    // }
    {
      try {
        setLoading(true);

        const token = await getCookieClient(CookiesKeys.TOKEN);

        const response = await requestAllFuncionarios(token!);

        setData({
          funcionarios: response.data,
          totalItens: response.data.length,
        });
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { loadFuncionarios, data, loading };
}
