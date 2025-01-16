"use client";

import { Combobox, ComboboxDataProps } from "@/components/combobox/Combobox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ICidadeResponse } from "@/interfaces/CidadeResponse";
import { IEstadoResponse } from "@/interfaces/EstadoResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Messages } from "@/constants/Messages";
import api from "@/services/axios";
import { buildMessageException, isValidCNPJ } from "@/utils/Funcoes";
import { toast } from "sonner";
import { z } from "zod";

export const createAccountSchema = z
  .object({
    subdomain: z
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
    state: z.string().min(1, {
      message: "O estado é obrigatório",
    }),
    city: z.string().min(1, {
      message: "A cidade é obrigatória",
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

  const [isLoadingRegister, setIsLoadingRegisters] = useState(false);
  const [listaEstados, setListaEstados] = useState<IEstadoResponse[]>([]);
  const [listaCidades, setListaCidades] = useState<ICidadeResponse[]>([]);
  const [stateSel, setStateSel] = useState("");

  const form = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      subdomain: "",
      enterpriseName: "",
      enterpriseCnpj: "",
      email: "",
      password: "",
      confirmPassword: "",
      state: stateSel,
      city: "",
    },
  });

  async function handleSignup(values: z.infer<typeof createAccountSchema>) {
    console.log(values);

    setIsLoadingRegisters(true);
    try {
      const resp = await api.post("/auth/create-account", {
        subdomain: values.subdomain,
        cnpj: values.enterpriseCnpj,
        nome: values.enterpriseName,
        email: values.email,
        senha: values.password,
        cidade: values.city,
        estado: values.state,
      });

      if (resp.status === 201) {
        toast.success(Messages.TOAST_SUCCESS_TITLE, {
          description: "Conta criada com sucesso",
        });

        replace("/");
        setIsLoadingRegisters(false);
      }
    } catch (error: any) {
      setIsLoadingRegisters(false);

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

  async function buscarEstados() {
    try {
      const response = await api.get<IEstadoResponse[]>("/public/estados");

      if (response.status === 200) {
        setListaEstados(response.data);
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
    }
  }

  const buscarCidades = useCallback(
    async (stateParam: string) => {
      if (stateParam !== "") {
        try {
          const resp = await api.get<ICidadeResponse[]>(
            `/public/cidades/estado/${stateParam}`,
          );

          if (resp.status === 200) {
            setListaCidades(resp.data);
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
        }
      } else {
        setListaCidades([]);
      }
    },
    [stateSel],
  );

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
                  name="subdomain"
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

                <div className="flex flex-col justify-between gap-3 lg:flex-row">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Combobox
                              label="Estado"
                              data={estados}
                              valueSelected={field.value}
                              onChangeValueSelected={(e: any) => {
                                field.onChange(e);
                                form.setValue("city", "");
                                // setStateSel(e);
                                buscarCidades(e);
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Combobox
                              label="Cidade"
                              messageWhenNotfound="Selecione um estado"
                              data={cidades}
                              valueSelected={field.value}
                              onChangeValueSelected={field.onChange}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

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

                <div className="flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    className="mt-4 w-[100px] hover:border-lc-sunsetsky-light hover:bg-transparent hover:text-lc-sunsetsky-light"
                    variant={"outline"}
                    onClick={() => {
                      replace("/");
                    }}
                  >
                    Voltar
                  </Button>

                  <Button
                    className="mt-4 w-[100px] bg-lc-sunsetsky-light text-white hover:bg-lc-sunsetsky"
                    type="submit"
                    isLoading={isLoadingRegister}
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
