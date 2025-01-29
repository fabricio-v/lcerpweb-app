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
import {
  Edit2,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import BadgeAtivo from "@/components/badge/BadgeAtivo";
import BadgeInativo from "@/components/badge/BadgeInativo";
import { ISubcategoriaResponse } from "@/interfaces/response/SubcategoriaResponse";

interface Props {
  data: ISubcategoriaResponse[] | undefined;
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: boolean) => void;
}

export function TableSubcategorias({
  data,
  isLoading,
  onEdit,
  onDelete,
  onChangeStatus,
}: Props) {
  return (
    <div className="flex max-w-full overflow-auto rounded-md border px-2 pb-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="md:w-full">Nome da subcategoria</TableHead>
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
            data.map((subcategoria, key) => (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={key}
                    className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                    onDoubleClick={() => {
                      onEdit(subcategoria.id);
                    }}
                  >
                    <TableCell>{subcategoria.nome}</TableCell>

                    <TableCell className="text-center">
                      {subcategoria.ativo ? <BadgeAtivo /> : <BadgeInativo />}
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
                              onEdit(subcategoria.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Edit2 size={15} />
                              Editar
                            </p>
                          </DropdownMenuItem>
                          {subcategoria.ativo ? (
                            <DropdownMenuItem
                              onClick={() => {
                                onChangeStatus(subcategoria.id, false);
                              }}
                            >
                              <p className="flex items-center gap-2">
                                <ToggleLeft size={16} />
                                Inativar
                              </p>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                onChangeStatus(subcategoria.id, true);
                              }}
                            >
                              <p className="flex items-center gap-2">
                                <ToggleRight size={16} />
                                Ativar
                              </p>
                            </DropdownMenuItem>
                          )}
                          {/* <DropdownMenuItem
                            onClick={() => {
                              onDelete(subcategoria.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Trash2 size={15} />
                              Excluir
                            </p>
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>

                <ContextMenuContent className="p-4">
                  <ContextMenuItem onClick={() => onEdit(subcategoria.id)}>
                    <p className="flex items-center gap-2">
                      <Edit2 size={15} />
                      Editar
                    </p>
                  </ContextMenuItem>
                  {subcategoria.ativo ? (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(subcategoria.id, false)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleLeft size={16} />
                        Inativar
                      </p>
                    </ContextMenuItem>
                  ) : (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(subcategoria.id, true)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleRight size={16} />
                        Ativar
                      </p>
                    </ContextMenuItem>
                  )}
                  {/* <ContextMenuItem onClick={() => onDelete(categoria.id)}>
                    <p className="flex items-center gap-2">
                      <Trash2 size={15} />
                      Excluir
                    </p>
                  </ContextMenuItem> */}
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
