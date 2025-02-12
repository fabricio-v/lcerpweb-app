"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { getCookieClient } from "@/lib/cookieClient";
import { requestGruposUsuario } from "@/services/requests/grupoUsuario";
import { useState } from "react";

export default function useSearchGruposUsuario() {
  const [data, setData] = useState({
    gruposUsuario: [],
    totalItens: 0,
  } as {
    gruposUsuario: string[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadGruposUsuario = async () => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestGruposUsuario(token!);

      setData({
        gruposUsuario: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadGruposUsuario, data, loading };
}
