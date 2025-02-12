"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LocalStorageKeys } from "@/constants/LocalStorageKeys";
import { MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect } from "react";
import Banner from "./components/Banner";

export default function Home() {
  const { setTheme } = useTheme();
  useEffect(() => {
    const cookieTheme = localStorage.getItem(LocalStorageKeys.THEME);

    if (cookieTheme === null) {
      localStorage.setItem(LocalStorageKeys.THEME, "light");
      setTheme("light");
    }
  }, []);

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-auto overflow-x-hidden p-4">
      <SidebarTrigger>
        <MenuIcon />
      </SidebarTrigger>

      <Banner />

      <div className="flex flex-col gap-3 overflow-auto pl-4 pt-4">
        <p className="pb-1 pt-5 font-gothamBold">Acesso rápido</p>
        <Link
          href={"/cadastros/produto/null"}
          className="w-[130px] text-sm hover:text-lc-sunsetsky-light"
        >
          Novo produto
        </Link>
        <Link
          href={"/cadastros/cliente/null"}
          className="w-[130px] text-sm hover:text-lc-sunsetsky-light"
        >
          Novo cliente
        </Link>
        <Link
          href={"/cadastros/funcionario/null"}
          className="w-[130px] text-sm hover:text-lc-sunsetsky-light"
        >
          Novo funcionário
        </Link>
      </div>
    </main>
  );
}
