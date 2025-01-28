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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { IProdutoResumeResponse } from "@/interfaces/response/ProdutoResumeResponse";
import { maskNumber } from "@/utils/Masks";
import {
  Edit2,
  Files,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Props {
  data: IProdutoResumeResponse[] | undefined;
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: boolean) => void;
}

export function TableProdutos({
  data,
  isLoading,
  onEdit,
  onDelete,
  onChangeStatus,
}: Props) {
  return (
    <div className="flex max-w-full overflow-auto rounded-md border px-2 pb-3">
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] min-w-[80px]">
              Cód. Interno
            </TableHead>
            <TableHead className="w-[100px] min-w-[100px]">Código</TableHead>
            <TableHead className="w-[100px] min-w-[100px]">
              Referência
            </TableHead>
            <TableHead className="w-[130px] min-w-[130px]">Barras</TableHead>
            <TableHead className="min-w-[280px]">Nome do produto</TableHead>
            <TableHead>Fabricante</TableHead>
            <TableHead className="w-[100px] min-w-[100px] text-right">
              Estoque
            </TableHead>
            <TableHead className="w-[50px] min-w-[50px]">Unid</TableHead>
            <TableHead className="w-[130px] min-w-[130px] text-right">
              Preço R$
            </TableHead>
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
            data.map((product, key) => (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={key}
                    className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                    onDoubleClick={() => {
                      onEdit(product.id);
                    }}
                  >
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.codigo}</TableCell>
                    <TableCell>{product.referencia}</TableCell>
                    <TableCell>{product.codigoBarras}</TableCell>
                    <TableCell>{product.nome}</TableCell>
                    <TableCell>{product.fabricante.nome}</TableCell>
                    <TableCell className="text-right">
                      {maskNumber(product.estoque, false, 3, ",", "")}
                    </TableCell>
                    <TableCell>{product.unidade.nome}</TableCell>
                    <TableCell className="text-right">
                      {maskNumber(product.precoVenda, true, 2)}
                      {/* R$ 1.000.000,00 */}
                    </TableCell>

                    <TableCell className="text-center">
                      {product.ativo ? <BadgeAtivo /> : <BadgeInativo />}
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
                              onEdit(product.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Edit2 size={15} />
                              Editar
                            </p>
                          </DropdownMenuItem>
                          {product.ativo ? (
                            <DropdownMenuItem
                              onClick={() => {
                                onChangeStatus(product.id, false);
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
                                onChangeStatus(product.id, true);
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
                              onDelete(product.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Trash2 size={15} />
                              Excluir
                            </p>
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => {
                              onDelete(product.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Files size={15} />
                              Duplicar produto
                            </p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>

                <ContextMenuContent className="p-4">
                  <ContextMenuItem onClick={() => onEdit(product.id)}>
                    <p className="flex items-center gap-2">
                      <Edit2 size={15} />
                      Editar
                    </p>
                  </ContextMenuItem>
                  {product.ativo ? (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(product.id, false)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleLeft size={16} />
                        Inativar
                      </p>
                    </ContextMenuItem>
                  ) : (
                    <ContextMenuItem
                      onClick={() => onChangeStatus(product.id, true)}
                    >
                      <p className="flex items-center gap-2">
                        <ToggleRight size={16} />
                        Ativar
                      </p>
                    </ContextMenuItem>
                  )}
                  {/* <ContextMenuItem onClick={() => onDelete(product.id)}>
                    <p className="flex items-center gap-2">
                      <Trash2 size={15} />
                      Excluir
                    </p>
                  </ContextMenuItem> */}
                  <ContextMenuItem onClick={() => onDelete(product.id)}>
                    <p className="flex items-center gap-2">
                      <Files size={15} />
                      Duplicar produto
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

export function TableProdutosPagination({
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
