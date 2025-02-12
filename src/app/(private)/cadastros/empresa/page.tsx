"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import useSearchEmpresa from "@/hooks/useSearchEmpresas";
import { cn } from "@/lib/utils";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Breadcrumbs from "./components/Breadcrumbs";
import Filter from "./components/Filter";
import { TableEmpresa } from "./components/Table";

function CadastroEmpresas() {
  const { push } = useRouter();
  const isMobile = useIsMobile();

  const { loadEmpresas, data, loading } = useSearchEmpresa();

  const [textFilter, setTextFilter] = useState<string>("");

  const pesquisa = async () => {
    try {
      await loadEmpresas();
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

  const pesquisaAvancada = async (
    status: string | null,
    nome: string | null,
  ) => {
    loadEmpresas();
  };

  useEffect(() => {
    pesquisa();
  }, [textFilter]);

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-auto overflow-x-hidden bg-lc-gray-light px-3 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumbs />
      </div>

      {/* TITLE */}
      <div className="mt-3 flex flex-col rounded-lg bg-white p-4 dark:bg-lc-tertiary">
        <div className="flex gap-1.5 pb-3">
          <button
            onClick={() => {
              push("/home");
            }}
          >
            <ChevronLeft size={25} />
          </button>
          <h1>Listagem de empresas</h1>
        </div>

        {/* PESQUISA / NOVO */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Filter
            onSearch={setTextFilter}
            onAdvancedSearch={pesquisaAvancada}
          />

          <div className="flex flex-1 justify-end">
            <Button
              className={cn(
                "bg-lc-sunsetsky-light hover:bg-lc-sunsetsky",
                isMobile && "w-full",
              )}
              onClick={() => {
                push("empresa/" + null);
              }}
            >
              <CirclePlus />
              Nova empresa
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <TableEmpresa
          isLoading={loading}
          data={data.empresas}
          onEdit={(id) => {
            push("empresa/" + id);
          }}
        />

        <span className="px-5 py-3 text-sm">{`Registros: ${data.totalItens}`}</span>
      </div>
    </main>
  );
}

export default CadastroEmpresas;
