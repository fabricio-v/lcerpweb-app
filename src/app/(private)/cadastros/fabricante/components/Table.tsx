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
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Ações</TableHead>
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
                          {/* <DropdownMenuItem
                            onClick={() => {
                              onDelete(fabricante.id);
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
                  {/* <ContextMenuItem onClick={() => onDelete(fabricante.id)}>
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

import BadgeAtivo from "@/components/badge/BadgeAtivo";
import BadgeInativo from "@/components/badge/BadgeInativo";
import { PaginationEllipsis } from "@/components/ui/pagination";
import { IFabricanteResponse } from "@/interfaces/response/FabricanteResponse";

export function TableFabricantesPagination({
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
    <div className="select-none pb-3">
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
