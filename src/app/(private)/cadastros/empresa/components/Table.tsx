import BadgeAtivo from "@/components/badge/BadgeAtivo";
import BadgeInativo from "@/components/badge/BadgeInativo";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IEmpresaResponse } from "@/interfaces/response/EmpresaResponse";
import { maskCpfCnpj } from "@/utils/Masks";
import { Edit2, Loader2, MoreVertical } from "lucide-react";

interface Props {
  data: IEmpresaResponse[] | undefined;
  isLoading: boolean;
  onEdit: (id: string) => void;
}

export function TableEmpresa({ data, isLoading, onEdit }: Props) {
  return (
    <div className="flex max-w-full overflow-auto rounded-md border px-2 pb-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[90px]">Cód. Interno</TableHead>
            <TableHead className="w-full min-w-[300px]">
              Nome da empresa
            </TableHead>
            <TableHead className="w-full min-w-[200px]">CNPJ</TableHead>
            <TableHead className="w-[75px] text-center">Status</TableHead>
            <TableHead className="w-[75px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10} className="h-16 flex-auto">
                <h1 className="flex justify-center text-lc-secondary">
                  <Loader2 className="animate-spin" />
                </h1>
              </TableCell>
            </TableRow>
          ) : data && data.length > 0 ? (
            data.map((funcionario, key) => (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={key}
                    className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                    onDoubleClick={() => {
                      onEdit(funcionario.id);
                    }}
                  >
                    <TableCell>{funcionario.codInterno}</TableCell>
                    <TableCell>{funcionario.nome}</TableCell>
                    <TableCell>{maskCpfCnpj(funcionario.cnpj)}</TableCell>

                    <TableCell className="text-center">
                      {funcionario.ativo ? <BadgeAtivo /> : <BadgeInativo />}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              onEdit(funcionario.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Edit2 size={15} />
                              Editar
                            </p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>

                <ContextMenuContent className="p-4">
                  <ContextMenuItem onClick={() => onEdit(funcionario.id)}>
                    <p className="flex items-center gap-2">
                      <Edit2 size={15} />
                      Editar
                    </p>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-16 flex-auto">
                <h1 className="flex justify-center text-lc-secondary">
                  Nenhum registro encontrado
                </h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
