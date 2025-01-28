import { AmountInput } from "@/components/input/AmountInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoPrecoAtacadoResponse } from "@/interfaces/response/ProdutoResponse";
import { CircleMinus } from "lucide-react";

function ItemListaAtacado({
  item,
  onRemove,
}: {
  item: IProdutoPrecoAtacadoResponse;
  onRemove: (item: IProdutoPrecoAtacadoResponse) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-1 flex-col gap-4 pb-4 md:flex-row">
      <div className="flex flex-1 flex-col items-end gap-4 pb-4 md:grid md:grid-cols-7">
        <InputWithLabel
          label={isMobile ? "Código" : ""}
          value={item.codigo}
          disabled
        />
        <InputWithLabel
          label={isMobile ? "Unidade" : ""}
          value={item.unidade.nome}
          disabled
        />
        <AmountInput
          label={isMobile ? "Quantidade" : ""}
          value={item.quantidade}
          onValueChange={(v) => {
            // setQuantidade(v.floatValue);
          }}
          disabled
        />
        <MonetaryInput
          label={isMobile ? "Preço" : ""}
          value={item.preco}
          onValueChange={(v) => {}}
          disabled
        />
        <MonetaryInput
          label={isMobile ? "Total" : ""}
          value={item.preco * item.quantidade}
          onValueChange={(v) => {}}
          disabled
        />
        <PercentInput
          label={isMobile ? "Markup" : ""}
          value={item.markup}
          onValueChange={(v) => {}}
          disabled
        />
        <PercentInput
          label={isMobile ? "Lucro" : ""}
          value={item.margemLucro}
          onValueChange={(v) => {}}
          disabled
        />
      </div>
      <Button
        type="button"
        size={isMobile ? "default" : "icon"}
        variant={"ghost"}
        className={isMobile ? "w-full text-red-600" : "mt-1"}
        onClick={() => onRemove(item)}
      >
        <CircleMinus color="red" />
        {isMobile && "Remover preço"}
      </Button>
    </div>
  );
}

export default ItemListaAtacado;
