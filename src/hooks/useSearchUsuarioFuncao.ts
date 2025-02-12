"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IUsuarioFuncaoResponse } from "@/interfaces/response/UsuarioFuncaoResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestUsuarioFuncoesAvailables } from "@/services/requests/usuarioFuncao";
import { useState } from "react";

export default function useSearchUsuarioFuncao() {
  const [dataUsuarioFuncao, setDataUsuarioFuncao] = useState({
    usuarioFuncao: [],
    totalItens: 0,
  } as {
    usuarioFuncao: IUsuarioFuncaoResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadUsuarioFuncao = async () => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestUsuarioFuncoesAvailables(token!);

      setDataUsuarioFuncao({
        usuarioFuncao: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadUsuarioFuncao, dataUsuarioFuncao, loading };
}
