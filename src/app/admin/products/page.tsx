import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, Box, Star, ExternalLink, Package2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-dark">Equipamentos</h1>
          <p className="text-text-muted mt-1 text-lg">Catálogo B2B para vitrine pública do site.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-8 shadow-lg shadow-primary/20">
          <Plus size={20} />
          Cadastrar Equipamento
        </Link>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-text-muted uppercase tracking-widest">
                <th className="p-6">Informações do Produto</th>
                <th className="p-6">Categoria</th>
                <th className="p-6 text-center">Cliques / Cotações</th>
                <th className="p-6">Destaque</th>
                <th className="p-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-bg-alt rounded-full flex items-center justify-center text-text-muted">
                        <Package2 size={32} />
                      </div>
                      <p className="text-lg font-bold text-text-main">Nenhum equipamento cadastrado</p>
                      <p className="text-text-muted max-w-sm">Comece a povoar sua vitrine adicionando seu primeiro produto de alta performance.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/20 transition-all duration-300">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 shadow-sm">
                          <Image
                            src={product.image || "https://siloferr.com.br/Content/img/portfolio/produto2.jpg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-text-main text-lg leading-tight">{product.title}</p>
                          <p className="text-sm text-text-muted line-clamp-1 max-w-md mt-1 italic">
                            {product.description || "Sem descrição..."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-text-main flex items-center gap-2 w-fit">
                        <Box size={14} className="text-primary-light" />
                        {product.category}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-2xl font-black text-primary">{product.priceRequestCnt}</span>
                        <span className="text-[10px] uppercase font-bold text-text-muted tracking-tighter">Interessados</span>
                      </div>
                    </td>
                    <td className="p-6">
                      {product.isFeatured ? (
                        <div className="flex items-center gap-1.5 text-accent font-black text-sm">
                          <Star size={18} fill="currentColor" />
                          TOP
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-gray-300">Standard</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="p-3 text-text-muted hover:text-primary transition-all bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md"
                          title="Editar Equipamento"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link 
                          href="/" 
                          target="_blank" 
                          className="p-3 text-text-muted hover:text-blue-500 transition-all bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md"
                          title="Ver no Site"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
