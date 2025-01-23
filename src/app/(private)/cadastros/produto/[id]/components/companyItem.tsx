"use client";

import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import { cn } from "@/lib/utils";
import { maskCpfCnpj } from "@/utils/Masks";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Building2, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  company: IEmpresaResponse;
  defaultValue: boolean;
  onChange: (company: IEmpresaResponse, isSelected: CheckedState) => void;
}

function CompanyItem({ company, defaultValue, onChange }: Props) {
  const [isSelected, setIsSelected] = useState<CheckedState>(defaultValue);

  return (
    <span
      className="cursor-pointer"
      onClick={() => {
        onChange(company, !isSelected);
        setIsSelected(!isSelected);
      }}
    >
      <div
        className={cn(
          "flex w-auto flex-col items-center justify-between rounded-sm border p-4 md:w-[160px]",
          isSelected && "bg-muted/50 duration-200",
        )}
      >
        <div className="flex flex-1 flex-col items-center justify-center">
          <Building2 size={30} className="opacity-70" />
          <h1 className="select-none pt-2 text-center text-sm">
            {company.nome}
          </h1>
          <span className="select-none pb-4 text-xs">
            {maskCpfCnpj(company.cnpj)}
          </span>
        </div>

        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border",
            isSelected && "bg-lc-sunsetsky-light",
          )}
        >
          {isSelected && <Check size={16} className="mt-[1px] text-white" />}
        </div>

        {/* <Checkbox
          checked={isSelected}
          onCheckedChange={() => {
            onChange(company, !isSelected);
            setIsSelected(!isSelected);
          }}
        /> */}
      </div>
    </span>
  );
}

export default CompanyItem;
