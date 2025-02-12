"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestEmpresasAvailables } from "@/services/requests/empresa";
import { useState } from "react";

export default function useSearchEmpresa() {
  const [data, setData] = useState({
    empresas: [],
    totalItens: 0,
  } as {
    empresas: IEmpresaResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadEmpresas = async () => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestEmpresasAvailables(token!);

      setData({
        empresas: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadEmpresas, data, loading };
}
