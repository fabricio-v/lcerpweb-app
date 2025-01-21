"use client";

import { ChevronDown, LogOut, Palette, Settings } from "lucide-react";
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
import { IEmpresaResponse } from "@/interfaces/EmpresaResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useUserStore } from "@/providers/user";
import { HOST, PROTOCOL } from "@/utils/hosts";
import { maskCpfCnpj } from "@/utils/Masks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DialogEnterprise } from "./dialog/dialog-enterprise";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const Header = () => {
  const { replace } = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, setUser, signout } = useUserStore();

  const [isModalSignoutOpen, setIsModalSignoutOpen] = useState(false);
  const [isLoadingSignout, setIsLoadingSignout] = useState(false);
  const [company, setCompany] = useState<IEmpresaResponse | null>(null);

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
    setTimeout(async () => {
      await signout();
      replace(PROTOCOL + "app." + HOST + "/");
    }, 100);
  };

  useEffect(() => {
    const loadUser = async () => {
      const userCookie = await getCookieClient(CookiesKeys.USER);
      if (userCookie) {
        setUser(JSON.parse(userCookie.toString()));
      }
    };

    const loadCompany = async () => {
      const companyCookie = await getCookieClient(CookiesKeys.COMPANY_SELECTED);
      if (companyCookie) {
        setCompany(JSON.parse(companyCookie.toString()));
      }
    };
    loadUser();
    loadCompany();
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
          <DropdownMenuContent className="mr-5 h-screen w-screen md:h-auto md:w-[300px]">
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="flex w-full flex-col items-center py-4">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border">
                  <Image
                    alt="logo empresa"
                    src={"/pipa.webp"}
                    width={100}
                    height={100}
                  />
                </div>

                <span className="pt-2 font-gothamBold text-muted-foreground">
                  {company && company.nome}
                </span>
                <span className="text-xs text-muted-foreground">
                  {company && maskCpfCnpj(company.cnpj)}
                </span>
              </div>

              <Separator className="mb-4" />

              <DropdownMenuGroup className="w-full">
                <DialogEnterprise
                  onChangeCompany={(company) => {
                    setCompany(company);
                    window.location.reload();
                  }}
                />

                <DropdownMenuItem
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                >
                  <Palette />
                  Alterar tema ({theme === "light" ? "claro" : "escuro"})
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => {}}>
                  <Settings />
                  Configuração
                </DropdownMenuItem>

                <AlertDialog open={isModalSignoutOpen}>
                  <AlertDialogTrigger
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      setIsModalSignoutOpen(true);
                    }}
                    asChild
                  >
                    <DropdownMenuItem>
                      <LogOut />
                      Sair
                    </DropdownMenuItem>
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
                        className="w-full md:w-20"
                        onClick={() => setIsModalSignoutOpen(false)}
                      >
                        Não
                      </AlertDialogCancel>
                      <Button
                        className="w-full hover:bg-lc-sunsetsky-light hover:text-white md:w-20"
                        isLoading={isLoadingSignout}
                        onClick={handleSignout}
                      >
                        Sair
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuGroup>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
