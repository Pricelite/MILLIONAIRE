import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}

