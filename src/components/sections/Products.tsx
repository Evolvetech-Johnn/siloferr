"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type CategoryValue = "todos" | "EQUIPAMENTOS" | "SILOS" | "ACESSORIOS" | "OUTROS";

interface Product {
  id: string;
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
    <section id="products" className="section-padding bg-bg-alt">
      <div className="container-custom">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-dark mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
            Principais Produtos
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto mt-8">
            Nossa linha completa de equipamentos fabricados com máxima precisão técnica para o agronegócio.
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
                "px-6 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.05)]",
                activeFilter === filter.value 
                  ? "bg-primary text-white shadow-[0_4px_15px_rgba(0,86,179,0.3)] scale-105" 
                  : "bg-white text-text-main hover:bg-white/80 hover:text-primary hover:shadow-md"
              )}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] aspect-[4/3] focus-within:ring-2 focus-within:ring-primary outline-none"
                tabIndex={0}
              >
                <Image
                  src={product.image || "https://siloferr.com.br/Content/img/portfolio/produto2.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                
                {/* Overlay Component */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003d82]/95 via-[#003d82]/40 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full focus-within:translate-y-0">
                    <h4 className="text-white text-xl font-heading font-bold mb-1 leading-tight line-clamp-2">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-accent text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <Search size={12} strokeWidth={3} />
                        {product.category}
                      </span>
                      <a 
                        href={`https://api.whatsapp.com/send?phone=5543988032859&text=Olá! Gostaria de uma cotação para o equipamento: ${product.title}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white text-primary p-2 rounded-lg hover:bg-accent hover:text-white transition-colors"
                      >
                        <ShoppingCart size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Nenhum produto cadastrado nesta categoria.
          </div>
        )}
      </div>
    </section>
  );
}
