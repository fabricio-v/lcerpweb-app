"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LocalStorageKeys } from "@/constants/LocalStorageKeys";
import { MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

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
    <div>
      <SidebarTrigger>
        <MenuIcon />
      </SidebarTrigger>

      <h1>HOME</h1>
    </div>
  );
}
