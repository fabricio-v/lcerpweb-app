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

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { getCookieClient } from "@/lib/cookieClient";
import { useUser } from "@/providers/user";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const { user, signout } = useUser();

  const { setUser } = useUser();

  const [isModalSignoutOpen, setIsModalSignoutOpen] = useState(false);
  const [isLoadingSignout, setIsLoadingSignout] = useState(false);

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

  const handleSignout = async () => {
    setIsLoadingSignout(true);
    setTimeout(() => {
      signout();
    }, 100);
  };

  useEffect(() => {
    const loadUser = async () => {
      const userCookie = await getCookieClient(CookiesKeys.USER);
      if (userCookie) {
        setUser(JSON.parse(userCookie.toString()));
      }
    };
    loadUser();
  }, []);

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

              {/* <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => {
                  setIsModalSignoutOpen(true);
                }}
              >
                Sair
              </DropdownMenuItem> */}

              <AlertDialog open={isModalSignoutOpen}>
                <AlertDialogTrigger
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => {
                    setIsModalSignoutOpen(true);
                  }}
                  asChild
                >
                  <DropdownMenuItem>Sair</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Atenção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja realmente sair?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="w-20"
                      onClick={() => setIsModalSignoutOpen(false)}
                    >
                      Não
                    </AlertDialogCancel>
                    <Button
                      className="w-20 hover:bg-lc-sunsetsky-light"
                      isLoading={isLoadingSignout}
                      onClick={handleSignout}
                    >
                      Sair
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
