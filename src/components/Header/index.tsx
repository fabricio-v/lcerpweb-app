'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-[50px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full items-center px-5 justify-between">
        <Image
          src={'/logo-lc-black.webp'}
          width={120}
          height={40}
          alt="Logo LC Sistemas"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <Avatar>
                <AvatarImage src="https://github.com/fabricio-v.png" />
                <AvatarFallback>FV</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {}}>Sair</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
