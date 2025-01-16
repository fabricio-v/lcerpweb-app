"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { push } = useRouter();
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
        // window.location.href = `/signin?subdomain=${subdomain}`;
        push(`/signin?subdomain=${subdomain}`);
      }
    } catch (error: any) {
      if (error?.response?.status < 500) {
        toast.warning(Messages.TOAST_INFO_TITLE, {
          description: buildMessageException(error),
        });
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <div>
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
          <h1 className="text-2xl text-lc-secondary">
            Espaço reservado ao marketing
          </h1>
        </div>

        <Separator orientation="vertical" className="hidden h-half md:block" />

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
              <h1 className="mb-3 text-lg text-lc-tertiary">
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
                className="text-xs text-lc-tertiary hover:text-lc-sunsetsky-light"
              >
                Esqueci meu domínio
              </Link>

              <div className="mt-10">
                <Button
                  className="hover:bg-lc-sunsetsky-light hover:text-white"
                  variant={"outline"}
                  onClick={() => {
                    // window.location.href = "/signup";
                    push("/signup");
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
