import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

import Loading from "@/components/loading";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import localFont from "next/font/local";

const gothamBook = localFont({
  src: "../assets/fonts/GothamBook.ttf",
  variable: "--font-gotham-book",
  weight: "400",
});

const gothamBlack = localFont({
  src: "../assets/fonts/GothamBlack.ttf",
  variable: "--font-gotham-black",
  weight: "900",
});

const gothamBold = localFont({
  src: "../assets/fonts/GothamBold.ttf",
  variable: "--font-gotham-bold",
  weight: "700",
});

export const metadata: Metadata = {
  title: "LC ERP",
  description: "Aplicação LC ERP Web",
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
          className={`${gothamBook.variable} ${gothamBlack.variable} ${gothamBold.variable} m-h-screen overflow-hidden antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Loading />

            <main>{children}</main>

            <Toaster
              expand
              richColors
              position="bottom-right"
              closeButton
              // duration={7000}
            />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
