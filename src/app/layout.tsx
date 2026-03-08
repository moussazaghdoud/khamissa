import type { Metadata } from "next";
import "./globals.css";
import EmergencyCalm from "@/components/EmergencyCalm";

export const metadata: Metadata = {
  title: "J'aide maman a guerir - Isaac",
  description:
    "Isaac accompagne maman dans son chemin vers la guerison. TCC, neurosciences et sagesse spirituelle islamique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <EmergencyCalm />
      </body>
    </html>
  );
}
