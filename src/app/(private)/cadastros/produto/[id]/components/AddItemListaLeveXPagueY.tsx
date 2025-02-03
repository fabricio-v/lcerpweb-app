import { AmountInput } from "@/components/input/AmountInput";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoPrecoLeveXPagueYResponse } from "@/interfaces/response/ProdutoResponse";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddItemListaLeveXPagueY({
  precoCusto,
  onAdd,
}: {
  precoCusto: number;
  onAdd: (item: IProdutoPrecoLeveXPagueYResponse) => void;
}) {
  const isMobile = useIsMobile();

  const [quantidadeMinima, setQuantidadeMinima] = useState<number>();
  const [precoVenda, setPrecoVenda] = useState<number>();
  const [markup, setMarkup] = useState<number>();
  const [lucro, setLucro] = useState<number>();

  const handlePrecoVendaBlur = () => {
    console.log(precoVenda, precoCusto);
    if (precoVenda && precoCusto) {
      const newMarkup = (precoVenda / precoCusto - 1) * 100;
      setMarkup(newMarkup);

      const newLucro =
        (((precoVenda as number) - (precoCusto as number)) / precoVenda) * 100;
      setLucro(newLucro);
    } else if (precoVenda === 0) {
      setMarkup(0.0);
      setLucro(0.0);
    }
  };

  const handleMargemLucroBlur = () => {
    if (lucro && precoCusto) {
      const newPrecoVenda = (precoCusto as number) / (1 - lucro / 100);
      setPrecoVenda(newPrecoVenda);

      const newMarkup = (newPrecoVenda / precoCusto - 1) * 100;
      setMarkup(newMarkup);
    } else if (lucro === 0) {
      setPrecoVenda(precoCusto);
      setMarkup(0.0);
    }
  };

  const handleMarkupBlur = () => {
    if (markup && precoCusto) {
      const newPrecoVenda = (precoCusto as number) + markup;
      setPrecoVenda(newPrecoVenda);

      const newMargem = (markup / newPrecoVenda) * 100;
      setLucro(newMargem);
    } else if (markup === 0) {
      setPrecoVenda(precoCusto);
      setLucro(0.0);
    }
  };

  const validate = () => {
    if (quantidadeMinima === undefined) {
      toast.warning("Informe a quantidade minima");
      return false;
    }

    if (quantidadeMinima <= 0) {
      toast.warning("A quantidade minima deve ser maior que 0 (zero)");
      return false;
    }

    if (precoVenda === undefined) {
      toast.warning("Informe o preço de venda");
      return false;
    }

    if (precoVenda <= 0) {
      toast.warning("O preço de venda deve ser maior que R$0,00");
      return false;
    }

    return true;
  };

  return (
    <div className="flex flex-1 flex-col items-end gap-6 pb-4 md:flex-row">
      <AmountInput
        label="Quantidade mínima"
        value={quantidadeMinima}
        onValueChange={(v) => {
          setQuantidadeMinima(v.floatValue);
        }}
      />
      <MonetaryInput
        label="Preço de venda"
        value={precoVenda}
        onValueChange={(v) => {
          setPrecoVenda(v.floatValue);
        }}
        onBlur={handlePrecoVendaBlur}
      />
      <PercentInput
        label="Markup"
        value={markup}
        onValueChange={(v) => {
          setMarkup(v.floatValue);
        }}
        onBlur={handleMarkupBlur}
      />
      <PercentInput
        label="Lucro"
        value={lucro}
        onValueChange={(v) => {
          setLucro(v.floatValue);
        }}
        onBlur={handleMargemLucroBlur}
      />
      <Button
        type="button"
        size={isMobile ? "default" : "icon"}
        variant={"outline"}
        className={isMobile ? "w-full" : ""}
        onClick={() => {
          if (validate()) {
            onAdd({
              id: new Date().getTime(),
              quantidadeMinima: quantidadeMinima || 0,
              preco: precoVenda || 0,
              markup: markup || 0,
              margemLucro: lucro || 0,
            });

            setQuantidadeMinima(0);
            setPrecoVenda(0);
            setMarkup(0);
            setLucro(0);
          }
        }}
      >
        <Plus />
        {isMobile && "Adicionar preço"}
      </Button>
    </div>
  );
}

export default AddItemListaLeveXPagueY;
