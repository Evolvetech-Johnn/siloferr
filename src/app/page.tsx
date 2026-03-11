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

export default async function Home() {
  const products = await prisma.product
    .findMany({
      orderBy: { createdAt: "desc" },
    })
    .catch(() => [] as Product[]);

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
