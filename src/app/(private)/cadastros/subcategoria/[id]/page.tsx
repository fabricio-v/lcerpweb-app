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
import { ICategoriaInput } from "@/interfaces/dto/CategoriaInput";
import { ISubcategoriaResponse } from "@/interfaces/response/SubcategoriaResponse";
import { getCookieClient } from "@/lib/cookieClient";
import { useLoadingStore } from "@/providers/loading";
import {
  requestInsertOrUpdateSubcategoria,
  requestSubcategoriaById,
} from "@/services/requests/subcategoria";
import { buildMessageException } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BreadcrumbsSubcategoriaCadastro from "./components/BreadcrumbsSubcategoriaCadastro";

export const formSubcategoriaSchema = z.object({
  id: z.number().optional(),
  ativo: z.boolean(),
  nome: z.string().min(1, {
    message: "Informe o Nome da Subcategoria",
  }),
});

function CadastrosCategoriaNova({ params }: any) {
  const { back } = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof formSubcategoriaSchema>>({
    resolver: zodResolver(formSubcategoriaSchema),
    defaultValues: {
      id: undefined,
      ativo: true,
      nome: "",
    },
  });

  const { setValue } = form;

  const [subcategoria, setSubcategoria] = useState<ISubcategoriaResponse>();

  const carregaCategoria = async () => {
    try {
      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestSubcategoriaById(
        params.id,
        token!.toString(),
      );

      if (response.status === 200) {
        setSubcategoria(response.data);
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

  const handleSave = async (data: z.infer<typeof formSubcategoriaSchema>) => {
    try {
      const newSubcategoria: ICategoriaInput = {
        id: data.id || null,
        nome: data.nome || "",
        ativo: data.ativo,
      };

      const token = await getCookieClient(CookiesKeys.TOKEN);

      const response = await requestInsertOrUpdateSubcategoria(
        newSubcategoria,
        token!,
      );

      if (response.status === 200) {
        toast.success(
          `Subcategoria ${data.id === null ? "cadastrada" : "atualizada"} com sucesso`,
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
    if (subcategoria !== undefined) {
      setValue("id", subcategoria.id);
      setValue("ativo", subcategoria.ativo);
      setValue("nome", subcategoria.nome);
    }
  }, [subcategoria, params]);

  useEffect(() => {
    if (params.id !== String(null)) {
      showLoading();
      setTimeout(() => {
        carregaCategoria();
      }, 500);
    }
  }, []);

  return (
    <main className="flex h-[calc(100vh-55px)] flex-1 flex-col overflow-scroll overflow-x-hidden bg-lc-gray-light px-3 py-4 md:pl-8 md:pr-5">
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <BreadcrumbsSubcategoriaCadastro />
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
              ? "Nova subcategoria"
              : "Editar subcategoria"}
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

export default CadastrosCategoriaNova;
