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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]);
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-1",
    title: "Silo Metálico para Grãos",
    slug: "silo-metalico-para-graos",
    description:
      "Soluções robustas para armazenagem com alta durabilidade e performance.",
    details: null,
    category: "SILOS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: true,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: "fallback-2",
    title: "Transportador de Grãos",
    slug: "transportador-de-graos",
    description:
      "Equipamento desenvolvido para otimizar o fluxo e reduzir perdas no processo.",
    details: null,
    category: "EQUIPAMENTOS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: false,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-02T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  },
  {
    id: "fallback-3",
    title: "Rosca Transportadora",
    slug: "rosca-transportadora",
    description:
      "Projeto confiável e de fácil manutenção para diversas aplicações no agronegócio.",
    details: null,
    category: "EQUIPAMENTOS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: false,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-03T00:00:00.000Z"),
    updatedAt: new Date("2026-01-03T00:00:00.000Z"),
  },
  {
    id: "fallback-4",
    title: "Acessórios para Silo",
    slug: "acessorios-para-silo",
    description:
      "Componentes e acessórios para elevar a segurança e eficiência da operação.",
    details: null,
    category: "ACESSORIOS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: false,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-04T00:00:00.000Z"),
    updatedAt: new Date("2026-01-04T00:00:00.000Z"),
  },
  {
    id: "fallback-5",
    title: "Silo Pulmão",
    slug: "silo-pulmao",
    description:
      "Ideal para etapas intermediárias do processo, garantindo estabilidade e rendimento.",
    details: null,
    category: "SILOS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: false,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-05T00:00:00.000Z"),
    updatedAt: new Date("2026-01-05T00:00:00.000Z"),
  },
  {
    id: "fallback-6",
    title: "Estruturas Metálicas",
    slug: "estruturas-metalicas",
    description:
      "Projetos sob medida para suportar operação contínua com segurança e precisão.",
    details: null,
    category: "OUTROS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: false,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-06T00:00:00.000Z"),
    updatedAt: new Date("2026-01-06T00:00:00.000Z"),
  },
  {
    id: "fallback-7",
    title: "Peças e Componentes",
    slug: "pecas-e-componentes",
    description:
      "Reposição e complementos para manter sua linha sempre em pleno funcionamento.",
    details: null,
    category: "ACESSORIOS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: false,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-07T00:00:00.000Z"),
    updatedAt: new Date("2026-01-07T00:00:00.000Z"),
  },
  {
    id: "fallback-8",
    title: "Soluções Personalizadas",
    slug: "solucoes-personalizadas",
    description:
      "Desenvolvimento de projetos especiais para as necessidades do seu negócio.",
    details: null,
    category: "OUTROS",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    images: null,
    isFeatured: true,
    priceRequestCnt: 0,
    createdAt: new Date("2026-01-08T00:00:00.000Z"),
    updatedAt: new Date("2026-01-08T00:00:00.000Z"),
  },
];

export default async function ProductsPage() {
  const productsFromDb = await withTimeout(
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    }),
    1500,
  ).catch(() => [] as Product[]);
  const products = productsFromDb.length > 0 ? productsFromDb : FALLBACK_PRODUCTS;

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
