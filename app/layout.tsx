import type { Metadata } from "next";
import "./globals.css";
import { TopRightHomeButton } from "@/components/top-right-home-button";

export const metadata: Metadata = {
  title: "DevisPro AI",
  description: "Decris ton chantier. L'IA cree ton devis."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <TopRightHomeButton />
        {children}
      </body>
    </html>
  );
}
