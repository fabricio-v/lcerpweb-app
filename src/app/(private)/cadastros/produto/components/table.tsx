import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IProdutoResumeResponse } from "@/interfaces/ProdutoResumeResponse";

interface Props {
  data: IProdutoResumeResponse[];
}

export function TableProdutos({ data }: Props) {
  return (
    <div className="flex flex-1 overflow-auto rounded-md border">
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
            <TableHead className="w-[140px] min-w-[140px]">Barras</TableHead>
            <TableHead className="min-w-[300px]">Nome do produto</TableHead>
            <TableHead>Fabricante</TableHead>
            <TableHead className="text-right">Estoque</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead className="text-right">Preço R$</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product, key) => (
            <TableRow key={key}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.codigo}</TableCell>
              <TableCell>{product.referencia}</TableCell>
              <TableCell>{product.codigoBarras}</TableCell>
              <TableCell>{product.nome}</TableCell>
              <TableCell>{product.fabricante.nome}</TableCell>
              <TableCell className="text-right">{product.estoque}</TableCell>
              <TableCell>{product.unidade.descricao}</TableCell>
              <TableCell className="text-right">{product.precoVenda}</TableCell>
              <TableCell className="text-center">...</TableCell>
            </TableRow>
          ))}
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
