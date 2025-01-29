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
  Files,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect } from "react";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnsList, setColumnsList] = useState<string[]>([]);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const isMobile = useIsMobile();

  const columns: ColumnDef<IClienteResponse>[] = [
    {
      accessorKey: "id",
      header: () => <TableHead className="w-[90px]">Cód. Interno</TableHead>,
      cell: ({ row }) => (
        <TableCell className="w-[90px]">{row.getValue("id")}</TableCell>
      ),
    },
    {
      accessorKey: "cpfCnpj",
      header: () => (
        <TableHead className="w-[180px] min-w-[180px]">CPF/CNPJ</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-[180px] min-w-[180px]">
          {maskCpfCnpj(row.getValue("cpfCnpj"))}
        </TableCell>
      ),
    },
    {
      accessorKey: "nome",

      header: () => (
        <TableHead className="min-w-[300px] max-w-[500px]">
          Nome do cliente
        </TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="min-w-[300px] max-w-[500px]">
          {row.getValue("nome")}
        </TableCell>
      ),
    },
    {
      accessorKey: "cidade",
      header: () => <TableHead className="min-w-[200px]">Cidade/UF</TableHead>,
      cell: ({ row }) => {
        const cliente = row.original;
        return (
          <TableCell className="min-w-[200px]">
            {cliente.cidade.nome + "/" + cliente.estado.uf}
          </TableCell>
        );
      },
    },
    {
      accessorKey: "ativo",
      header: () => (
        <TableHead className="w-[75px] text-center">Status</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-[75px] text-center">
          {row.getValue("ativo") ? <BadgeAtivo /> : <BadgeInativo />}
        </TableCell>
      ),
    },
    {
      accessorKey: "razaoSocial",
      header: () => (
        <TableHead className="w-full min-w-[200px]">Razão Social</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[200px]">
          {row.getValue("razaoSocial")}
        </TableCell>
      ),
    },
    {
      accessorKey: "apelido",
      header: () => (
        <TableHead className="w-full min-w-[150px]">Apelido</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[150px]">
          {row.getValue("apelido")}
        </TableCell>
      ),
    },
    {
      accessorKey: "tipoPessoaFisicaJuridica",
      header: () => (
        <TableHead className="w-full min-w-[100px]">Tipo</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[100px]">
          {row.getValue("tipoPessoaFisicaJuridica") === "F"
            ? "FÍSICA"
            : "JURÍDICA"}
        </TableCell>
      ),
    },
    {
      accessorKey: "endereco",
      header: () => (
        <TableHead className="w-full min-w-[200px]">Endereço</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[200px]">
          {row.getValue("endereco")}
        </TableCell>
      ),
    },
    {
      accessorKey: "numero",
      header: () => (
        <TableHead className="w-full min-w-[80px]">Número</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[80px]">
          {row.getValue("numero")}
        </TableCell>
      ),
    },
    {
      accessorKey: "bairro",
      header: () => (
        <TableHead className="w-full min-w-[150px]">Bairro</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[150px]">
          {row.getValue("bairro")}
        </TableCell>
      ),
    },
    {
      accessorKey: "referencia",
      header: () => (
        <TableHead className="w-full min-w-[200px]">Referência</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[200px]">
          {row.getValue("referencia")}
        </TableCell>
      ),
    },
    {
      accessorKey: "cep",
      header: () => <TableHead className="w-full min-w-[130px]">CEP</TableHead>,
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[130px]">
          {row.getValue("cep")}
        </TableCell>
      ),
    },
    {
      accessorKey: "contato1",
      header: () => (
        <TableHead className="w-full min-w-[150px]">Contato 1</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[150px]">
          {row.getValue("contato1")}
        </TableCell>
      ),
    },
    {
      accessorKey: "contato2",
      header: () => (
        <TableHead className="w-full min-w-[150px]">Contato 2</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[150px]">
          {row.getValue("contato2")}
        </TableCell>
      ),
    },
    {
      accessorKey: "contato3",
      header: () => (
        <TableHead className="w-full min-w-[150px]">Contato 3</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[150px]">
          {row.getValue("contato3")}
        </TableCell>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <TableHead className="w-full min-w-[150px]">Email</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[150px]">
          {row.getValue("email")}
        </TableCell>
      ),
    },
    {
      accessorKey: "email2",
      header: () => (
        <TableHead className="w-full min-w-[200px]">Email 2</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[200px]">
          {row.getValue("email2")}
        </TableCell>
      ),
    },
    {
      id: "actions",
      header: () => (
        <TableHead className="w-[75px] text-center">Ações</TableHead>
      ),
      enableHiding: false,
      cell: ({ row }) => (
        <TableCell className="w-[75px] text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  onEdit(row.original.id);
                }}
              >
                <p className="flex items-center gap-2">
                  <Edit2 size={15} />
                  Editar
                </p>
              </DropdownMenuItem>
              {row.original.ativo ? (
                <DropdownMenuItem
                  onClick={() => {
                    onChangeStatus(row.original.id, false);
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
                    onChangeStatus(row.original.id, true);
                  }}
                >
                  <p className="flex items-center gap-2">
                    <ToggleRight size={16} />
                    Ativar
                  </p>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  onDelete(row.original.id);
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
      ),
    },
  ];

  useEffect(() => {
    const columnsStorage = localStorage.getItem(
      LocalStorageKeys.ORDERS_COLUMNS_CLIENT,
    );

    if (columnsStorage !== null) {
      const colsParse = JSON.parse(columnsStorage);
      setColumnsList(
        colsParse
          .filter((col: any) => col.isSelected)
          .map((col: any) => col.value),
      );
    }
  }, []);

  const orderedColumns = columnsList
    .map((key) =>
      columns.find((col) => "accessorKey" in col && col.accessorKey === key),
    )
    .filter(Boolean) as ColumnDef<IClienteResponse>[];

  const actionColumn = columns.find((col) => col.id === "actions");

  const finalColumns: ColumnDef<IClienteResponse>[] = [
    ...orderedColumns,
    ...(actionColumn ? [actionColumn] : []), // Adicionar coluna de ações, se encontrada
  ];

  const table = useReactTable({
    data,
    columns: finalColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-end pb-3">
        <PopoverColumnsTable
          isMobile={isMobile}
          isOpenPopover={isOpenPopover}
          setIsOpenPopover={setIsOpenPopover}
          changeColumns={(columns) => {
            setColumnsList(
              columns
                .filter((col: any) => col.isSelected)
                .map((col: any) => col.value),
            );
          }}
        />

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} className="ml-auto">
              <Settings />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}

        <TablePagination
          totalPages={totalPages}
          currPage={currPage}
          onJumpToPage={onJumpToPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </div>

      <div className="w-full overflow-x-auto rounded-md border px-2 pb-3">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );
                })}
              </TableRow>
            ))}
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      className="odd:bg-zinc-100 dark:odd:bg-zinc-700"
                      onDoubleClick={() => {
                        onEdit(row.original.id);
                      }}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell) =>
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          ),
                        )}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="p-4">
                    <ContextMenuItem onClick={() => onEdit(row.original.id)}>
                      <p className="flex items-center gap-2">
                        <Edit2 size={15} />
                        Editar
                      </p>
                    </ContextMenuItem>
                    {row.original.ativo ? (
                      <ContextMenuItem
                        onClick={() => onChangeStatus(row.original.id, false)}
                      >
                        <p className="flex items-center gap-2">
                          <ToggleLeft size={16} />
                          Inativar
                        </p>
                      </ContextMenuItem>
                    ) : (
                      <ContextMenuItem
                        onClick={() => onChangeStatus(row.original.id, true)}
                      >
                        <p className="flex items-center gap-2">
                          <ToggleRight size={16} />
                          Ativar
                        </p>
                      </ContextMenuItem>
                    )}
                    <ContextMenuItem onClick={() => onDelete(row.original.id)}>
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
        </TableComponent>
      </div>
    </div>
  );
}

import BadgeAtivo from "@/components/badge/BadgeAtivo";
import BadgeInativo from "@/components/badge/BadgeInativo";
import { PaginationEllipsis } from "@/components/ui/pagination";
import { LocalStorageKeys } from "@/constants/LocalStorageKeys";
import { useIsMobile } from "@/hooks/use-mobile";
import { IClienteResponse } from "@/interfaces/response/ClienteResponse";
import { maskCpfCnpj } from "@/utils/Masks";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import PopoverColumnsTable from "./PopoverColumnsTable";

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
