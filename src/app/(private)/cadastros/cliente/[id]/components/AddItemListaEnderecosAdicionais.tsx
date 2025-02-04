import { Combobox } from "@/components/combobox/Combobox";
import { CepInput } from "@/components/input/CepInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import useSearchCidades from "@/hooks/useSearchCidades";
import { IEstadoResponse } from "@/interfaces/response/EstadoResponse";
import { IPessoaEnderecoResponse } from "@/interfaces/response/PessoaEnderecoResponse";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ItemListaEnderecosAdicionais from "./ItemListaEnderecosAdicionais";

interface Props {
  enderecosAdicionaisLista: IPessoaEnderecoResponse[];
  estados: IEstadoResponse[];
  onAdd: (endereco: IPessoaEnderecoResponse) => void;
  onRemove: (item: IPessoaEnderecoResponse) => void;
}

function AddItemListaEnderecosAdicionais({
  enderecosAdicionaisLista,
  estados,
  onRemove,
  onAdd,
}: Props) {
  const isMobile = useIsMobile();

  const { dataCidades, loadCidades } = useSearchCidades();

  const [id, setId] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [cep, setCep] = useState<string>("");
  const [referencia, setReferencia] = useState<string>("");
  const [estadoSel, setEstadoSel] = useState<string | number>("");
  const [estadoSelUf, setEstadoSelUf] = useState<string>("");
  const [cidadeSel, setCidadeSel] = useState<string | number>("");
  const [cidadeSelNome, setCidadeSelNome] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    if (descricao === "") {
      toast.warning(
        "Informe a descrição do endereço. Ex: Para entrega, Para cobrança, etc.",
      );
      inputRef.current?.focus();
      return false;
    }

    if (estadoSel === "") {
      toast.warning("Selecione um estado");
      return false;
    }

    if (cidadeSel === "") {
      toast.warning("Selecione uma cidade");
      return false;
    }

    return true;
  };

  const limparFormulario = () => {
    setId(0);
    setDescricao("");
    setEndereco("");
    setNumero("");
    setBairro("");
    setCep("");
    setReferencia("");
    setEstadoSel("");
    setEstadoSelUf("");
    setCidadeSel("");
    setCidadeSelNome("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (estadoSel !== "") {
      const estado = estados.find((e) => e.id === Number(estadoSel))!;
      setEstadoSelUf(estado.uf);
      loadCidades(Number(estado.id));

      if (cidadeSel !== "") {
        const cidade = dataCidades.cidades.find(
          (e) => e.id === Number(cidadeSel),
        )!;
        cidade?.nome && setCidadeSelNome(cidade.nome);
      }
    } else {
      setEstadoSelUf("");

      loadCidades(null);
    }
  }, [estadoSel, cidadeSel]);

  return (
    <div>
      <div className="items-end pb-4">
        <div className="flex flex-1 flex-col gap-6 pb-6">
          <InputWithLabel
            ref={inputRef}
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={50}
            placeholder="Ex: Entrega, Cobrança, etc."
          />
        </div>

        <div className="flex flex-1 flex-col gap-6 pb-6 md:grid md:grid-cols-[1fr_120px_1fr_200px]">
          <InputWithLabel
            label="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            maxLength={100}
          />

          <InputWithLabel
            label="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            maxLength={10}
          />

          <InputWithLabel
            label="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            maxLength={50}
          />

          <CepInput
            label="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>

        <div className="flex flex-1 flex-col gap-6 md:flex-row">
          <InputWithLabel
            label="Referência"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            maxLength={150}
          />
          <div className="flex flex-1 md:max-w-[250px]">
            <Combobox
              label="Estado"
              data={estados.map((item) => {
                return {
                  label: item.uf + " - " + item.nome,
                  value: item.id + "",
                };
              })}
              valueSelected={estadoSel}
              onChangeValueSelected={setEstadoSel}
            />
          </div>

          <div className="flex flex-1 md:max-w-[500px]">
            <Combobox
              label="Cidade"
              data={dataCidades.cidades.map((item) => {
                return {
                  label: item.nome,
                  value: item.id + "",
                };
              })}
              valueSelected={cidadeSel}
              onChangeValueSelected={setCidadeSel}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse justify-end gap-2 md:flex-row">
          <Button
            type="button"
            variant={"ghost"}
            className={isMobile ? "w-full" : ""}
            info="Limpar dados do endereço"
            onClick={limparFormulario}
          >
            Limpar
          </Button>

          <Button
            type="button"
            // size={isMobile ? "default" : "icon"}
            variant={"outline"}
            // className={isMobile ? "w-full" : ""}
            info="Adicionar endereço"
            onClick={() => {
              if (validate()) {
                onAdd({
                  id: id > 0 ? id : new Date().getTime(),
                  descricao,
                  cep,
                  cidade: {
                    id: Number(cidadeSel),
                    nome: cidadeSelNome,
                    estado: {
                      id: Number(estadoSel),
                      uf: estadoSelUf,
                      nome: "",
                    },
                  },
                  estado: {
                    id: Number(estadoSel),
                    uf: estadoSelUf,
                    nome: "",
                  },
                  endereco,
                  numero,
                  bairro,
                  referencia,
                });
              }
              limparFormulario();
            }}
          >
            <Plus />
            Adicionar endereço
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-4 py-4">
        {enderecosAdicionaisLista.map((item, index) => (
          <ItemListaEnderecosAdicionais
            item={item}
            key={index}
            onRemove={onRemove}
            onEdit={(item) => {
              setId(item.id);
              setDescricao(item.descricao);
              setCep(item.cep);
              setEndereco(item.endereco);
              setNumero(item.numero);
              setBairro(item.bairro);
              setReferencia(item.referencia);
              setEstadoSel(item.estado.id + "");
              setCidadeSel(item.cidade.id + "");
              setCidadeSelNome(item.cidade.nome);
              setEstadoSelUf(item.estado.uf);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AddItemListaEnderecosAdicionais;
