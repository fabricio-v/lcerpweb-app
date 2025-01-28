import { AmountInput } from "@/components/input/AmountInput";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoPrecoLeveXPagueYResponse } from "@/interfaces/response/ProdutoResponse";
import { CircleMinus } from "lucide-react";

function ItemListaLeveXPagueY({
  item,
  onRemove,
}: {
  item: IProdutoPrecoLeveXPagueYResponse;
  onRemove: (item: IProdutoPrecoLeveXPagueYResponse) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-1 flex-col items-end gap-4 md:flex-row">
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
        type="button"
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

export default ItemListaLeveXPagueY;
