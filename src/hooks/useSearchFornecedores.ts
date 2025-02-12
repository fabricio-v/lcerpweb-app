"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IFornecedorResponse } from "@/interfaces/response/FornecedorResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestAllFornecedores } from "@/services/requests/fornecedores";
import { useState } from "react";

export default function useSearchFornecedor() {
  const [data, setData] = useState({
    fornecedores: [],
    totalItens: 0,
  } as {
    fornecedores: IFornecedorResponse[];
    totalItens: number;
  });

  const [loading, setLoading] = useState(true);

  const loadFornecedores = async () => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestAllFornecedores(token!);

      setData({
        fornecedores: response.data,
        totalItens: response.data.length,
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadFornecedores, data, loading };
}
