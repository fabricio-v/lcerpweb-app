"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import {
  HomeIcon,
  LayoutDashboardIcon,
  PackagePlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { NavMain } from "../ui/nav-main";

const navMain = [
  {
    title: "Início",
    url: "/home",
    icon: <HomeIcon />,
    isActive: true,
  },
  {
    title: "Dashboard",
    url: "",
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      {
        title: "Vendas",
        url: "/dashboard/vendas",
      },
      {
        title: "Estoque",
        url: "/dashboard/estoque",
      },
    ],
  },
  {
    title: "Vendas",
    url: "",
    icon: <ShoppingCartIcon />,
    isActive: true,
    items: [
      {
        title: "PDV",
        url: "/vendas/pdv",
      },
      {
        title: "Pedido de venda",
        url: "/vendas/pedido-de-venda",
      },
    ],
  },
  {
    type: "group",
    title: "Cadastros",
    url: "",
    icon: <PackagePlusIcon />,
    isActive: true,
    items: [
      {
        title: "Categoria",
        url: "/cadastros/categoria",
      },
      // {
      //   title: "Cliente",
      //   url: "/cadastros/cliente",
      // },
      {
        title: "Fabricante",
        url: "/cadastros/fabricante",
      },
      // {
      //   title: "Fornecedor",
      //   url: "/cadastros/fornecedor",
      // },
      // {
      //   title: "Grade",
      //   url: "/cadastros/grade",
      // },
      // {
      //   title: "Natureza da operação",
      //   url: "/cadastros/natureza-operacao",
      // },
      {
        title: "Produto",
        url: "/cadastros/produto",
      },
      {
        title: "Subcategoria",
        url: "/cadastros/subcategoria",
      },
      // {
      //   title: "Tabela de preços",
      //   url: "/cadastros/tabela-precos",
      // },
      // {
      //   title: "Unidade",
      //   url: "/cadastros/unidade",
      // },
      // {
      //   title: "Usuário",
      //   url: "/cadastros/usuario",
      // },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavMain items={navMain} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
