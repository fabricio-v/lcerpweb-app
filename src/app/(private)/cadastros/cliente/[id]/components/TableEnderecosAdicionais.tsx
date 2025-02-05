import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPessoaEnderecoResponse } from "@/interfaces/response/PessoaEnderecoResponse";
import { CircleMinus, Edit } from "lucide-react";

interface Props {
  data: IPessoaEnderecoResponse[] | undefined;
  onEdit: (endereco: IPessoaEnderecoResponse) => void;
  onDelete: (endereco: IPessoaEnderecoResponse) => void;
}

export function TableEnderecosAdicionais({ data, onEdit, onDelete }: Props) {
  return (
    <div className="flex max-w-full overflow-auto rounded-md border px-2 pb-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full min-w-[300px]">
              Endereços adicionais
            </TableHead>
            <TableHead className="w-[75px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((item, key) => (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={key}
                    // className="odd:bg-zinc-50 dark:odd:bg-zinc-700"
                    onDoubleClick={() => {
                      onEdit(item);
                    }}
                  >
                    <TableCell>
                      <h1 className="py-2 text-sm text-lc-secondary">
                        <h1 className="font-semibold text-lc-secondary">{`${item.descricao}`}</h1>
                        {`${item.endereco}, Nº ${item.numero}, ${item.bairro} - ${item.cidade.nome}/${item.estado.uf} - CEP: ${item.cep}`}
                        <h1 className="text-lc-secondary">{`${item.referencia && `(${item.referencia})`}`}</h1>
                      </h1>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => onEdit(item)}
                        >
                          <Edit />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => onDelete(item)}
                        >
                          <CircleMinus color="red" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>

                <ContextMenuContent className="p-4">
                  <ContextMenuItem onClick={() => onEdit(item)}>
                    <p className="flex items-center gap-2">
                      <Edit size={15} />
                      Editar
                    </p>
                  </ContextMenuItem>

                  <ContextMenuItem onClick={() => onEdit(item)}>
                    <p className="flex items-center gap-2">
                      <CircleMinus size={15} color="red" />
                      Remover
                    </p>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-16 flex-auto">
                <h1 className="flex justify-center text-lc-secondary">
                  Nenhum endereço adicional
                </h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
