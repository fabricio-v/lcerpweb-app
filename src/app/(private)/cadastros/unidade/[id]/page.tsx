"use client";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Switch } from "@/components/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { IUnidadeInput } from "@/interfaces/dto/UnidadeInput";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import {
  requestInsertOrUpdateUnidade,
  requestUnidadeById,
} from "@/services/requests/unidade";
import { buildMessageException } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Breadcrumbs from "../components/Breadcrumbs";

export const formUnidadeSchema = z.object({
  id: z.string().optional(),
  ativo: z.boolean(),
  nome: z.string().min(1, {
    message: "Informe o Nome da Unidade",
  }),
  descricao: z.string().min(1, {
    message: "Informe o Descrição da Unidade",
  }),
});

function CadastrosUnidadeNova({ params }: any) {
  const { back } = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof formUnidadeSchema>>({
    resolver: zodResolver(formUnidadeSchema),
    defaultValues: {
      id: undefined,
      ativo: true,
      nome: "",
      descricao: "",
    },
  });

  const { setValue } = form;

  const [unidade, setUnidade] = useState<IUnidadeResponse>();

  const carregaUnidade = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestUnidadeById(params.id, token!.toString());

      if (response.status === 200) {
        setUnidade(response.data);
      }

      hideLoading();
    } catch (error: any) {
      hideLoading();
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
  };

  const resetForm = () => {
    form.reset();
  };

  const handleSave = async (data: z.infer<typeof formUnidadeSchema>) => {
    try {
      const newUnidade: IUnidadeInput = {
        id: data.id || null,
        nome: data.nome || "",
        descricao: data.descricao || "",
        ativo: data.ativo,
      };

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestInsertOrUpdateUnidade(newUnidade, token!);

      if (response.status === 200) {
        toast.success(
          `Unidade ${data.id === null ? "cadastrada" : "atualizada"} com sucesso`,
        );
        if (data.id !== null) {
          back();
        } else {
          resetForm();
        }
      }
    } catch (error: any) {
      if (error?.response?.status < 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.TOAST_ERROR_TITLE, {
          description: buildMessageException(error),
        });
      }
    }
  };

  useEffect(() => {
    if (unidade !== undefined) {
      setValue("id", unidade.id);
      setValue("ativo", unidade.ativo);
      setValue("nome", unidade.nome);
      setValue("descricao", unidade.descricao);
    }
  }, [unidade, params]);

  useEffect(() => {
    if (params.id !== String(null)) {
      showLoading();
      setTimeout(() => {
        carregaUnidade();
      }, 500);
    }
  }, []);

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-scroll overflow-x-hidden bg-lc-gray-light px-3 py-4 md:pl-8 md:pr-5">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <Breadcrumbs />
      </div>

      <div className="mt-3 flex flex-col rounded-lg bg-white p-4 dark:bg-lc-tertiary">
        {/* TITLE */}
        <div className="flex gap-1.5 pb-3">
          <button
            onClick={() => {
              back();
            }}
          >
            <ChevronLeft size={25} />
          </button>
          <h1>
            {params.id === String(null) ? "Nova unidade" : "Editar unidade"}
          </h1>
        </div>

        <Separator className="my-3" />
        <div className="flex flex-1 flex-col">
          <Form {...form}>
            <form
              onKeyDown={(event: React.KeyboardEvent<HTMLFormElement>) => {
                if (event.key === "Enter") {
                  event.preventDefault(); // Previne o envio do formulário
                }
              }}
              className="flex flex-1 flex-col"
              onSubmit={form.handleSubmit(handleSave, (errors) => {
                toast.warning("Preencha todos os campos obrigatórios");
              })}
            >
              <div className="flex flex-1 flex-col gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <InputWithLabel
                          label="Nome"
                          placeholder="Ex.: UNIDADE"
                          maxLength={30}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <InputWithLabel
                          label="Descrição"
                          maxLength={10}
                          placeholder="Ex.: UN"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          classNameContainer="md:mt-8 w-[100px]"
                          title={field.value === true ? "Ativa" : "Inativa"}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col-reverse justify-end gap-2 pt-2 md:flex-row">
                <Button
                  type="button"
                  className="md:w-28"
                  variant={"outline"}
                  onClick={() => {
                    back();
                  }}
                >
                  <ChevronLeft />
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="md:w-28"
                  variant={"outline"}
                  onClick={resetForm}
                >
                  Limpar
                </Button>
                <Button type="submit" className="md:w-28">
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default CadastrosUnidadeNova;
