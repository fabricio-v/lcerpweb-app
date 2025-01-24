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
import { Edit2, Files, Loader2, MoreVertical, Trash2 } from "lucide-react";

interface Props {
  data: IProdutoResumeResponse[] | undefined;
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TableProdutos({ data, isLoading, onEdit, onDelete }: Props) {
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
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
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
                          <DropdownMenuItem
                            onClick={() => {
                              onDelete(product.id);
                            }}
                          >
                            <p className="flex items-center gap-2">
                              <Trash2 size={15} />
                              Excluir
                            </p>
                          </DropdownMenuItem>
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
                  <ContextMenuItem onClick={() => onDelete(product.id)}>
                    <p className="flex items-center gap-2">
                      <Trash2 size={15} />
                      Excluir
                    </p>
                  </ContextMenuItem>
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
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : data === undefined ? (
                    ""
                  ) : (
                    "Nenhum registro encontrado"
                  )}
                </h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>
    </div>
  );
}

export function TableProdutosPagination() {
  return (
    <div className="pb-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
