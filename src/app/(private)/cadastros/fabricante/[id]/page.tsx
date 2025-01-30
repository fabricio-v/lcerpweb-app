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
import { IFabricanteInput } from "@/interfaces/dto/FabricanteInput";
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import {
  requestFabricanteById,
  requestInsertOrUpdateFabricante,
} from "@/services/requests/fabricante";
import { buildMessageException } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BreadcrumbsFabricanteCadastro from "./components/BreadcrumbsFabricanteCadastro";

export const formFabricanteSchema = z.object({
  id: z.number().optional(),
  ativo: z.boolean(),
  nome: z.string().min(1, {
    message: "Informe o Nome do Fabricante",
  }),
});

function CadastrosFabricanteNovo({ params }: any) {
  const { back } = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof formFabricanteSchema>>({
    resolver: zodResolver(formFabricanteSchema),
    defaultValues: {
      id: undefined,
      ativo: true,
      nome: "",
    },
  });

  const { setValue } = form;

  const [fabricante, setFabricante] = useState<IFabricanteResponse>();

  const carregaFabricante = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestFabricanteById(
        params.id,
        token!.toString(),
      );

      if (response.status === 200) {
        setFabricante(response.data);
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

  const handleSave = async (data: z.infer<typeof formFabricanteSchema>) => {
    try {
      const newFabricante: IFabricanteInput = {
        id: data.id || null,
        nome: data.nome || "",
        ativo: data.ativo,
      };

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestInsertOrUpdateFabricante(
        newFabricante,
        token!,
      );

      if (response.status === 200) {
        toast.success(
          `Fabricante ${data.id === null ? "cadastrado" : "atualizado"} com sucesso`,
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
    if (fabricante !== undefined) {
      setValue("id", fabricante.id);
      setValue("ativo", fabricante.ativo);
      setValue("nome", fabricante.nome);
    }
  }, [fabricante, params]);

  useEffect(() => {
    if (params.id !== String(null)) {
      showLoading();
      setTimeout(() => {
        carregaFabricante();
      }, 500);
    }
  }, []);

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-scroll overflow-x-hidden bg-lc-gray-light px-3 py-4 md:pl-8 md:pr-5">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <BreadcrumbsFabricanteCadastro />
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
            {params.id === String(null)
              ? "Novo fabricante"
              : "Editar fabricante"}
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
                          maxLength={50}
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
                          title={field.value === true ? "Ativo" : "Inativo"}
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

export default CadastrosFabricanteNovo;
