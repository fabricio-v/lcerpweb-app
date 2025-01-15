"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { LoginResponse } from "@/interfaces/LoginResponse";
import { useUser } from "@/providers/user";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { DOMAIN, HOST, PROTOCOL } from "@/utils/hosts";
import { setCookie } from "cookies-next";
import { decode } from "jsonwebtoken";
import { LogInIcon } from "lucide-react";

export default function Signin() {
  const { setUser, user } = useUser();

  async function handleLogin(formData: FormData) {
    try {
      let subdomain = "";

      if (typeof window !== "undefined") {
        const host = window.location.search;
        const subdomainSplit = host.split("?subdomain=")[1];
        subdomain = subdomainSplit;
      }

      if (!subdomain) {
        alert("subdomain não informado");
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
          window.location.href = "/";
          return;
        }

        if (!token || token === "") {
          alert("Token não informado");
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
            avatar: "https://github.com/fabricio-v.png",
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

        window.location.href = PROTOCOL + subdomain + "." + HOST + "/home";
      } else {
        alert("Falha no login");
        return;
      }
    } catch (error) {
      alert("erro no login :" + buildMessageException(error));
      return;
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col items-center justify-center">
      {/* <SidebarTrigger /> */}

      <div className="flex max-w-[800px] flex-col items-center justify-center gap-2">
        <h1>Login</h1>

        <form action={handleLogin}>
          <div className="flex flex-col items-center gap-2">
            <Input
              name="email"
              placeholder="E-mail"
              type="email"
              maxLength={20}
              // value={email}
              // onChange={(e) => {
              //   setEmail(e.target.value);
              // }}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Senha"
              maxLength={20}
              // value={senha}
              // onChange={(e) => {
              //   setSenha(e.target.value);
              // }}
              required
            />
            <Button className="mt-4" type="submit">
              <LogInIcon /> Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
