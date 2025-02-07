"use client";

import { Combobox, ComboboxDataProps } from "@/components/combobox/Combobox";
import { useIsMobile } from "@/hooks/use-mobile";
import { ICidadeResponse } from "@/interfaces/response/CidadeResponse";
import { IEstadoResponse } from "@/interfaces/response/EstadoResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ComboboxSearchCidade } from "@/components/combobox/ComboboxSearchCidade";
import { CpfCnpjInput } from "@/components/input/CpfCnpjInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Messages } from "@/constants/Messages";
import { noCharsLetters, noSpaces, noSpecialChars } from "@/constants/regex";
import api from "@/services/axios";
import { buildMessageException, isValidCNPJ } from "@/utils/Funcoes";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";

export const createAccountSchema = z
  .object({
    subdomain: z
      .string()
      .min(1, {
        message: "O domínio é obrigatório",
      })
      .refine((value) => noSpecialChars.test(value), {
        message: "O domínio não deve conter caracteres especiais",
      })
      .refine((value) => noSpaces.test(value), {
        message: "O domínio não deve conter espaços",
      })
      .refine((value) => noCharsLetters.test(value), {
        message: "O domínio não pode ser formado somente por números",
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
    username: z.string().nonempty({
      message: "Seu nome é obrigatório",
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

  const [cidadeSelected, setCidadeSelected] = useState<
    ICidadeResponse | undefined
  >();

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
        nomeEmpresa: values.enterpriseName,
        nomeUsuario: values.username,
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
    <div className="flex h-screen flex-1 flex-col items-center md:flex-row">
      <div className="hidden items-center justify-center md:mx-2 md:my-4 md:flex md:flex-1">
        <Image
          src={theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"}
          width={isMobile ? 250 : 350}
          height={50}
          alt="Logo"
        />
      </div>

      <Separator orientation="vertical" className="hidden h-half md:block" />

      <div className="m-2 flex h-min max-h-full flex-1 justify-center overflow-auto md:m-4 md:mx-2 md:my-4">
        <div className="m-4 flex h-min w-full max-w-[550px] flex-col rounded-lg border p-6">
          <h1 className="mb-5 text-[25px] text-lc-tertiary">
            Informe os dados para efetuar o cadastro
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="flex flex-1 flex-col gap-6"
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
                      <CpfCnpjInput
                        typeInput="cnpj"
                        showButton={false}
                        label="CNPJ"
                        maxLength={18}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col justify-between gap-6 md:grid md:grid-cols-2">
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
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/* <Combobox
                          label="Cidade"
                          messageWhenNotfound="Selecione um estado"
                          data={cidades}
                          valueSelected={field.value}
                          onChangeValueSelected={field.onChange}
                          {...field}
                        /> */}
                        <ComboboxSearchCidade
                          label="Cidade"
                          idEstado={
                            form.watch("state")
                              ? Number(form.watch("state"))
                              : null
                          }
                          onChangeValueSelected={(cidade) => {
                            setCidadeSelected(cidade);
                            form.setValue("city", cidade.id + "");
                            form.clearErrors("city");
                          }}
                          valueSelected={cidadeSelected}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel label="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        type="email"
                        label="Digite seu email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-between gap-6 md:grid md:grid-cols-2">
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
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  className="w-[100px]"
                  variant={"outline"}
                  onClick={() => {
                    replace("/");
                  }}
                >
                  <ChevronLeft />
                  Voltar
                </Button>

                <Button
                  className="w-[100px]"
                  type="submit"
                  isLoading={isLoadingRegister}
                >
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
