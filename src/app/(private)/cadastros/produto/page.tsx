"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoResumeResponse } from "@/interfaces/response/ProdutoResumeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { cn } from "@/lib/utils";
import { requestProdutoResumeByFilters } from "@/services/requests/produto";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Filter from "./components/filter";
import { TableProdutos, TableProdutosPagination } from "./components/table";

function CadastrosProduto() {
  const { push, back } = useRouter();

  const isMobile = useIsMobile();

  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [produtoList, setProdutoList] = useState<
    IProdutoResumeResponse[] | undefined
  >(undefined);

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // paginação

  const searchProduto = async (filter: string) => {
    try {
      setIsLoadingSearch(true);
      setProdutoList([]);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const companySelected = await getCookieClient(
        CookiesKeys.COMPANY_SELECTED_ID,
      );

      // const response = await api.get<IProdutoResumeResponse[]>(
      //   `/produtos/resume?filter=${filter}&idEmpresa=${companySelected}`,
      //   {
      //     headers: {
      //       Authorization: "Bearer " + token,
      //     },
      //   },
      // );

      const response = await requestProdutoResumeByFilters(
        token!,
        null,
        filter,
        null,
        filter,
        filter,
        filter,
        filter,
        null,
        null,
        null,
        null,
        Number(companySelected),
        0,
        0,
      );

      if (response.status === 200) {
        console.log(response.data);
        setProdutoList(response.data.content);
      }

      setIsLoadingSearch(false);
    } catch (error: any) {
      setIsLoadingSearch(false);
      if (error?.response?.status < 500) {
        toast.warning(Messages.TOAST_INFO_TITLE, {
          description: buildMessageException(error),
        });
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  };

  const pesquisaAvancadaProduto = async (
    ativo: boolean | null,
    nome: string | null,
    descricao: string | null,
    codigoInterno: string | null,
    codigoBarras: string | null,
    codigo: string | null,
    referencia: string | null,
    idCategoria: number | null,
    idSubcategoria: number | null,
    idFabricante: number | null,
    idUnidade: number | null,
  ) => {
    try {
      setIsLoadingSearch(true);
      setProdutoList([]);

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const companySelected = await getCookieClient(
        CookiesKeys.COMPANY_SELECTED_ID,
      );

      const response = await requestProdutoResumeByFilters(
        token!,
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
        Number(companySelected),
        0,
        0,
      );

      if (response.status === 200) {
        alert("entrou aqui");
        setProdutoList(response.data.content);
      }

      setIsLoadingSearch(false);
    } catch (error: any) {
      setIsLoadingSearch(false);
      if (error?.response?.status < 500) {
        toast.warning(Messages.TOAST_INFO_TITLE, {
          description: buildMessageException(error),
        });
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  };

  return (
    <main className="flex h-[calc(100vh-50px)] flex-1 flex-col overflow-auto overflow-x-hidden bg-lc-gray-light px-3 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Cadastros</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Produtos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* TITLE */}
      <div className="mt-3 flex flex-col rounded-lg bg-white p-4 dark:bg-lc-tertiary">
        <div className="flex gap-1.5 pb-3">
          <button
            onClick={() => {
              back();
            }}
          >
            <ChevronLeft size={25} />
          </button>
          <h1>Listagem de produtos</h1>
        </div>

        {/* PESQUISA / NOVO */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Filter
            onSearch={searchProduto}
            onAdvancedSearch={pesquisaAvancadaProduto}
          />

          <div className="flex flex-1 justify-end">
            <Button
              className={cn(
                "bg-lc-sunsetsky-light hover:bg-lc-sunsetsky",
                isMobile && "w-full",
              )}
              onClick={() => {
                push("produto/" + null);
              }}
            >
              <CirclePlus />
              Novo produto
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <TableProdutosPagination />
        <TableProdutos
          isLoading={isLoadingSearch}
          data={produtoList}
          onEdit={(id) => {
            push("produto/" + id);
          }}
          onDelete={(id) => {
            alert(id);
          }}
        />

        <span className="px-5 py-3 text-sm">
          Registros: {!produtoList ? 0 : produtoList.length}
        </span>
      </div>
    </main>
  );
}

export default CadastrosProduto;
