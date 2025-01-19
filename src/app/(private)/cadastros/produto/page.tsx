"use client";

import { InputWithLabel } from "@/components/input/InputWithLabel";
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
import { IProdutoResumeResponse } from "@/interfaces/ProdutoResumeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { cn } from "@/lib/utils";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronLeft, CirclePlus, ListFilterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TableProdutos } from "./components/table";

function CadastrosProduto() {
  const { push, back } = useRouter();

  const isMobile = useIsMobile();

  const [produtoList, setProdutoList] = useState<IProdutoResumeResponse[]>([]);

  const searchProduto = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await api.get<IProdutoResumeResponse[]>(
        "/produtos/resume?filter=&idEmpresa=1",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      if (response.status === 200) {
        setProdutoList(response.data);
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

  // useEffect(() => {
  //   searchProduto();
  // }, []);

  return (
    <main className="flex h-[calc(100vh-50px)] flex-1 flex-col overflow-auto overflow-x-hidden p-2">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Produtos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* TITLE */}
      <div className="flex gap-1.5 py-3">
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
        <div className="flex items-end gap-2">
          <InputWithLabel
            label="Pesquisa por nome e código interno"
            placeholder="Digite aqui para pesquisar"
          />

          <Button
            variant={"ghost"}
            className="text-0 p-2"
            onClick={searchProduto}
          >
            <ListFilterIcon />
            <span className="hidden md:block">Pesquisa avançada</span>
          </Button>
        </div>

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

      <Separator className="my-3" />

      <TableProdutos data={produtoList} />
    </main>
  );
}

export default CadastrosProduto;
