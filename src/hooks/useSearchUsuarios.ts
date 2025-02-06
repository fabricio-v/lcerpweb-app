"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IUsuarioResponse } from "@/interfaces/response/UsuarioResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestAllUsuarios } from "@/services/requests/usuario";
import { useState } from "react";

export default function useSearchUsuarios() {
  const [data, setData] = useState({
    usuarios: [],
    totalItens: 0,
  } as {
    usuarios: IUsuarioResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadUsuarios = async () =>
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

        const response = await requestAllUsuarios(token!);

        setData({
          usuarios: response.data,
          totalItens: response.data.length,
        });
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { loadUsuarios, data, loading };
}
