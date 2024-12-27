'use client';

import { ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex h-[50px] bg-lc-secondary">
      <div className="flex h-full w-full items-center px-5 justify-between">
        <Link href="/">
          <Image
            src={
              theme === 'dark' ? '/logo-lc-white.webp' : '/logo-lc-black.webp'
            }
            width={120}
            height={40}
            alt="Logo LC Sistemas"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/fabricio-v.png" />
                  <AvatarFallback>FV</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-5">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
              >
                Alterar tema ({theme === 'light' ? 'claro' : 'escuro'})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Sair</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
