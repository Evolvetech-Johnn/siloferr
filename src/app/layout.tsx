import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Siloferr | Engenharia de Alta Performance em Armazenagem Agrícola",
  description: "Líder em fabricação de silos e equipamentos para o agronegócio de elite. Tecnologia, precisão técnica e durabilidade sob medida para empresas de alta performance.",
  keywords: ["siloferr", "silos industriais", "engenharia agrícola", "armazenagem de grãos", "peças agrícolas de elite", "fabricação de silos premium"],
  openGraph: {
    title: "Siloferr | Soluções Industriais Premium",
    description: "Engenharia de elite para o agronegócio.",
    images: ["https://siloferr.com.br/Content/img/logo-dark.png"],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "https://siloferr.com.br/Content/img/favicon.png",
    apple: "https://siloferr.com.br/Content/img/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="antialiased font-sans text-text-main bg-bg-base">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
