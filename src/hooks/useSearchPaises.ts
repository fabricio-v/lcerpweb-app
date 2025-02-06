"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IPaisResponse } from "@/interfaces/response/PaisResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestPaisesByFilter } from "@/services/requests/pais";
import { useState } from "react";

export default function useSearchPaises() {
  const [dataPaises, setDataPaises] = useState({
    paises: [],
    totalItens: 0,
  } as {
    paises: IPaisResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadPaises = async (filter: string) => {
    try {
      setLoading(true);

      if (filter.trim() === "") {
        setDataPaises({ paises: [], totalItens: 0 });
        return;
      }

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestPaisesByFilter(token!, filter);

      setDataPaises({
        paises: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadPaises, dataPaises, loading };
}
