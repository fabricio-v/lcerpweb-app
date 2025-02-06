"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import {
  DollarSign,
  FileChartColumn,
  FolderPlus,
  HomeIcon,
  LayoutDashboardIcon,
  PackageOpen,
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
    title: "Financeiro",
    url: "",
    icon: <DollarSign />,
    isActive: true,
    items: [
      {
        title: "Contas a receber",
        url: "/financeiro/contas-a-receber",
      },
      {
        title: "Contas a pagar",
        url: "/financeiro/contas-a-pagar",
      },
    ],
  },
  {
    type: "group",
    title: "Cadastros",
    url: "",
    icon: <FolderPlus />,
    isActive: true,
    items: [
      {
        title: "Categoria",
        url: "/cadastros/categoria",
      },
      {
        title: "Cliente",
        url: "/cadastros/cliente",
      },
      {
        title: "Fabricante",
        url: "/cadastros/fabricante",
      },
      // {
      //   title: "Fornecedor",
      //   url: "/cadastros/fornecedor",
      // },
      {
        title: "Funcionário",
        url: "/cadastros/funcionario",
      },
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
      {
        title: "Unidade",
        url: "/cadastros/unidade",
      },
      {
        title: "Usuário",
        url: "/cadastros/usuario",
      },
    ],
  },
  {
    title: "Estoque",
    url: "",
    icon: <PackageOpen />,
    isActive: true,
    items: [],
  },
  {
    title: "Relatórios",
    url: "",
    icon: <FileChartColumn />,
    isActive: true,
    items: [],
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
