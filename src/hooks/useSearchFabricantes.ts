"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestFabricanteByFilters } from "@/services/requests/fabricante";
import { useState } from "react";

export default function useSearchFabricantes() {
  const [data, setData] = useState({
    fabricantes: [],
    totalItens: 0,
  } as {
    fabricantes: IFabricanteResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadFabricantes = async ({
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

      const response = await requestFabricanteByFilters(
        token!,
        genericFilter || null,
        ativo === undefined ? null : ativo,
        nome || null,
      );

      setData({
        fabricantes: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadFabricantes, data, loading };
}
