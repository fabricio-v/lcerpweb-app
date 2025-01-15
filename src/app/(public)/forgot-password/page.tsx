"use client";

import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="flex h-screen flex-col justify-center md:flex-row md:items-center">
        <div className="w-full max-w-[450px] rounded-lg border px-5 py-10">
          <h1 className="mb-5 text-[25px] text-lc-tertiary">
            Recuperação de senha
          </h1>

          <form action={() => {}} className="flex flex-1 flex-col gap-3">
            <InputWithLabel
              name="email"
              label="Enviaremos um email de recuperação para o endereço de email informado
                abaixo:"
              required
            />

            <Button className="bg-lc-sunsetsky-light text-white hover:bg-lc-sunsetsky">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
