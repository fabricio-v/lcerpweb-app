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
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        <div className="w-full">
          <Header />
        </div>

        <div className="flex h-full w-full">
          <div className="h-full">
            <AppSidebar />
          </div>

          <div className="flex w-full flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
