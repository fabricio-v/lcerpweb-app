"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IEstadoResponse } from "@/interfaces/response/EstadoResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestAllEstados } from "@/services/requests/estado";
import { useState } from "react";

export default function useSearchEstados() {
  const [dataEstados, setDataEstados] = useState({
    estados: [],
    totalItens: 0,
  } as {
    estados: IEstadoResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadEstados = async () => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestAllEstados(token!);

      setDataEstados({
        estados: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadEstados, dataEstados, loading };
}
