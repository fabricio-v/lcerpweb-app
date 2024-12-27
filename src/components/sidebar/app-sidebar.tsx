'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from '@/components/ui/sidebar';

import {
  HomeIcon,
  LayoutDashboardIcon,
  PackagePlusIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { NavMain } from '../ui/nav-main';
import { Separator } from '../ui/separator';
import DropdownMultiempresa from './dropdown-multiempresa';

const navMain = [
  {
    title: 'Início',
    url: '/',
    icon: <HomeIcon />,
    isActive: true,
  },
  {
    title: 'Dashboard',
    url: '#',
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      {
        title: 'Vendas',
        url: '/dashboard',
      },
      {
        title: 'Estoque',
        url: '/dashboard',
      },
    ],
  },
  {
    title: 'Vendas',
    url: '#',
    icon: <ShoppingCartIcon />,
    isActive: true,
    items: [
      {
        title: 'Pdv',
        url: '#',
      },
      {
        title: 'Pedido de venda',
        url: '#',
      },
    ],
  },
  {
    type: 'group',
    title: 'Cadastros',
    url: '#',
    icon: <PackagePlusIcon />,
    isActive: true,
    items: [
      {
        title: 'Produto',
        url: '#',
      },
      {
        title: 'Cliente',
        url: '#',
      },
      {
        title: 'Fornecedor',
        url: '#',
      },
      {
        title: 'Categoria',
        url: '#',
      },
      {
        title: 'Subcategoria',
        url: '#',
      },
      {
        title: 'Fabricante',
        url: '#',
      },
      {
        title: 'Natureza da operação',
        url: '#',
      },
      {
        title: 'Unidade',
        url: '#',
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

        <span className="text-xs text-lc-secondary">Empresa selecionada</span>
        <DropdownMultiempresa />
      </SidebarFooter>
    </Sidebar>
  );
}
