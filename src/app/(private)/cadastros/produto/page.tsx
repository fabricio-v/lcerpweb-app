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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronLeft, CirclePlus, ListFilterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { TableProdutos } from "./components/table";

function CadastrosProduto() {
  const { push, back } = useRouter();

  const isMobile = useIsMobile();

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
        <div className="flex items-end">
          <InputWithLabel
            label="Pesquisa por nome e código interno"
            placeholder="Digite aqui para pesquisar"
          />

          <Button variant={"ghost"} className="text-0 p-2">
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

      <TableProdutos />
    </main>
  );
}

export default CadastrosProduto;
