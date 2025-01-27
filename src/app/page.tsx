"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Messages } from "@/constants/Messages";
import { noCharsLetters, noSpaces, noSpecialChars } from "@/constants/regex";
import { useIsMobile } from "@/hooks/use-mobile";
import api from "@/services/axios";
import { buildMessageException } from "@/utils/Funcoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const subdomainSchema = z.object({
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
      message: "Digite um domínio válido",
    }),
});

export default function Home() {
  const { push } = useRouter();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof subdomainSchema>>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: {
      subdomain: "",
    },
  });

  async function validateSubdomain(values: z.infer<typeof subdomainSchema>) {
    try {
      setIsLoading(true);
      const response = await api.get(
        "/auth/valid-subdomain?subdomain=" + values.subdomain,
      );
      if (response.status === 200) {
        push(`/signin?subdomain=${values.subdomain}`);
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
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setTheme("light");
  }, []);

  return (
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

        <Separator orientation="vertical" className="hidden h-half md:block" />

        <div className="m-4 flex flex-1 flex-col items-center">
          <div className="flex w-full max-w-[450px] flex-col items-center justify-center">
            <Image
              src={
                theme === "dark" ? "/logo-lc-white.webp" : "/logo-lc-black.webp"
              }
              width={isMobile ? 150 : 250}
              height={50}
              alt="Logo"
            />

            <div className="flex w-full flex-col pt-20">
              <h1 className="mb-3 text-lg text-lc-tertiary">
                Informe seu domínio
              </h1>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(validateSubdomain)}>
                  <FormField
                    control={form.control}
                    name="subdomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl className="pb-0">
                          <div className="flex gap-3">
                            <div className="mb-3 flex flex-1 rounded-lg border">
                              <Input
                                className="w-full border-b-0 border-t-0"
                                {...field}
                              />
                              {/* <Input
                                className="w-[130px] border-none"
                                value=".lcerp.com.br"
                                disabled
                              /> */}
                              <p className="flex flex-1 select-none items-center px-3 opacity-50">
                                .lcerp.com.br
                              </p>
                            </div>

                            <Button
                              type="submit"
                              size={"icon"}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <ChevronRight />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="absolute" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="mt-10 flex flex-1 justify-center">
                <p className="text-sm text-lc-tertiary">Não tem uma conta?</p>
                <Link
                  href="/signup"
                  className="pl-1 font-gothamBold text-sm duration-300 animate-in hover:text-lc-sunsetsky-light"
                >
                  Cadastre-se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
