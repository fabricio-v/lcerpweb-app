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
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import {
  Edit2,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Props {
  data: IUnidadeResponse[] | undefined;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: boolean) => void;
}

export function Table({
  data,
  isLoading,
  onEdit,
  onDelete,
  onChangeStatus,
}: Props) {
  return (
    <div className="flex max-w-full overflow-auto rounded-md border px-2 pb-3">
      <TableComponent>
        <TableHeader>
          <TableRow>
            <TableHead className="md:w-[250px]">Nome da unidade</TableHead>
            <TableHead>Descrição</TableHead>
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
            data.map((categoria, key) => (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={key}
                    className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                    onDoubleClick={() => {
                      onEdit(categoria.id);
                    }}
                  >
                    <TableCell>{categoria.nome}</TableCell>

                    <TableCell>{categoria.descricao}</TableCell>

                    <TableCell className="text-center">
                      {categoria.ativo ? <BadgeAtivo /> : <BadgeInativo />}
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
                              onEdit(categoria.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Edit2 size={15} />
                              Editar
                            </p>
                          </DropdownMenuItem>
                          {categoria.ativo ? (
                            <DropdownMenuItem
                              onClick={() => {
                                onChangeStatus(categoria.id, false);
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
                                onChangeStatus(categoria.id, true);
                              }}
                            >
                              <p className="flex items-center gap-2">
                                <ToggleRight size={16} />
                                Ativar
                              </p>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>

                <ContextMenuContent className="p-4">
                  <ContextMenuItem onClick={() => onEdit(categoria.id)}>
                    <p className="flex items-center gap-2">
                      <Edit2 size={15} />
                      Editar
                    </p>
                  </ContextMenuItem>
                  {categoria.ativo ? (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(categoria.id, false)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleLeft size={16} />
                        Inativar
                      </p>
                    </ContextMenuItem>
                  ) : (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(categoria.id, true)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleRight size={16} />
                        Ativar
                      </p>
                    </ContextMenuItem>
                  )}
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
      </TableComponent>
    </div>
  );
}
