import { Header } from '@/components/header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import './globals.css';

import localFont from 'next/font/local';

const gothamBook = localFont({
  src: '../assets/fonts/GothamBook.ttf',
  variable: '--font-gotham-book',
  weight: '400',
});

const gothamBlack = localFont({
  src: '../assets/fonts/GothamBlack.ttf',
  variable: '--font-gotham-black',
  weight: '900',
});

const gothamBold = localFont({
  src: '../assets/fonts/GothamBold.ttf',
  variable: '--font-gotham-bold',
  weight: '700',
});

export const metadata: Metadata = {
  title: 'LC ERP',
  description: 'Aplicação web LC ERP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${gothamBook.variable} ${gothamBlack.variable} ${gothamBold.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <div className="flex flex-1 flex-col">
                <header>
                  <Header />
                </header>

                <div className="flex">
                  <AppSidebar />
                  <main className="flex-1">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
