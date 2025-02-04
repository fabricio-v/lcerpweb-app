import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { IPessoaEnderecoResponse } from "@/interfaces/response/PessoaEnderecoResponse";
import { CircleMinus, Edit } from "lucide-react";

interface Props {
  item: IPessoaEnderecoResponse;
  onRemove: (item: IPessoaEnderecoResponse) => void;
  onEdit: (item: IPessoaEnderecoResponse) => void;
}

function ItemListaEnderecosAdicionais({ item, onRemove, onEdit }: Props) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-1 flex-col items-center gap-4 rounded-md p-2 hover:bg-zinc-100 md:flex-row">
      <div
        className="flex flex-1 cursor-pointer flex-col"
        onClick={() => onEdit(item)}
      >
        <h1 className="text-lc-secondary">
          <h1 className="font-semibold text-lc-secondary">{`${item.descricao}`}</h1>
          {`${item.endereco}, Nº ${item.numero}, ${item.bairro} - ${item.cidade.nome}/${item.estado.uf} - CEP: ${item.cep}`}
          <h1 className="text-lc-secondary">{`${item.referencia && `(${item.referencia})`}`}</h1>
        </h1>
        {/* <h1 className="text-lc-secondary">{`${item.referencia}`}</h1> */}
      </div>
      <Button
        type="button"
        size={isMobile ? "default" : "icon"}
        variant={"ghost"}
        className={isMobile ? "w-full" : ""}
        onClick={() => onEdit(item)}
        info="Editar endereço"
      >
        <Edit />
        {isMobile && "Editar endereço"}
      </Button>

      <Button
        type="button"
        size={isMobile ? "default" : "icon"}
        variant={"ghost"}
        className={isMobile ? "w-full text-red-600" : ""}
        onClick={() => onRemove(item)}
        info="Remover endereço"
      >
        <CircleMinus color="red" />
        {isMobile && "Remover endereço"}
      </Button>
    </div>
  );
}

export default ItemListaEnderecosAdicionais;
