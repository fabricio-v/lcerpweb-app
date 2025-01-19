"use client";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { LocalStorageKeys } from "@/constants/LocalStorageKeys";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginResponse } from "@/interfaces/LoginResponse";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { DOMAIN, HOST, PROTOCOL } from "@/utils/hosts";
import { setCookie } from "cookies-next";
import { decode } from "jsonwebtoken";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const { replace, push } = useRouter();
  const { theme } = useTheme();

  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSignin(formData: FormData) {
    try {
      setIsLoading(true);
      let subdomain = "";

      if (typeof window !== "undefined") {
        const host = window.location.search;
        const subdomainSplit = host.split("?subdomain=")[1];
        subdomain = subdomainSplit;
      }

      if (!subdomain) {
        alert("subdomain não informado");
        setIsLoading(false);
        return;
      }

      const res = await api.post<LoginResponse>("/auth/login", {
        subdomain: subdomain,
        email: formData.get("email"),
        senha: formData.get("password"),
      });

      if (res.status === 200) {
        const token = res.data.token;
        const expiresIn = res.data.expiresIn;

        const tokenDecoded = decode(token);

        if (tokenDecoded?.aud !== subdomain) {
          alert("Token não pertence a esse subdomínio");
          // window.location.href = "/";
          push("/");
          setIsLoading(false);
          return;
        }

        if (!token || token === "") {
          alert("Token não informado");
          setIsLoading(false);
          return;
        }

        setCookie(CookiesKeys.TOKEN, token, {
          domain: DOMAIN,
          maxAge: expiresIn,
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        setCookie(
          CookiesKeys.USER,
          JSON.stringify({
            id: res.data.idUsuario,
            nome: res.data.nome,
            email: res.data.email,
            permissoes: res.data.permissoes,
            avatar: "",
          }),
          {
            domain: DOMAIN,
            maxAge: expiresIn,
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          },
        );

        setCookie(LocalStorageKeys.COMPANY, "1", {
          domain: DOMAIN,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        setTimeout(() => {
          push(PROTOCOL + subdomain + "." + HOST + "/home");
        }, 1000);
      } else {
        alert("Falha no login");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      alert("erro no login :" + buildMessageException(error));
      return;
    }
  }
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex h-screen flex-1 items-center justify-center">
          <h1 className="text-2xl text-lc-secondary">
            Espaço reservado ao marketing
          </h1>
        </div>

        <Separator orientation="vertical" className="hidden h-half md:block" />

        <div className="m-4 flex flex-1 flex-col items-center justify-center">
          <div className="flex w-full max-w-[450px] flex-col items-center justify-center">
            <Image
              src={
                theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"
              }
              width={isMobile ? 150 : 250}
              height={50}
              alt="Logo LC ERP"
            />
          </div>

          <div className="mt-20 w-full max-w-[450px] rounded-lg border px-5 py-10">
            <h1 className="mb-5 text-[25px] text-lc-tertiary">Faça o login</h1>

            <form action={handleSignin} className="flex flex-1 flex-col gap-3">
              <InputWithLabel
                name="email"
                type="email"
                label="Digite seu email"
                required
              />

              <InputWithLabel
                name="password"
                label="Digite sua senha"
                type="password"
                required
              />

              <Link
                href={"/forgot-password"}
                className="text-right text-xs hover:text-lc-sunsetsky-light"
              >
                Esqueceu sua senha?
              </Link>

              <div className="flex items-center justify-between gap-2">
                <Link
                  href={"/"}
                  className="mt-4 flex min-w-[100px] items-center gap-1 text-xs hover:text-lc-sunsetsky-light"
                >
                  <ChevronLeft size={18} />
                  Entrar com outro subdomínio
                </Link>

                <Button
                  className="mt-4 w-[100px] bg-lc-sunsetsky-light text-white hover:bg-lc-sunsetsky"
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Entrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
