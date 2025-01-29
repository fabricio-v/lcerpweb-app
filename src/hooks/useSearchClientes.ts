"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { IClienteResponse } from "@/interfaces/response/ClienteResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { requestClientesByFilters } from "@/services/requests/cliente";
import { useState } from "react";

export default function useSearchClientes() {
  const [data, setData] = useState({
    clientes: [],
    totalPaginas: 1,
    totalItens: 0,
  } as {
    clientes: IClienteResponse[];
    totalPaginas: number;
    totalItens: number;
  });

  const itensPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);

  const loadClientes = async ({
    genericFilter,
    ativo,
    nome,
    idCidade,
    idEstado,
    page,
  }: {
    genericFilter?: string | null;
    ativo?: boolean | null;
    nome?: string | null;
    idCidade?: number | null;
    idEstado?: number | null;
    page: number;
  }) => {
    try {
      setLoading(true);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestClientesByFilters(
        token!,
        genericFilter || null,
        ativo === undefined ? null : ativo,
        nome || null,
        idCidade || null,
        idEstado || null,
        page,
        itensPerPage,
      );

      const { content, totalPages, totalElements, last } = response.data;

      setData({
        clientes: content,
        totalItens: totalElements,
        totalPaginas: totalPages > 0 ? totalPages : 1,
      });

      setIsLastPage(last);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loadClientes, data, loading, isLastPage, itensPerPage };
}
