"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import useSearchCategorias from "@/hooks/useSearchCategorias";
import { getCookieClient } from "@/lib/cookieClient";
import { cn } from "@/lib/utils";
import { requestChangeStatusCategoria } from "@/services/requests/categoria";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BreadcrumbsCategoria from "./components/BreadcrumbsCategoria";
import Filter from "./components/Filter";
import { TableCategorias } from "./components/Table";

function CadastrosCategoria() {
  const { push, back } = useRouter();
  const isMobile = useIsMobile();

  const { data, loadCategorias, loading } = useSearchCategorias();

  const [textFilter, setTextFilter] = useState<string>("");

  const pesquisaCategorias = async () => {
    try {
      await loadCategorias({
        genericFilter: textFilter,
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

  const pesquisaAvancadaCategorias = async (
    ativo: boolean | null,
    nome: string | null,
  ) => {
    try {
      await loadCategorias({
        ativo,
        nome,
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

  const alterarStatusCategoria = async (id: string, ativo: boolean) => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestChangeStatusCategoria(token!, id, ativo);

      if (response.status === 200) {
        toast.success(
          `Categoria ${ativo ? "ativada" : "inativada"} com sucesso`,
        );
        pesquisaCategorias();
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
    pesquisaCategorias();
  }, [textFilter]);

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-auto overflow-x-hidden bg-lc-gray-light px-3 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <BreadcrumbsCategoria />
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
          <h1>Listagem de categorias</h1>
        </div>

        {/* PESQUISA / NOVO */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Filter
            onSearch={setTextFilter}
            onAdvancedSearch={pesquisaAvancadaCategorias}
          />

          <div className="flex flex-1 justify-end">
            <Button
              className={cn(
                "bg-lc-sunsetsky-light hover:bg-lc-sunsetsky",
                isMobile && "w-full",
              )}
              onClick={() => {
                push("categoria/" + null);
              }}
            >
              <CirclePlus />
              Nova categoria
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <TableCategorias
          isLoading={loading}
          data={data.cateorias}
          onEdit={(id) => {
            push("categoria/" + id);
          }}
          onDelete={(id) => {
            alert(id);
          }}
          onChangeStatus={alterarStatusCategoria}
        />

        <span className="px-5 py-3 text-sm">
          {`Registros: ${data.totalItens}`}
        </span>
      </div>
    </main>
  );
}

export default CadastrosCategoria;
