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
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";
import {
  Edit2,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Props {
  data: IFabricanteResponse[] | undefined;
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: boolean) => void;
}

export function TableFabricantes({
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
            <TableHead className="md:w-full">Nome do fabricante</TableHead>
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
            data.map((fabricante, key) => (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={key}
                    className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                    onDoubleClick={() => {
                      onEdit(fabricante.id);
                    }}
                  >
                    <TableCell>{fabricante.nome}</TableCell>

                    <TableCell className="text-center">
                      {fabricante.ativo ? <BadgeAtivo /> : <BadgeInativo />}
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
                              onEdit(fabricante.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Edit2 size={15} />
                              Editar
                            </p>
                          </DropdownMenuItem>
                          {fabricante.ativo ? (
                            <DropdownMenuItem
                              onClick={() => {
                                onChangeStatus(fabricante.id, false);
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
                                onChangeStatus(fabricante.id, true);
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
                  <ContextMenuItem onClick={() => onEdit(fabricante.id)}>
                    <p className="flex items-center gap-2">
                      <Edit2 size={15} />
                      Editar
                    </p>
                  </ContextMenuItem>
                  {fabricante.ativo ? (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(fabricante.id, false)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleLeft size={16} />
                        Inativar
                      </p>
                    </ContextMenuItem>
                  ) : (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(fabricante.id, true)}
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
      </Table>
    </div>
  );
}
