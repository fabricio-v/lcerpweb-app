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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit2,
  Loader2,
  MoreVertical,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Props {
  data: IClienteResponse[] | undefined;
  isLoading: boolean;
  totalPages: number;
  currPage: number;
  onJumpToPage: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: boolean) => void;
}

export function Table({
  data,
  isLoading,
  totalPages,
  currPage,
  onJumpToPage,
  onPreviousPage,
  onNextPage,
  onEdit,
  onDelete,
  onChangeStatus,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-end pb-3">
        <Button size={"icon"} variant={"ghost"}>
          <Settings />
        </Button>
        <TablePagination
          totalPages={totalPages}
          currPage={currPage}
          onJumpToPage={onJumpToPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </div>

      <div className="flex max-w-full overflow-auto rounded-md border px-2 pb-3">
        <TableComponent>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">Cód. Interno</TableHead>
              <TableHead className="min-w-[150px]">CPF/CNPJ</TableHead>
              <TableHead className="w-full">Nome do cliente</TableHead>
              <TableHead className="min-w-[200px]">Cidade/UF</TableHead>
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
              data.map((cliente, key) => (
                <ContextMenu key={key}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      key={key}
                      className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                      onDoubleClick={() => {
                        onEdit(cliente.id);
                      }}
                    >
                      <TableCell>{cliente.id}</TableCell>

                      <TableCell>{maskCpfCnpj(cliente.cpfCnpj)}</TableCell>

                      <TableCell>{cliente.nome}</TableCell>

                      <TableCell>
                        {cliente.cidade.nome + "/" + cliente.estado.uf}
                      </TableCell>

                      <TableCell className="text-center">
                        {cliente.ativo ? <BadgeAtivo /> : <BadgeInativo />}
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
                                onEdit(cliente.id);
                              }}
                            >
                              <p className="flex items-center gap-2">
                                <Edit2 size={15} />
                                Editar
                              </p>
                            </DropdownMenuItem>
                            {cliente.ativo ? (
                              <DropdownMenuItem
                                onClick={() => {
                                  onChangeStatus(cliente.id, false);
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
                                  onChangeStatus(cliente.id, true);
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
                    <ContextMenuItem onClick={() => onEdit(cliente.id)}>
                      <p className="flex items-center gap-2">
                        <Edit2 size={15} />
                        Editar
                      </p>
                    </ContextMenuItem>
                    {cliente.ativo ? (
                      <ContextMenuItem
                        onClick={() => onChangeStatus(cliente.id, false)}
                      >
                        <p className="flex items-center gap-2">
                          <ToggleLeft size={16} />
                          Inativar
                        </p>
                      </ContextMenuItem>
                    ) : (
                      <ContextMenuItem
                        onClick={() => onChangeStatus(cliente.id, true)}
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
    </div>
  );
}

import BadgeAtivo from "@/components/badge/BadgeAtivo";
import BadgeInativo from "@/components/badge/BadgeInativo";
import { PaginationEllipsis } from "@/components/ui/pagination";
import { IClienteResponse } from "@/interfaces/response/ClienteResponse";
import { maskCpfCnpj } from "@/utils/Masks";

export function TablePagination({
  totalPages,
  currPage,
  onPreviousPage,
  onNextPage,
  onJumpToPage,
}: {
  totalPages: number;
  currPage: number;
  onJumpToPage: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) {
  const DOTS = "...";
  const siblingCount = 1;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  };

  return (
    <div className="select-none">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={onPreviousPage}
              className={currPage === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {paginationRange()?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={index} className="cursor-pointer">
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    onJumpToPage(Number(pageNumber) - 1);
                  }}
                  isActive={pageNumber === currPage + 1}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={onNextPage}
              className={
                currPage === totalPages - 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
