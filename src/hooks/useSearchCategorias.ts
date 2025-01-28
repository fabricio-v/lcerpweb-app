"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { ICategoriaResponse } from "@/interfaces/response/CategoriaResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestCategoriasByFilters } from "@/services/requests/categoria";
import { useState } from "react";

export default function useSearchCategorias() {
  const [data, setData] = useState({
    cateorias: [],
    totalItens: 0,
  } as {
    cateorias: ICategoriaResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadCategorias = async ({
    genericFilter,
    ativo,
    nome,
  }: {
    genericFilter?: string | null;
    ativo?: boolean | null;
    nome?: string | null;
  }) => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestCategoriasByFilters(
        token!,
        genericFilter || null,
        ativo === undefined ? null : ativo,
        nome || null,
      );

      setData({
        cateorias: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadCategorias, data, loading };
}
