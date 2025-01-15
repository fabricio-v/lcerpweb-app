"use client";

import ButtonTheme from "@/components/button/ButtonTheme";
import { Combobox, ComboboxDataProps } from "@/components/combobox/Combobox";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ICidadeResponse } from "@/interfaces/CidadeResponse";
import { IEstadoResponse } from "@/interfaces/EstadoResponse";
import { useTheme } from "next-themes";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function Signup() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const [listaEstados, setListaEstados] = useState<IEstadoResponse[]>([]);
  const [listaCidades, setListaCidades] = useState<ICidadeResponse[]>([]);

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  async function buscarEstados() {
    setListaEstados([{ id: 15, nome: "PARA", uf: "PA" }]);
  }

  async function buscarCidades() {
    setListaCidades([
      {
        id: 1504059,
        nome: "Mae do Rio",
        estado: { id: 15, nome: "PARA", uf: "PA" },
      },
    ]);
  }

  const estados: ComboboxDataProps[] = useMemo(() => {
    return listaEstados.map((estado) => {
      return {
        value: estado.id.toString(),
        label: estado.nome,
      };
    });
  }, [listaEstados]);

  const cidades: ComboboxDataProps[] = useMemo(() => {
    return listaCidades.map((cidade) => {
      return {
        value: cidade.id.toString(),
        label: cidade.nome,
      };
    });
  }, [listaCidades]);

  useEffect(() => {
    buscarEstados();
    buscarCidades();
  }, []);

  return (
    <div>
      <div className="relative flex justify-end pr-4 pt-4 md:absolute md:w-full">
        <ButtonTheme />
      </div>

      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex h-screen flex-1 items-center justify-center">
          <Image
            src={
              theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"
            }
            width={isMobile ? 250 : 350}
            height={50}
            alt="Logo"
          />
        </div>

        <Separator orientation="vertical" className="hidden h-half md:block" />

        <div className="m-4 flex flex-1 items-center justify-center">
          <div className="w-full max-w-[450px] rounded-lg border px-5 py-10">
            <h1 className="mb-5 text-[25px] text-lc-tertiary">
              Informe os dados para efetuar o cadastro
            </h1>

            <form
              onSubmit={handleSignup}
              className="flex flex-1 flex-col gap-3"
            >
              <InputWithLabel label="Domínio" />

              <InputWithLabel label="Nome da empresa" required />

              <InputWithLabel label="CNPJ" maxLength={18} required />

              <div className="flex flex-col justify-between gap-3 lg:flex-row">
                <div className="flex-1">
                  <Combobox label="Estado" data={estados} />
                </div>
                <div className="flex-1">
                  <Combobox label="Cidade" data={cidades} />
                </div>
              </div>

              <InputWithLabel label="Digite seu email" required />

              <InputWithLabel
                label="Digite sua senha"
                type="password"
                required
              />

              <InputWithLabel
                label="Confirme sua senha"
                type="password"
                required
              />

              <div className="flex items-center justify-between gap-2">
                <Button
                  className="mt-4 w-[100px] hover:border-lc-sunsetsky hover:bg-transparent"
                  variant={"outline"}
                  onClick={() => {
                    redirect("/");
                  }}
                >
                  Voltar
                </Button>

                <Button
                  className="mt-4 w-[100px] bg-lc-sunsetsky-light text-white hover:bg-lc-sunsetsky"
                  type="submit"
                >
                  Finalizar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
