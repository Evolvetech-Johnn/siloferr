"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  image?: string | null;
  description?: string | null;
  isFeatured: boolean;
  createdAt: Date;
}

const CATEGORIES = [
  { label: "Todos", value: "todos" },
  { label: "Equipamentos", value: "EQUIPAMENTOS" },
  { label: "Silos", value: "SILOS" },
  { label: "Acessórios", value: "ACESSORIOS" },
  { label: "Outros", value: "OUTROS" }
];

export function ProductCatalog({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === "todos" || product.category === activeCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
        <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-primary-dark">
            <SlidersHorizontal size={20} />
            <h3 className="font-heading font-bold text-lg">Filtros</h3>
          </div>

          {/* Search Mobile/Desktop */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-text-light uppercase tracking-wider mb-4">Categorias</h4>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat.value
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:bg-gray-50 hover:text-text-main"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-primary-dark">
            {activeCategory === "todos" ? "Todos os Produtos" : CATEGORIES.find(c => c.value === activeCategory)?.label}
            <span className="ml-3 text-sm font-normal text-text-muted bg-gray-100 px-2 py-1 rounded-full">
              {filteredProducts.length}
            </span>
          </h2>
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Filter className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-text-main mb-2">Nenhum produto encontrado</h3>
            <p className="text-text-muted max-w-md mx-auto">
              Tente ajustar seus filtros ou busca para encontrar o que procura.
            </p>
            <button 
              onClick={() => {setActiveCategory("todos"); setSearchQuery("");}}
              className="mt-6 text-primary font-semibold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
