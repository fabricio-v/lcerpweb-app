import { AmountInput } from "@/components/input/AmountInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoPrecoResponse } from "@/interfaces/ProdutoResponse";
import { CircleMinus } from "lucide-react";

function ItemListaPrecos({
  item,
  onRemove,
}: {
  item: IProdutoPrecoResponse;
  onRemove: (item: IProdutoPrecoResponse) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-1 flex-col items-end gap-4 md:flex-row">
      {/* <Combobox
        label={isMobile ? "Tabela de preços" : ""}
        data={[]}
        valueSelected=""
        onChangeValueSelected={() => {}}
        disabled
      /> */}
      <InputWithLabel
        label={isMobile ? "Tabela de preços" : ""}
        value={item.tabelaPrecoNome}
        disabled
      />
      <AmountInput
        label={isMobile ? "Quantidade mínima" : ""}
        value={item.quantidadeMinima}
        disabled
      />
      <MonetaryInput
        label={isMobile ? "Preço de venda" : ""}
        value={item.preco}
        disabled
      />
      <PercentInput
        label={isMobile ? "Markup" : ""}
        value={item.markup}
        disabled
      />
      <PercentInput
        label={isMobile ? "Lucro" : ""}
        value={item.margemLucro}
        disabled
      />

      <Button
        size={isMobile ? "default" : "icon"}
        variant={"ghost"}
        className={isMobile ? "w-full text-red-600" : ""}
        onClick={() => onRemove(item)}
      >
        <CircleMinus color="red" />
        {isMobile && "Remover preço"}
      </Button>
    </div>
  );
}

export default ItemListaPrecos;
