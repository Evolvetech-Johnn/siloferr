"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type CategoryValue = "todos" | "EQUIPAMENTOS" | "SILOS" | "ACESSORIOS" | "OUTROS";

interface Product {
  id: string;
  slug: string;
  category: string;
  title: string;
  description?: string | null;
  image?: string | null;
  isFeatured: boolean;
}

const FILTERS: { label: string; value: CategoryValue }[] = [
  { label: "Todos", value: "todos" },
  { label: "Equipamentos", value: "EQUIPAMENTOS" },
  { label: "Silos", value: "SILOS" },
  { label: "Acessórios", value: "ACESSORIOS" },
  { label: "Outros", value: "OUTROS" }
];

export function Products({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<CategoryValue>("todos");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "todos") return initialProducts;
    return initialProducts.filter((p) => p.category === activeFilter);
  }, [activeFilter, initialProducts]);

  return (
    <section id="products" className="section-padding bg-bg-base relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="container-custom">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-primary mb-8 relative inline-block tracking-tight">
            Engenharia de <span className="text-accent underline decoration-accent/30 underline-offset-8">Elite</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mt-6 font-medium leading-relaxed">
            Nossa linha completa de equipamentos fabricados com máxima precisão técnica para o agronegócio de alta performance.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-8 py-3 rounded-xl font-heading font-bold text-sm transition-all duration-500 border",
                activeFilter === filter.value 
                  ? "bg-primary text-white border-primary shadow-[0_10px_20px_rgba(0,0,0,0.15)] scale-105" 
                  : "bg-white text-text-main border-zinc-200 hover:border-accent hover:text-accent hover:shadow-lg"
              )}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.slice(0, 8).map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="glass-card group relative bg-white rounded-3xl overflow-hidden aspect-[4/5] focus-within:ring-2 focus-within:ring-accent outline-none"
                tabIndex={0}
              >
                <Link href={`/produtos/${product.slug}`} className="block w-full h-full relative">
                  <Image
                    src={product.image || "https://siloferr.com.br/Content/img/portfolio/produto2.jpg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Overlay Component */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 w-full">
                      <p className="text-accent text-xs font-black tracking-[0.2em] uppercase mb-2">
                        {product.category}
                      </p>
                      <h4 className="text-white text-2xl font-heading font-bold mb-4 leading-tight">
                        {product.title}
                      </h4>
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-white/80 text-sm font-bold flex items-center gap-2 group/btn">
                          Ver Detalhes
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                        <div className="bg-accent text-primary p-3 rounded-xl hover:scale-110 transition-transform">
                          <Search size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Nenhum produto cadastrado nesta categoria.
          </div>
        )}

        <div className="text-center">
          <Link 
            href="/produtos" 
            className="btn-primary"
          >
            Acessar Portfólio Industrial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
