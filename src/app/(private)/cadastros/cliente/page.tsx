"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import useSearchClientes from "@/hooks/useSearchClientes";
import { cn } from "@/lib/utils";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Breadcrumbs from "./components/Breadcrumbs";
import Filter from "./components/Filter";
import { Table } from "./components/Table";

function CadastrosCliente() {
  const { push } = useRouter();

  const isMobile = useIsMobile();

  const { data, loading, loadClientes, itensPerPage, isLastPage } =
    useSearchClientes();

  const [textFilter, setTextFilter] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    if (currentPage < data.totalPaginas - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const pesquisaClientes = async (page: number) => {
    try {
      await loadClientes({
        genericFilter: textFilter,
        page: page,
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

  const pesquisaAvancadaClientes = (
    ativo: boolean | null,
    nome: string | null,
  ) => {};

  const alterarStatusCliente = (id: number, status: boolean) => {};

  useEffect(() => {
    pesquisaClientes(0);
  }, [textFilter]);

  useEffect(() => {
    pesquisaClientes(currentPage);
  }, [currentPage]);

  return (
    <main className="flex h-[calc(100vh-50px)] flex-1 flex-col overflow-auto overflow-x-hidden bg-lc-gray-light px-3 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumbs />
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
          <h1>Listagem de clientes</h1>
        </div>

        {/* PESQUISA / NOVO */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Filter
            onSearch={setTextFilter}
            onAdvancedSearch={pesquisaAvancadaClientes}
          />

          <div className="flex flex-1 justify-end">
            <Button
              className={cn(
                "bg-lc-sunsetsky-light hover:bg-lc-sunsetsky",
                isMobile && "w-full",
              )}
              onClick={() => {
                push("cliente/" + null);
              }}
            >
              <CirclePlus />
              Novo cliente
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <Table
          isLoading={loading}
          data={data.clientes}
          onEdit={(id) => {
            push("cliente/" + id);
          }}
          onDelete={(id) => {
            alert(id);
          }}
          onChangeStatus={alterarStatusCliente}
          totalPages={data.totalPaginas}
          currPage={currentPage}
          onJumpToPage={(page) => {
            setCurrentPage(page);
          }}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />

        <span className="px-5 py-3 text-sm">
          {`Registros: ${isLastPage ? data.totalItens : itensPerPage * (currentPage + 1)} de ${data.totalItens}`}
        </span>
      </div>
    </main>
  );
}

export default CadastrosCliente;
