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
  title: "Siloferr Peças Agrícolas | Excelência em Fabricação",
  description: "Especializada em oferecer soluções para armazenamento, transporte e beneficiamento de produtos agrícolas.",
  keywords: ["siloferr", "peças agrícolas", "acessórios agrícolas", "equipamentos agrícolas", "fabrica de silos"],
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
