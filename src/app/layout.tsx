import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ClientsProvider } from "@/context/ClientsContext";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export const metadata: Metadata = {
  title: "WeDD - Due Diligence Platform",
  description: "Plateforme de gestion de dossiers de due diligence fiscale, sociale, corporate et IP/IT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-wedd-cream">
        <ClientsProvider>
          <ProjectProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <SidebarWrapper>
                  {children}
                </SidebarWrapper>
              </div>
            </SidebarProvider>
          </ProjectProvider>
        </ClientsProvider>
      </body>
    </html>
  );
}
