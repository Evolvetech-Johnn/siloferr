import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Products } from "@/components/sections/Products";
import { Contact } from "@/components/sections/Contact";

import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export const dynamic = "force-dynamic";

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
];

export default async function Home() {
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
      <main className="w-full">
        <Hero />
        <About />
        <Services />

        {/* Call to Action Banner between sections */}
        <section className="relative w-full py-24 bg-primary-dark overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://siloferr.com.br/Content/img/intro-carousel/2.png')] bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay" />
          <div className="container-custom relative z-10 text-center">
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              Soluções Inteligentes em Armazenamento
            </h3>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Nossos especialistas estão prontos para tirar suas dúvidas e criar
              o projeto ideal para seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#contact" className="btn-primary px-8">
                Enviar E-mail
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=5543988032859"
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp px-8"
              >
                Falar no Whatsapp
              </a>
            </div>
          </div>
        </section>

        <Products initialProducts={products} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
