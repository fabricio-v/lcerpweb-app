import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableProdutos() {
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
          {[1, 2, 3, 4].map((key) => (
            <TableRow key={key}>
              <TableCell>100000</TableCell>
              <TableCell>123456789</TableCell>
              <TableCell>123456789</TableCell>
              <TableCell>7894561232548</TableCell>
              <TableCell>Nome do produto</TableCell>
              <TableCell>Fabricante</TableCell>
              <TableCell className="text-right">100000,000</TableCell>
              <TableCell>UN</TableCell>
              <TableCell className="text-right">R$1.000.000,00</TableCell>
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
