import { Combobox } from "@/components/combobox/Combobox";
import { CepInput } from "@/components/input/CepInput";
import { InputWithLabel } from "@/components/input/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import useSearchCidades from "@/hooks/useSearchCidades";
import { IEstadoResponse } from "@/interfaces/response/EstadoResponse";
import { IPessoaEnderecoResponse } from "@/interfaces/response/PessoaEnderecoResponse";
import { randomUUID } from "crypto";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TableEnderecosAdicionais } from "./TableEnderecosAdicionais";

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

  const [isShowForm, setIsShowForm] = useState(false);

  const [id, setId] = useState<string>("");
  const [descricaoSel, setDescricaoSel] = useState<string | number>("");
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
    if (descricaoSel === "") {
      toast.warning("Selecione uma descrição");
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
    setId("");
    setDescricaoSel("");
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
      loadCidades(Number(estado.id), ""); //validar cidade digitada

      if (cidadeSel !== "") {
        const cidade = dataCidades.cidades.find(
          (e) => e.id === Number(cidadeSel),
        )!;
        cidade?.nome && setCidadeSelNome(cidade.nome);
      }
    } else {
      setEstadoSelUf("");

      loadCidades(null, "");
    }
  }, [estadoSel, cidadeSel]);

  return (
    <div>
      <div className="items-end">
        <h1 className="pb-4 text-xs font-semibold">Novo endereço</h1>
        <div className="flex flex-1 flex-col gap-6 pb-6">
          {/* <InputWithLabel
            ref={inputRef}
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={50}
            placeholder="Ex: Entrega, Cobrança, etc."
          /> */}
          <Combobox
            label="Tipo"
            data={[
              {
                label: "ENTREGA",
                value: "ENTREGA",
              },
              {
                label: "COBRANÇA",
                value: "COBRANÇA",
              },
              {
                label: "OUTROS",
                value: "OUTROS",
              },
            ]}
            valueSelected={descricaoSel}
            onChangeValueSelected={setDescricaoSel}
            disableFilter
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
            onClick={() => {
              limparFormulario();
              setIsShowForm(false);
            }}
          >
            Limpar
          </Button>

          <Button
            type="button"
            variant={"secondary"}
            info="Adicionar"
            onClick={() => {
              if (validate()) {
                onAdd({
                  id: id !== "" ? id : randomUUID(),
                  descricao: descricaoSel + "",
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

                limparFormulario();
                setIsShowForm(false);
              }
            }}
          >
            {/* <Plus /> */}
            Adicionar
          </Button>
        </div>
      </div>

      {true && (
        <>
          <Separator className="mb-2 mt-6" />
          <div className="flex flex-1 flex-col py-4">
            {/* <h1 className="pb-2 text-xs font-semibold">
              Endereços cadastrados
            </h1> */}
            <TableEnderecosAdicionais
              data={enderecosAdicionaisLista}
              onDelete={onRemove}
              onEdit={(item) => {
                setIsShowForm(true);
                setId(item.id);
                setDescricaoSel(item.descricao);
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
            {/* <div className="flex flex-1 flex-col gap-4">
              {enderecosAdicionaisLista.map((item, index) => (
                <ItemListaEnderecosAdicionais
                  item={item}
                  key={index}
                  onRemove={onRemove}
                  onEdit={(item) => {
                    setIsShowForm(true);
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
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}

export default AddItemListaEnderecosAdicionais;
