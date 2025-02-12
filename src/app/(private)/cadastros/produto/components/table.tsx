import BadgeAtivo from "@/components/badge/BadgeAtivo";
import BadgeInativo from "@/components/badge/BadgeInativo";
import { TablePagination } from "@/components/TablePagination";
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
import { LocalStorageKeys } from "@/constants/LocalStorageKeys";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoResumeResponse } from "@/interfaces/response/ProdutoResumeResponse";
import { maskNumber } from "@/utils/Masks";
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
import {
  Edit2,
  Files,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import PopoverColumnsTable from "./PopoverColumnsTable";

interface Props {
  data: IProdutoResumeResponse[] | undefined;
  isLoading: boolean;
  totalPages: number;
  currPage: number;
  onJumpToPage: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: boolean) => void;
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
  const isMobile = useIsMobile();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnsList, setColumnsList] = useState<string[]>([]);
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const columns: ColumnDef<IProdutoResumeResponse>[] = [
    {
      accessorKey: "codInterno",
      header: () => <TableHead className="w-[90px]">Cód. Interno</TableHead>,
      cell: ({ row }) => (
        <TableCell className="w-[90px]">{row.getValue("codInterno")}</TableCell>
      ),
    },
    {
      accessorKey: "codigoBarras",
      header: () => <TableHead className="min-w-[160px]">Barras</TableHead>,
      cell: ({ row }) => (
        <TableCell className="min-w-[160px]">
          {row.getValue("codigoBarras")}
        </TableCell>
      ),
    },
    {
      accessorKey: "referencia",
      header: () => <TableHead className="min-w-[160px]">Referência</TableHead>,
      cell: ({ row }) => (
        <TableCell className="min-w-[160px]">
          {row.getValue("referencia")}
        </TableCell>
      ),
    },
    {
      accessorKey: "codigo",
      header: () => <TableHead className="min-w-[160px]">Código</TableHead>,
      cell: ({ row }) => (
        <TableCell className="min-w-[160px]">
          {row.getValue("codigo")}
        </TableCell>
      ),
    },
    {
      accessorKey: "nome",
      header: () => (
        <TableHead className="w-full min-w-[300px]">Nome do produto</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[300px]">
          {row.getValue("nome")}
        </TableCell>
      ),
    },
    {
      accessorKey: "descricao",
      header: () => (
        <TableHead className="w-full min-w-[300px]">Descrição</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="w-full min-w-[300px]">
          {row.getValue("descricao")}
        </TableCell>
      ),
    },
    {
      accessorKey: "fabricante",
      header: () => <TableHead className="">Fabricante</TableHead>,
      cell: ({ row }) => (
        <TableCell className="">{row.original.fabricante.nome}</TableCell>
      ),
    },
    {
      accessorKey: "categoria",
      header: () => <TableHead className="">Categoria</TableHead>,
      cell: ({ row }) => (
        <TableCell className="">{row.original.categoria.nome}</TableCell>
      ),
    },
    {
      accessorKey: "subcategoria",
      header: () => <TableHead className="">Subcategoria</TableHead>,
      cell: ({ row }) => (
        <TableCell className="">{row.original.subcategoria.nome}</TableCell>
      ),
    },
    {
      accessorKey: "estoque",
      header: () => (
        <TableHead className="min-w-[130px] text-right">Estoque</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="min-w-[130px] text-right">
          {maskNumber(row.getValue("estoque"), false, 3)}
        </TableCell>
      ),
    },
    {
      accessorKey: "unidade",
      header: () => <TableHead className="min-w-[90px]">Unid</TableHead>,
      cell: ({ row }) => (
        <TableCell className="min-w-[90px]">
          {row.original.unidade.nome}
        </TableCell>
      ),
    },
    {
      accessorKey: "precoVenda",
      header: () => (
        <TableHead className="min-w-[130px] text-right">Preço R$</TableHead>
      ),
      cell: ({ row }) => (
        <TableCell className="min-w-[130px] text-right">
          {maskNumber(row.getValue("precoVenda"), true)}
        </TableCell>
      ),
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
      LocalStorageKeys.ORDERS_COLUMNS_PRODUCT,
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
    .filter(Boolean) as ColumnDef<IProdutoResumeResponse>[];

  const actionColumn = columns.find((col) => col.id === "actions");

  const finalColumns: ColumnDef<IProdutoResumeResponse>[] = [
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
        <TablePagination
          totalPages={totalPages}
          currPage={currPage}
          onJumpToPage={onJumpToPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />

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
      </div>

      <div className="w-full overflow-x-auto rounded-md border px-2 pb-3">
        <TableComponent>
          <TableHeader>
            {!isLoading &&
              table.getHeaderGroups().map((headerGroup) => (
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
