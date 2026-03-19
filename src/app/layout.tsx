import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VitaLog — Seu diário de saúde com IA",
  description:
    "Registre sintomas no dia a dia e transforme tudo em um relatório médico completo para levar ao médico. Sem esquecer nada, sem enrolação.",
  keywords: ["saúde", "diário de saúde", "sintomas", "relatório médico", "IA", "VitaLog"],
  openGraph: {
    title: "VitaLog — Seu diário de saúde com IA",
    description:
      "Chegue na consulta com tudo que o médico precisa saber.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
