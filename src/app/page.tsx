"use client";

import ButtonTheme from "@/components/button/ButtonTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);
  const [subdomain, setSubdomain] = useState("lcsistemas");

  async function validateSubdomain() {
    try {
      setIsLoading(true);
      const response = await api.get(
        "/auth/valid-subdomain?subdomain=" + subdomain,
      );
      setIsLoading(false);
      if (response.status === 200) {
        window.location.href = `/signin?subdomain=${subdomain}`;
      }
    } catch (error) {
      setIsLoading(false);
      alert(buildMessageException(error));
    }
  }

  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <div>
      <div className="relative flex justify-end pr-4 pt-4 md:absolute md:w-full">
        <ButtonTheme />
      </div>

      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex h-screen flex-1 items-center justify-center">
          {/* <Image
            src={
              theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"
            }
            width={isMobile ? 250 : 350}
            height={50}
            alt="Logo"
          /> */}
          <h1 className="text-lc-secondary text-2xl">
            Espaço reservado ao marketing
          </h1>
        </div>

        <Separator orientation="vertical" className="h-half hidden md:block" />

        <div className="m-4 flex flex-1 flex-col items-center">
          <div className="flex w-full max-w-[450px] flex-col items-center justify-center">
            <Image
              src={
                theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"
              }
              width={isMobile ? 150 : 250}
              height={50}
              alt="Logo"
            />

            <div className="flex w-full flex-col pt-20">
              <h1 className="text-lc-tertiary mb-3 text-lg">
                Informe seu domínio
              </h1>

              <div className="flex flex-1 justify-center gap-3">
                <div className="mb-3 flex flex-1 rounded-lg border">
                  <Input
                    className="w-full border-b-0 border-t-0"
                    value={subdomain}
                    onChange={(e) => {
                      setSubdomain(e.target.value);
                    }}
                  />
                  <Input
                    className="w-[130px] border-none"
                    value=".lcerp.com.br"
                    disabled
                  />
                </div>

                <Button
                  size={"icon"}
                  onClick={validateSubdomain}
                  disabled={isLoading}
                  className="hover:bg-lc-sunsetsky-light"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ChevronRight />
                  )}
                </Button>
              </div>

              <Link
                href={"/"}
                className="text-lc-tertiary hover:text-lc-sunsetsky-light text-xs"
              >
                Esqueci meu domínio
              </Link>

              <div className="mt-10">
                <Button
                  className="hover:bg-lc-sunsetsky-light hover:text-white"
                  variant={"outline"}
                  onClick={() => {
                    redirect("/signup");
                  }}
                >
                  Cadastrar-se
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
