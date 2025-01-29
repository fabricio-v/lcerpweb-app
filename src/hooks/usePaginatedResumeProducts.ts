"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IProdutoResumeResponse } from "@/interfaces/response/ProdutoResumeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestProdutoResumeByFilters } from "@/services/requests/produto";
import { useState } from "react";
export default function usePaginatedResumeProducts() {
  const [data, setData] = useState({
    products: [],
    totalPages: 1,
    totalElements: 0,
  } as {
    products: IProdutoResumeResponse[];
    totalPages: number;
    totalElements: number;
  });

  const itensPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);

  const loadProducts = async ({
    genericFilter,
    ativo,
    nome,
    descricao,
    codigoInterno,
    codigoBarras,
    codigo,
    referencia,
    idCategoria,
    idSubcategoria,
    idFabricante,
    idUnidade,
    page,
  }: {
    genericFilter?: string | null;
    ativo?: boolean | null;
    nome?: string | null;
    descricao?: string | null;
    codigoInterno?: string | null;
    codigoBarras?: string | null;
    codigo?: string | null;
    referencia?: string | null;
    idCategoria?: number | null;
    idSubcategoria?: number | null;
    idFabricante?: number | null;
    idUnidade?: number | null;
    page: number;
  }) => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);
      const companySelected = await getCookieClient(
        CookiesKeys.COMPANY_SELECTED_ID,
      );

      // setData({ products: [], totalPages: 0, totalElements: 0 });

      const response = await requestProdutoResumeByFilters(
        token!,
        genericFilter || null,
        ativo === undefined ? null : ativo,
        nome || null,
        descricao || null,
        codigoInterno || null,
        codigoBarras || null,
        codigo || null,
        referencia || null,
        idCategoria || null,
        idSubcategoria || null,
        idFabricante || null,
        idUnidade || null,
        Number(companySelected),
        page,
        itensPerPage,
      );

      const { content, totalPages, totalElements, last } = response.data;

      setData({
        products: content,
        totalPages,
        totalElements,
      });
      setIsLastPage(last);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { loadProducts, data, loading, itensPerPage, isLastPage };
}
