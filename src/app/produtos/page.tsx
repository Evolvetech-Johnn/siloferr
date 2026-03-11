import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo de Produtos | Siloferr",
  description:
    "Confira nossa linha completa de equipamentos agrícolas, silos e acessórios industriais de alta performance.",
};

export default async function ProductsPage() {
  const products = await prisma.product
    .findMany({
      orderBy: { createdAt: "desc" },
    })
    .catch(() => [] as Product[]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 bg-bg-main">
        {/* Page Header */}
        <div className="bg-primary-dark text-white py-16 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://siloferr.com.br/Content/img/intro-carousel/1.png')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="container-custom relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Catálogo de Produtos
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Soluções robustas e inovadoras para armazenagem e processamento de
              grãos.
            </p>
          </div>
        </div>

        <div className="container-custom">
          <ProductCatalog products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
