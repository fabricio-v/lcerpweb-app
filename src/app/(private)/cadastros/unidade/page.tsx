"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import useSearchUnidades from "@/hooks/useSearchUnidades";
import { getCookieClient } from "@/lib/cookieClient";
import { cn } from "@/lib/utils";
import { requestChangeStatusUnidade } from "@/services/requests/unidade";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Breadcrumbs from "./components/Breadcrumbs";
import Filter from "./components/Filter";
import { Table } from "./components/Table";

function CadastrosUnidade() {
  const { push, back } = useRouter();
  const isMobile = useIsMobile();

  const { data, loadUnidades, loading } = useSearchUnidades();

  const [textFilter, setTextFilter] = useState<string>("");

  const pesquisaUnidades = async () => {
    try {
      await loadUnidades({
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

  const pesquisaAvancadaUnidades = async (
    ativo: boolean | null,
    nome: string | null,
    descricao: string | null,
  ) => {
    try {
      await loadUnidades({
        ativo,
        nome,
        descricao,
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

  const alterarStatusUnidade = async (id: string, ativo: boolean) => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestChangeStatusUnidade(token!, id, ativo);

      if (response.status === 200) {
        toast.success(`Unidade ${ativo ? "ativada" : "inativada"} com sucesso`);
        pesquisaUnidades();
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
    pesquisaUnidades();
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
              // back();
              push("/home");
            }}
          >
            <ChevronLeft size={25} />
          </button>
          <h1>Listagem de unidades</h1>
        </div>

        {/* PESQUISA / NOVO */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Filter
            onSearch={setTextFilter}
            onAdvancedSearch={pesquisaAvancadaUnidades}
          />

          <div className="flex flex-1 justify-end">
            <Button
              className={cn(
                "bg-lc-sunsetsky-light hover:bg-lc-sunsetsky",
                isMobile && "w-full",
              )}
              onClick={() => {
                push("unidade/" + null);
              }}
            >
              <CirclePlus />
              Nova unidade
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <Table
          isLoading={loading}
          data={data.unidades}
          onEdit={(id) => {
            push("unidade/" + id);
          }}
          onDelete={(id) => {
            alert(id);
          }}
          onChangeStatus={alterarStatusUnidade}
        />

        <span className="px-5 py-3 text-sm">
          {`Registros: ${data.totalItens}`}
        </span>
      </div>
    </main>
  );
}

export default CadastrosUnidade;
