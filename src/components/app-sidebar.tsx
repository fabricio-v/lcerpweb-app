'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { DollarSign, LayoutDashboardIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export function AppSidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar className="max-h-xal">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={1}>
                <SidebarMenuButton asChild>
                  <a href={'/dashboard'}>
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={2}>
                <SidebarMenuButton asChild>
                  <a href={''}>
                    <DollarSign />
                    <span>Vendas</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
          size="icon"
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
