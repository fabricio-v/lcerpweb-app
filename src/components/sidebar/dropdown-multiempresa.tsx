import { ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSidebar } from '../ui/sidebar';

const DropdownMultiempresa = () => {
  const { isMobile } = useSidebar();

  return (
    <div className="pb-2">
      {/* <span className="text-xs text-lc-tertiary">Empresa selecionada</span> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer ">
            <div className="w-10 h-10 bg-transparent rounded-md">
              <Image
                src={'/pipa.webp'}
                width={40}
                height={40}
                alt="Logo empresa selecionada"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-sm font-gothamBold">Nome da empresa</h1>
              <span className="text-[10px] opacity-50">00.000.000/0000-00</span>
            </div>

            <ChevronsUpDown size={15} className="ml-auto" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side={isMobile ? 'bottom' : 'right'}
          sideOffset={4}
        ></DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMultiempresa;
