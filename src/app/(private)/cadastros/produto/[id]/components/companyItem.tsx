"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { IEmpresaResponse } from "@/interfaces/EmpresaResponse";
import { cn } from "@/lib/utils";
import { maskCpfCnpj } from "@/utils/Masks";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Building2 } from "lucide-react";
import { useState } from "react";

interface Props {
  company: IEmpresaResponse;
  defaultValue: boolean;
}

function CompanyItem({ company, defaultValue }: Props) {
  const [isSelected, setIsSelected] = useState<CheckedState>(defaultValue);

  return (
    <button onClick={() => setIsSelected(!isSelected)}>
      <div
        className={cn(
          "flex w-auto flex-col items-center justify-between rounded-sm border p-4 md:w-[160px]",
          isSelected && "bg-muted/50 duration-200",
        )}
      >
        <div className="flex flex-1 flex-col items-center justify-center">
          <Building2 size={30} className="opacity-70" />
          <h1 className="pt-2 text-center text-sm">{company.nome}</h1>
          <span className="pb-4 text-xs">{maskCpfCnpj(company.cnpj)}</span>
        </div>
        <Checkbox checked={isSelected} onCheckedChange={setIsSelected} />
      </div>
    </button>
  );
}

export default CompanyItem;
