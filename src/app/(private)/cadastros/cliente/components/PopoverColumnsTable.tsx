import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

interface ItemsProps {
  id: number;
  value: string;
  nome: string;
  isSelected: boolean;
}

const defaultColumns: ItemsProps[] = [
  { id: 1, value: "codInterno", nome: "Cód. Interno", isSelected: false },
  { id: 3, value: "nome", nome: "Nome", isSelected: true },
  { id: 6, value: "cpfCnpj", nome: "CPF/CNPJ", isSelected: true },
  { id: 18, value: "cidade", nome: "Cidade/UF", isSelected: true },
  { id: 19, value: "pais", nome: "País", isSelected: false },
  { id: 2, value: "ativo", nome: "Status", isSelected: true },
  { id: 5, value: "apelido", nome: "Apelido", isSelected: false },
  { id: 4, value: "razaoSocial", nome: "Razão Social", isSelected: false },
  { id: 7, value: "tipoPessoaFisicaJuridica", nome: "Tipo", isSelected: false },
  { id: 8, value: "endereco", nome: "Endereço", isSelected: false },
  { id: 9, value: "numero", nome: "Número", isSelected: false },
  { id: 10, value: "bairro", nome: "Bairro", isSelected: false },
  { id: 11, value: "referencia", nome: "Referência", isSelected: false },
  { id: 12, value: "cep", nome: "CEP", isSelected: false },
  { id: 13, value: "contato1", nome: "Contato1", isSelected: false },
  { id: 14, value: "contato2", nome: "Contato2", isSelected: false },
  { id: 15, value: "contato3", nome: "Contato3", isSelected: false },
  { id: 16, value: "email", nome: "Email", isSelected: false },
  { id: 17, value: "email2", nome: "Email2", isSelected: false },
];

const PopoverColumnsTable = ({
  isMobile,
  isOpenPopover,
  setIsOpenPopover,
  changeColumns,
}: {
  isMobile: boolean;
  isOpenPopover: boolean;
  setIsOpenPopover: (value: boolean) => void;
  changeColumns: (columns: ItemsProps[]) => void;
}) => {
  const [columnsList, setColumnsList] = useState<ItemsProps[]>(defaultColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumnsList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleCheckboxChange = (id: number) => {
    setColumnsList((prevColumns) =>
      prevColumns.map((column) =>
        column.id === id
          ? { ...column, isSelected: !column.isSelected }
          : column,
      ),
    );
  };

  const handleAplicar = () => {
    localStorage.setItem(
      LocalStorageKeys.ORDERS_COLUMNS_CLIENT,
      JSON.stringify(columnsList),
    );
    changeColumns(columnsList);
    setIsOpenPopover(false);
  };

  const handleAplicarPadrao = () => {
    localStorage.setItem(
      LocalStorageKeys.ORDERS_COLUMNS_CLIENT,
      JSON.stringify(defaultColumns),
    );
    changeColumns(defaultColumns);
    setColumnsList(defaultColumns);
    setIsOpenPopover(false);
  };

  useEffect(() => {
    const columnsStorage = localStorage.getItem(
      LocalStorageKeys.ORDERS_COLUMNS_CLIENT,
    );

    if (columnsStorage === null) {
      localStorage.setItem(
        LocalStorageKeys.ORDERS_COLUMNS_CLIENT,
        JSON.stringify(defaultColumns),
      );
    } else {
      setColumnsList(JSON.parse(columnsStorage));
    }
  }, []);

  return (
    <div className="">
      <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
        <PopoverTrigger asChild>
          <Button style={{ width: 55 }} variant={"ghost"} className="ml-0">
            <Settings />
            <ChevronDown />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="overflow-hidden"
          style={{
            // width: popoverWidth,
            maxHeight: !isMobile ? "60vh" : "45vh", // Cresce até 80% da altura da viewport
            overflowY: "auto", // Ativa o scroll vertical, se necessário
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="flex flex-col pb-16">
              <h1 className="pb-4 text-base">
                Selecione e organize as colunas
              </h1>
              <SortableContext
                items={columnsList}
                strategy={verticalListSortingStrategy}
              >
                {columnsList.map((col) => (
                  <ColumnItem
                    key={col.id}
                    column={col}
                    changeIsSelected={handleCheckboxChange}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
          <div className="absolute bottom-0 left-0 flex w-full bg-lc-primary px-4 py-3">
            <Button
              onClick={handleAplicarPadrao}
              variant={"link"}
              className="mt-4 w-min"
            >
              Redefinir padrão
            </Button>
            <Button
              onClick={handleAplicar}
              variant={"outline"}
              className="ml-auto mt-4 w-min"
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocalStorageKeys } from "@/constants/LocalStorageKeys";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Grip, Settings } from "lucide-react";
import { FC } from "react";

interface ColumnItemProps {
  column: ItemsProps;
  changeIsSelected: (id: number) => void;
}

const ColumnItem: FC<ColumnItemProps> = (props) => {
  const { column, changeIsSelected } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      onClick={() => {
        changeIsSelected(column.id);
      }}
      ref={setNodeRef}
      style={style}
      className="mb-2 flex cursor-pointer select-none justify-between rounded-sm px-2 py-1 shadow-md"
    >
      <div className="flex items-center gap-2">
        <Checkbox checked={column.isSelected} />
        <p className="font-gotham text-sm">{column.nome}</p>
      </div>
      <Button
        {...attributes}
        {...listeners}
        className="cursor-move"
        size={"icon"}
        variant={"ghost"}
      >
        <Grip className="opacity-20" />
      </Button>
    </div>
  );
};

export default PopoverColumnsTable;
