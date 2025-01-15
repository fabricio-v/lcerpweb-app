"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

import {
  HomeIcon,
  LayoutDashboardIcon,
  PackagePlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { NavMain } from "../ui/nav-main";
import { Separator } from "../ui/separator";
import DropdownMultiempresa from "./dropdown-multiempresa";

const navMain = [
  {
    title: "Início",
    url: "/home",
    icon: <HomeIcon />,
    isActive: true,
  },
  {
    title: "Dashboard",
    url: "/home",
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      {
        title: "Vendas",
        url: "/dashboard",
      },
      {
        title: "Estoque",
        url: "/dashboard",
      },
    ],
  },
  {
    title: "Vendas",
    url: "/home",
    icon: <ShoppingCartIcon />,
    isActive: true,
    items: [
      {
        title: "PDV",
        url: "/home",
      },
      {
        title: "Pedido de venda",
        url: "/home",
      },
    ],
  },
  {
    type: "group",
    title: "Cadastros",
    url: "/home",
    icon: <PackagePlusIcon />,
    isActive: true,
    items: [
      {
        title: "Produto",
        url: "/home",
      },
      {
        title: "Cliente",
        url: "/home",
      },
      {
        title: "Fornecedor",
        url: "/home",
      },
      {
        title: "Categoria",
        url: "/home",
      },
      {
        title: "Subcategoria",
        url: "/home",
      },
      {
        title: "Fabricante",
        url: "/home",
      },
      {
        title: "Natureza da operação",
        url: "/home",
      },
      {
        title: "Unidade",
        url: "/home",
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
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
      <SidebarFooter>
        <Separator className="mb-2" />
        <DropdownMultiempresa />
      </SidebarFooter>
    </Sidebar>
  );
}
