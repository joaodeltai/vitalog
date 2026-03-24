import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/components/shared/Toast";
import { ServiceWorkerRegistrar } from "@/components/shared/ServiceWorkerRegistrar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vitalog-eight.vercel.app'),
  title: "VitaLog — Seu diário de saúde pessoal com IA",
  description:
    "Registre sintomas, acompanhe padrões e gere relatórios médicos com inteligência artificial.",
  keywords: ["saúde", "diário de saúde", "sintomas", "relatório médico", "IA", "VitaLog"],
  openGraph: {
    title: "VitaLog — Seu diário de saúde pessoal com IA",
    description:
      "Registre sintomas, acompanhe padrões e gere relatórios médicos com inteligência artificial.",
    type: "website",
    url: "https://vitalog-eight.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VitaLog" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D9488" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
