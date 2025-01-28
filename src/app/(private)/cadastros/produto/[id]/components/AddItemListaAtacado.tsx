import { Combobox } from "@/components/combobox/Combobox";
import { AmountInput } from "@/components/input/AmountInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoPrecoAtacadoResponse } from "@/interfaces/response/ProdutoResponse";
import { IUnidadeResponse } from "@/interfaces/response/UnidadeResponse";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function AddItemListaAtacado({
  precoCusto,
  onAdd,
  unidadeLista,
}: {
  precoCusto: number;
  unidadeLista: IUnidadeResponse[];
  onAdd: (item: IProdutoPrecoAtacadoResponse) => void;
}) {
  const isMobile = useIsMobile();

  const [codigo, setCodigo] = useState<string>("");
  const [unidadeSelId, setUnidadeSelId] = useState<string | number>("");
  const [unidadeSelNome, setUnidadeSelNome] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>();
  const [precoVenda, setPrecoVenda] = useState<number>();
  const [markup, setMarkup] = useState<number>();
  const [lucro, setLucro] = useState<number>();
  const [total, setTotal] = useState<number>();

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
    if (codigo.trim().length === 0) {
      toast.warning("Informe o código da embalagem");
      return false;
    }

    if (unidadeSelId === "") {
      toast.warning("Informe a unidade da embalagem");
      return false;
    }

    if (quantidade === undefined) {
      toast.warning("Informe a quantidade minima");
      return false;
    }

    if (quantidade <= 0) {
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

  useEffect(() => {
    if (quantidade && precoVenda) {
      setTotal(quantidade * precoVenda);
    }
  }, [quantidade, precoVenda]);

  useEffect(() => {
    if (unidadeSelId) {
      const item = unidadeLista.find(
        (item) => item.id === Number(unidadeSelId),
      );
      if (item) {
        setUnidadeSelNome(item.descricao);
      }
    }
  }, [unidadeSelId]);

  return (
    <div className="flex flex-1 flex-col gap-4 pb-4 md:flex-row">
      <div className="flex flex-1 flex-col items-end gap-4 pb-4 md:grid md:grid-cols-7">
        <InputWithLabel
          label="Código"
          maxLength={20}
          value={codigo}
          onChange={(v) => {
            setCodigo(v.target.value);
          }}
        />

        <Combobox
          data={unidadeLista.map((item) => {
            return {
              label: item.descricao + " - " + item.nome,
              value: item.id + "",
            };
          })}
          label="Unidade"
          valueSelected={unidadeSelId}
          onChangeValueSelected={setUnidadeSelId}
        />

        <AmountInput
          label="Quantidade"
          value={quantidade}
          onValueChange={(v) => {
            setQuantidade(v.floatValue);
          }}
        />
        <MonetaryInput
          label="Preço unitário"
          value={precoVenda}
          onValueChange={(v) => {
            setPrecoVenda(v.floatValue);
          }}
          onBlur={handlePrecoVendaBlur}
        />
        <MonetaryInput
          label={`Total ${unidadeSelNome}`}
          value={total}
          onValueChange={(v) => {}}
          onBlur={handlePrecoVendaBlur}
          className="pointer-events-none"
          readOnly
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
      </div>

      <Button
        type="button"
        size={isMobile ? "default" : "icon"}
        variant={"outline"}
        className={isMobile ? "w-full" : "mt-6"}
        onClick={() => {
          if (validate()) {
            onAdd({
              id: new Date().getTime(),
              unidade: {
                id: Number(unidadeSelId),
                nome: unidadeSelNome,
              },
              codigo: codigo,
              quantidade: quantidade || 0,
              preco: precoVenda || 0,
              markup: markup || 0,
              margemLucro: lucro || 0,
            });

            setUnidadeSelId("");
            setCodigo("");
            setQuantidade(0);
            setPrecoVenda(0);
            setMarkup(0);
            setLucro(0);
            setTotal(0);
          }
        }}
      >
        <Plus />
        {isMobile && "Adicionar preço"}
      </Button>
    </div>
  );
}

export default AddItemListaAtacado;
