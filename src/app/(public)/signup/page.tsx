"use client";

import { ComboboxDataProps } from "@/components/combobox/Combobox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ICidadeResponse } from "@/interfaces/CidadeResponse";
import { IEstadoResponse } from "@/interfaces/EstadoResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { isValidCNPJ } from "@/utils/Funcoes";
import { z } from "zod";

export const createAccountSchema = z
  .object({
    domain: z
      .string()
      .min(1, {
        message: "O domínio é obrigatório",
      })
      .min(5, {
        message: "O dominio deve ter pelo menos 5 caracteres",
      }),
    enterpriseName: z.string().min(1, {
      message: "O nome da empresa é obrigatório",
    }),
    enterpriseCnpj: z
      .string()
      .nonempty({
        message: "O CNPJ é obrigatório",
      })
      .refine(isValidCNPJ, {
        message: "CNPJ inválido",
      }),
    email: z
      .string()
      .nonempty({
        message: "O email é obrigatório",
      })
      .email("E-mail inválido"),
    password: z
      .string()
      .nonempty("A senha é obrigatória")
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .nonempty("A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas devem ser iguais",
  });

export default function Signup() {
  const { replace } = useRouter();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      domain: "",
      enterpriseName: "",
      enterpriseCnpj: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [listaEstados, setListaEstados] = useState<IEstadoResponse[]>([]);
  const [listaCidades, setListaCidades] = useState<ICidadeResponse[]>([]);

  async function handleSignup(values: z.infer<typeof createAccountSchema>) {
    console.log(values);
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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSignup)}
                className="flex flex-1 flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel label="Domínio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enterpriseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel label="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enterpriseCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          label="CNPJ"
                          maxLength={18}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* cidade e estado */}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel label="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          label="Digite sua senha"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          label="Confirme sua senha"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <InputWithLabel
                  name="enterpriseName"
                  label="Nome da empresa"
                  required
                /> */}

                {/* <InputWithLabel
                  name="enterpriseCnpj"
                  label="CNPJ"
                  maxLength={18}
                  required
                />

                <div className="flex flex-col justify-between gap-3 lg:flex-row">
                  <div className="flex-1">
                    <Combobox label="Estado" data={estados} />
                  </div>
                  <div className="flex-1">
                    <Combobox label="Cidade" data={cidades} />
                  </div>
                </div>

                <InputWithLabel
                  name="email"
                  label="Digite seu email"
                  required
                />

                <InputWithLabel
                  name="password"
                  label="Digite sua senha"
                  type="password"
                  required
                />

                <InputWithLabel
                  name="confirmPassword"
                  label="Confirme sua senha"
                  type="password"
                  required
                /> */}

                <div className="flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    className="mt-4 w-[100px] hover:border-lc-sunsetsky hover:bg-transparent"
                    variant={"outline"}
                    onClick={() => {
                      replace("/");
                      // window.location.href = "/";
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
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
