import { Combobox } from "@/components/combobox/Combobox";
import { AmountInput } from "@/components/input/AmountInput";
import { MonetaryInput } from "@/components/input/MonetaryInput";
import { PercentInput } from "@/components/input/PercentInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IProdutoPrecoResponse } from "@/interfaces/ProdutoResponse";
import { ITabelaPrecosResponse } from "@/interfaces/TabelaPrecosResponse";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

function AddItemListaPrecos({
  data,
  onAdd,
}: {
  data: ITabelaPrecosResponse[];
  onAdd: (item: IProdutoPrecoResponse) => void;
}) {
  const isMobile = useIsMobile();

  const [tabelaPrecoSelectedId, setTabelaPrecoSelectedId] = useState<
    string | number
  >("");
  const [tabelaPrecoSelectedNome, setTabelaPrecoSelectedNome] =
    useState<string>("");

  const [quantidadeMinima, setQuantidadeMinima] = useState<number>();
  const [precoVenda, setPrecoVenda] = useState<number>();
  const [markup, setMarkup] = useState<number>();
  const [lucro, setLucro] = useState<number>();

  useEffect(() => {
    if (tabelaPrecoSelectedId) {
      const item = data.find(
        (item) => item.id === Number(tabelaPrecoSelectedId),
      );
      if (item) {
        setTabelaPrecoSelectedNome(item.nome);
      }
    }
  }, [tabelaPrecoSelectedId]);

  return (
    <div className="flex flex-1 flex-col items-end gap-4 pb-4 md:flex-row">
      <Combobox
        label="Tabela de preços"
        data={data.map((item) => ({
          value: item.id + "",
          label: item.nome,
        }))}
        valueSelected={tabelaPrecoSelectedId}
        onChangeValueSelected={setTabelaPrecoSelectedId}
        disableFilter
      />
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
      />
      <PercentInput
        label="Markup"
        value={markup}
        onValueChange={(v) => {
          setMarkup(v.floatValue);
        }}
      />
      <PercentInput
        label="Lucro"
        value={lucro}
        onValueChange={(v) => {
          setLucro(v.floatValue);
        }}
      />
      <Button
        size={isMobile ? "default" : "icon"}
        variant={"outline"}
        className={isMobile ? "w-full" : ""}
        onClick={() => {
          // setPrecosAdicionaisLista((prev) => [
          //   ...prev,
          onAdd({
            id: new Date().getTime(),
            tabelaPrecoId: Number(tabelaPrecoSelectedId),
            tabelaPrecoNome: tabelaPrecoSelectedNome,
            quantidadeMinima: quantidadeMinima || 0,
            preco: precoVenda || 0,
            markup: markup || 0,
            margemLucro: lucro || 0,
          });

          setTabelaPrecoSelectedId("");
          setTabelaPrecoSelectedNome("");
          setQuantidadeMinima(undefined);
          setPrecoVenda(undefined);
          setMarkup(undefined);
          setLucro(undefined);
        }}
      >
        <Plus />
        {isMobile && "Adicionar preço"}
      </Button>
    </div>
  );
}

export default AddItemListaPrecos;
