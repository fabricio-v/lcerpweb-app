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
import usePaginatedResumeProducts from "@/hooks/usePaginatedResumeProducts";
import { getCookieClient } from "@/lib/cookieClient";
import { cn } from "@/lib/utils";
import { requestChangeStatusProduto } from "@/services/requests/produto";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Filter from "./components/filter";
import { Table } from "./components/table";

function CadastrosProduto() {
  const { push, back } = useRouter();

  const isMobile = useIsMobile();

  const [textFilter, setTextFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);

  const { loadProducts, data, loading, itensPerPage, isLastPage } =
    usePaginatedResumeProducts();

  const handleNextPage = () => {
    if (currentPage < data.totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const searchProduto = async () => {
    try {
      setCurrentPage(0);

      await loadProducts({
        genericFilter: textFilter,
        page: 0,
      });
    } catch (error: any) {
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

  const searchProdutoWithPagination = async () => {
    try {
      await loadProducts({
        genericFilter: textFilter,
        page: currentPage,
      });
    } catch (error: any) {
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
      await loadProducts({
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
        page: 0,
      });
    } catch (error: any) {
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

  const alterarStatusProduto = async (id: number, ativo: boolean) => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestChangeStatusProduto(token!, id, ativo);

      if (response.status === 200) {
        toast.success(`Produto${ativo ? " ativado" : "inativado"} com sucesso`);
        searchProduto();
      }
    } catch (error: any) {
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

  useEffect(() => {
    searchProduto();
  }, [textFilter]);

  useEffect(() => {
    searchProdutoWithPagination();
  }, [currentPage]);

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
              // back();
              push("/home");
            }}
          >
            <ChevronLeft size={25} />
          </button>
          <h1>Listagem de produtos</h1>
        </div>

        {/* PESQUISA / NOVO */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Filter
            onSearch={setTextFilter}
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

        <Table
          isLoading={loading}
          data={data.products}
          onEdit={(id) => {
            push("produto/" + id);
          }}
          onDelete={(id) => {
            alert(id);
          }}
          onChangeStatus={alterarStatusProduto}
          totalPages={data.totalPages}
          currPage={currentPage}
          onJumpToPage={(page) => {
            setCurrentPage(page);
          }}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />

        <span className="px-5 py-3 text-sm">
          {`Registros: ${isLastPage ? data.totalElements : itensPerPage * (currentPage + 1)} de ${data.totalElements}`}
        </span>
      </div>
    </main>
  );
}

export default CadastrosProduto;
