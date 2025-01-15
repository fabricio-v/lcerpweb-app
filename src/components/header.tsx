"use client";

import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useUser } from "@/providers/user";
import { useMemo } from "react";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const { user, signout } = useUser();

  const fallbackAvatar = useMemo(() => {
    let retorno = "";
    const userNameSplit = user?.nome?.split(" ");

    if (userNameSplit && userNameSplit.length > 1) {
      retorno = userNameSplit[0][0] + userNameSplit[1][0];
    } else if (userNameSplit && userNameSplit.length === 1) {
      retorno = userNameSplit[0][0] + userNameSplit[0][1];
    }

    return retorno.toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 flex h-[50px] bg-lc-header-background">
      <div className="flex h-full w-full items-center justify-between px-5">
        <Link href="/">
          <Image
            src={
              theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"
            }
            width={120}
            height={40}
            alt="Logo LC Sistemas"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user?.avatar || ""} />
                  <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-5 w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                Alterar tema ({theme === "light" ? "claro" : "escuro"})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signout}>Sair</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
