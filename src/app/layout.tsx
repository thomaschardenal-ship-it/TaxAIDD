import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/context/ProjectContext";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "TaxAIDD - Due Diligence Platform",
  description: "Plateforme de gestion de dossiers de due diligence fiscale, sociale, corporate et IP/IT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <ProjectProvider>
          <div className="flex min-h-screen bg-omni-gray-lighter">
            <Sidebar />
            <main className="flex-1 ml-60">
              {children}
            </main>
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
