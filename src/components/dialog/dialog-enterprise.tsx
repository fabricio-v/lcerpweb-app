"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { Messages } from "@/constants/Messages";
import { IEmpresaResponse } from "@/interfaces/EmpresaResponse";
import { buildMessageException } from "@/utils/Funcoes";
import { DOMAIN } from "@/utils/hosts";
import { maskCpfCnpj } from "@/utils/Masks";
import { getCookie, setCookie } from "cookies-next";
import { Building2, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  onChangeCompany: (company: IEmpresaResponse) => void;
}

export function DialogEnterprise({ onChangeCompany }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companiesList, setCompaniesList] = useState<IEmpresaResponse[]>([]);
  const [companieSelected, setCompanieSelected] = useState<
    IEmpresaResponse | undefined
  >(undefined);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);

      const cookieCompanySelected = await getCookie(
        CookiesKeys.COMPANY_SELECTED,
      );

      const companySelected: IEmpresaResponse = cookieCompanySelected
        ? JSON.parse(decodeURIComponent(cookieCompanySelected))
        : null;

      if (companySelected) {
        setCompanieSelected(companySelected);
      }

      const cookiesCompanies = await getCookie(CookiesKeys.COMPANIES);

      const companies: IEmpresaResponse[] = cookiesCompanies
        ? JSON.parse(decodeURIComponent(cookiesCompanies))
        : null;

      if (companies.length > 0) {
        setCompaniesList(companies);
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(Messages.TOAST_ERROR_TITLE, {
        description: buildMessageException(error),
      });
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        if (!isOpen) {
          loadCompanies();
        }

        setIsOpen(!isOpen);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 px-2 py-[6px] text-sm hover:bg-accent hover:text-accent-foreground">
          <Building2 size={16} />
          Alterar empresa
        </button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione a empresa</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[500px] gap-4 py-4">
          <ScrollArea>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 size={30} className="animate-spin" />
              </div>
            ) : (
              companiesList.map((item, index) => (
                <div className="flex items-center justify-between">
                  <button
                    key={index}
                    className="flex flex-1 items-center justify-between rounded-sm px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    disabled={companieSelected?.id === item.id}
                    onClick={() => {
                      setIsOpen(false);
                      onChangeCompany(item);
                      setCookie(CookiesKeys.COMPANY_SELECTED_ID, item.id, {
                        domain: DOMAIN,
                        path: "/",
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                      });
                      setCookie(CookiesKeys.COMPANY_SELECTED, item, {
                        domain: DOMAIN,
                        path: "/",
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                      });
                    }}
                  >
                    <div>
                      <p className="font-gothamBold text-lg">{item.nome}</p>
                      <p className="text-sm">{maskCpfCnpj(item.cnpj)}</p>
                    </div>
                    <div>
                      {item.id === companieSelected?.id && (
                        <Check className="text-lc-sunsetsky-light" />
                      )}
                    </div>
                  </button>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
