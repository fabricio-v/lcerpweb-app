"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "./components/breadcrumbs";

function CadastrosProdutoNovo({ params }: any) {
  const { back } = useRouter();
  return (
    <main className="flex h-[calc(100vh-50px)] flex-1 flex-col overflow-auto overflow-x-hidden p-2">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumbs />
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
        <h1>
          {params.id === String(null) ? "Novo produto" : "Editar produto"}
        </h1>
      </div>

      <Separator className="my-3" />
    </main>
  );
}

export default CadastrosProdutoNovo;
