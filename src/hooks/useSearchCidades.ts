"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { ICidadeResponse } from "@/interfaces/response/CidadeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestCidadesByFilter } from "@/services/requests/cidade";
import { useState } from "react";

export default function useSearchCidades() {
  const [dataCidades, setDataCidades] = useState({
    cidades: [],
    totalItens: 0,
  } as {
    cidades: ICidadeResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadCidades = async (idEstado: number | null, filter: string) => {
    try {
      setLoading(true);

      if (idEstado === null || filter.trim() === "") {
        setDataCidades({ cidades: [], totalItens: 0 });
        return;
      }

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestCidadesByFilter(token!, idEstado, filter);

      setDataCidades({
        cidades: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadCidades, dataCidades, loading };
}
