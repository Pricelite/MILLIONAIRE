import type { Metadata } from "next";

import "./globals.css";
import { AppProviders } from "@/components/layout/app-providers";

export const metadata: Metadata = {
  title: "RESTOMASTER",
  description: "Plateforme SaaS restaurant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
