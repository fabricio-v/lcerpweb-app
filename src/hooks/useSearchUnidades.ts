"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestUnidadesByFilters } from "@/services/requests/unidade";
import { useState } from "react";

export default function useSearchUnidades() {
  const [data, setData] = useState({
    unidades: [],
    totalItens: 0,
  } as {
    unidades: IUnidadeResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadUnidades = async ({
    genericFilter,
    ativo,
    nome,
    descricao,
  }: {
    genericFilter?: string | null;
    ativo?: boolean | null;
    nome?: string | null;
    descricao?: string | null;
  }) => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestUnidadesByFilters(
        token!,
        genericFilter || null,
        ativo === undefined ? null : ativo,
        nome || null,
        descricao || null,
      );

      setData({
        unidades: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadUnidades, data, loading };
}
