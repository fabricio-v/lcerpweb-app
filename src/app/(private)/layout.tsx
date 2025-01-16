import { Header } from "@/components/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

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
    <SidebarProvider>
      <div className="flex flex-1 flex-col">
        <header>
          <Header />
        </header>

        <div className="flex">
          <AppSidebar />
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
