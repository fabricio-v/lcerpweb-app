"use client";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Switch } from "@/components/switch";
import { Button } from "@/components/ui/button";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { useIsMobile } from "@/hooks/use-mobile";
import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import { LoginResponse } from "@/interfaces/response/LoginResponse";
import { useLoadingStore } from "@/providers/loading";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { DOMAIN, HOST, PROTOCOL } from "@/utils/hosts";
import { getCookie, setCookie } from "cookies-next";
import { decode } from "jsonwebtoken";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Signin() {
  const { replace, push } = useRouter();
  const { theme } = useTheme();

  const isMobile = useIsMobile();

  const { hideLoading, showLoading, isShowLoading } = useLoadingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isRememberSession, setIsRememberSession] = useState(false);

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
          toast.warning(Messages.TOAST_INFO_TITLE, {
            description: "Token não pertence a esse subdomínio",
          });
          push("/");
          setIsLoading(false);
          return;
        }

        if (!token || token === "") {
          toast.warning(Messages.TOAST_INFO_TITLE, {
            description: "Token não informado",
          });
          setIsLoading(false);
          return;
        }

        await setCookie(CookiesKeys.TOKEN, token, {
          domain: DOMAIN,
          maxAge: expiresIn,
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        await setCookie(
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

        const responseCompanies = await api.get<IEmpresaResponse[]>(
          "/empresas/availables",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );

        if (
          responseCompanies.status !== 200 ||
          responseCompanies.data.length === 0
        ) {
          toast.warning(Messages.TOAST_INFO_TITLE, {
            description:
              "Nenhuma empresa encontrada para o dominínio informado",
          });
          return;
        }

        const cookieCompanySelectedId = await getCookie(
          CookiesKeys.COMPANY_SELECTED_ID,
        );

        if (!cookieCompanySelectedId) {
          await setCookie(
            CookiesKeys.COMPANY_SELECTED_ID,
            responseCompanies.data[0].id,
            {
              domain: DOMAIN,
              maxAge: expiresIn,
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            },
          );

          await setCookie(
            CookiesKeys.COMPANY_SELECTED,
            responseCompanies.data[0],
            {
              domain: DOMAIN,
              maxAge: expiresIn,
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            },
          );
        } else {
          const company = responseCompanies.data.filter(
            (company) => company.id === cookieCompanySelectedId,
          );

          if (company.length > 0) {
            await setCookie(CookiesKeys.COMPANY_SELECTED_ID, company[0].id, {
              domain: DOMAIN,
              maxAge: expiresIn,
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            });

            await setCookie(CookiesKeys.COMPANY_SELECTED, company[0], {
              domain: DOMAIN,
              maxAge: expiresIn,
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            });
          }
        }

        await setCookie(CookiesKeys.COMPANIES, responseCompanies.data, {
          domain: DOMAIN,
          secure: process.env.NODE_ENV === "production",
        });

        await setCookie(CookiesKeys.REMEMBER_SESSION, isRememberSession, {
          domain: DOMAIN,
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        setTimeout(() => {
          push(PROTOCOL + subdomain + "." + HOST + "/home");
        }, 1000);
      } else {
        setIsLoading(false);
        toast.warning(Messages.TOAST_INFO_TITLE, {
          description: "Falha no login",
        });
        return;
      }
    } catch (error: any) {
      setIsLoading(false);

      if (error?.response?.status < 500) {
        toast.warning(Messages.TOAST_INFO_TITLE, {
          description: buildMessageException(error),
        });
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  }

  //validação do lembrar-me
  useEffect(() => {
    showLoading();
    setTimeout(() => {
      const exec = async () => {
        const isRememberSessionCookie = await getCookie(
          CookiesKeys.REMEMBER_SESSION,
        );

        const userLogged = await getCookie(CookiesKeys.USER);

        if (
          isRememberSessionCookie == null ||
          isRememberSessionCookie == "false"
        ) {
          setIsRememberSession(false);
          hideLoading();
        } else {
          setIsRememberSession(true);

          if (userLogged) {
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
            push(PROTOCOL + subdomain + "." + HOST + "/home");
          } else {
            hideLoading();
          }
        }
      };

      exec();
    }, 200);
  }, []);

  return isShowLoading ? null : (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col bg-white md:flex-row md:items-center">
        {/* Área para a imagem ocupar a metade esquerda da tela */}
        <div className="relative flex h-screen flex-1">
          {/* <Image
            src={"/banner2.png"}
            alt={"Banner"}
            layout="fill" // Faz a imagem preencher a área da div pai
            objectFit="cover" // Ajusta a imagem para cobrir o espaço sem deformar
          /> */}
          <h1 className="flex flex-1 items-center justify-center">
            Espaço reservado para o marketing
          </h1>
        </div>

        {/* <Separator orientation="vertical" className="hidden h-half md:block" /> */}

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
              <div className="flex flex-col gap-6">
                <InputWithLabel
                  className="w-full"
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
              </div>

              <div className="flex items-center justify-between">
                <Switch
                  title="Permanecer conectado"
                  checked={isRememberSession}
                  onCheckedChange={() => {
                    setIsRememberSession(!isRememberSession);
                  }}
                />

                <Link
                  href={"/forgot-password"}
                  className="text-right text-xs hover:text-lc-sunsetsky-light"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

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
