import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, Phone, ArrowLeft, Share2 } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return { title: "Produto não encontrado" };

  return {
    title: `${product.title} | Siloferr`,
    description: product.description?.slice(0, 160),
    openGraph: {
      images: [product.image || ""],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Related products (same category, exclude current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 3,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 bg-white">
        {/* Breadcrumb / Back */}
        <div className="container-custom py-8">
          <Link
            href="/produtos"
            className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o catálogo
          </Link>
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                <Image
                  src={
                    product.image ||
                    "https://siloferr.com.br/Content/img/portfolio/produto2.jpg"
                  }
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Thumbnails placeholder if we had multiple images */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gray-100 relative overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    {/* Placeholder for future gallery */}
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-dark mb-6">
                  {product.title}
                </h1>
                <p className="text-lg text-text-muted leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs / Details */}
              {product.details && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-primary-dark mb-4">
                    Especificações Técnicas
                  </h3>
                  <div className="prose prose-sm text-text-muted">
                    {/* Basic rendering of details - could be markdown in future */}
                    <p>{product.details}</p>
                  </div>
                </div>
              )}

              {/* Key Features (Static for now, can be dynamic later) */}
              <div className="mb-10 space-y-3">
                <div className="flex items-center text-sm text-text-main">
                  <Check className="text-green-500 mr-3" size={18} />
                  <span>Alta durabilidade e resistência</span>
                </div>
                <div className="flex items-center text-sm text-text-main">
                  <Check className="text-green-500 mr-3" size={18} />
                  <span>Assistência técnica especializada</span>
                </div>
                <div className="flex items-center text-sm text-text-main">
                  <Check className="text-green-500 mr-3" size={18} />
                  <span>Garantia de fábrica</span>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/contato?produto=${product.slug}`}
                  className="btn-primary flex-1 text-center py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Solicitar Orçamento
                </Link>
                <Link
                  href="https://api.whatsapp.com/send?phone=5543988032859"
                  target="_blank"
                  className="btn-whatsapp flex-1 text-center py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  WhatsApp
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-sm text-text-muted">
                <span>Código: {product.id.slice(-6).toUpperCase()}</span>
                <button className="flex items-center hover:text-primary transition-colors">
                  <Share2 size={16} className="mr-2" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="py-20 bg-gray-50 mt-20 border-t border-gray-100">
            <div className="container-custom">
              <h2 className="text-2xl font-heading font-bold text-primary-dark mb-10 text-center">
                Produtos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produtos/${p.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all block"
                  >
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={
                          p.image ||
                          "https://siloferr.com.br/Content/img/portfolio/produto2.jpg"
                        }
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-primary-dark group-hover:text-primary transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-sm text-text-muted mt-1 truncate">
                        {p.category}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
