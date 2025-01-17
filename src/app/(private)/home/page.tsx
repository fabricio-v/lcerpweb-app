"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";

export default function Home() {
  return (
    <div>
      <SidebarTrigger>
        <MenuIcon />
      </SidebarTrigger>

      <h1>HOME</h1>
    </div>
  );
}
