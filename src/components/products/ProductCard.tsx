"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    category: string;
    image?: string | null;
    description?: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/produtos/${product.slug}`} 
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        <Image
          src={product.image || "https://siloferr.com.br/Content/img/portfolio/produto2.jpg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm border border-gray-100">
          {product.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-heading font-bold text-lg text-primary-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-text-muted text-sm line-clamp-3 mb-4 flex-grow">
          {product.description || "Equipamento desenvolvido com alta tecnologia e durabilidade para o agronegócio."}
        </p>
        
        <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-text-light">Saiba mais</span>
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
