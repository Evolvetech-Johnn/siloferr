import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Inbox,
  Clock,
  Star,
  Package,
  ChevronRight,
} from "lucide-react";
import type { Product, QuoteRequest } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const newLeadsCount = await prisma.quoteRequest
    .count({
      where: { status: "NEW" },
    })
    .catch(() => 0);

  const totalProducts = await prisma.product.count().catch(() => 0);

  const recentLeads = await prisma.quoteRequest
    .findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    })
    .catch(() => [] as QuoteRequest[]);

  const topProducts = await prisma.product
    .findMany({
      take: 5,
      orderBy: { priceRequestCnt: "desc" },
    })
    .catch(() => [] as Product[]);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tight">
            Painel <span className="text-accent">Operacional</span>
          </h1>
          <p className="text-text-muted mt-2 font-medium">
            Gestão de Ativos e Fluxo de Oportunidades.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-red-500 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-text-muted font-black uppercase tracking-[0.2em]">
                Cotações Pendentes
              </p>
              <h3 className="text-5xl font-black text-primary mt-2">
                {newLeadsCount}
              </h3>
            </div>
            <div className="p-4 bg-zinc-100 text-primary rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
              <Inbox size={28} />
            </div>
          </div>
          <Link
            href="/admin/leads"
            className="text-sm text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver todas <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-accent flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-text-muted font-black uppercase tracking-[0.2em]">
                Produtos Ativos
              </p>
              <h3 className="text-5xl font-black text-primary mt-2">
                {totalProducts}
              </h3>
            </div>
            <div className="p-4 bg-zinc-100 text-primary rounded-2xl group-hover:bg-accent group-hover:text-white transition-all duration-500">
              <Package size={28} />
            </div>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Gerenciar Frota <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-text-main">
                Atividade Recente
              </h2>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-primary hover:underline"
            >
              Ver Histórico
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.length === 0 ? (
              <p className="p-10 text-center text-text-muted">
                Nenhuma atividade recente encontrada.
              </p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 hover:bg-gray-50/50 transition-colors flex justify-between items-center group"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-text-main leading-tight">
                      {lead.name}
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      {format(new Date(lead.createdAt), "dd 'de' MMM, HH:mm", {
                        locale: ptBR,
                      })}
                      •{" "}
                      <span className="text-primary font-medium">
                        {lead.status}
                      </span>
                    </p>
                  </div>
                  <Link
                    href="/admin/leads"
                    className="p-2 text-gray-300 group-hover:text-primary transition-colors"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Products Local Ranking */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-orange-400" />
              <h2 className="text-xl font-bold text-text-main">
                Equipamentos em Destaque
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-primary hover:underline"
            >
              Ver Performance
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.length === 0 ? (
              <p className="p-10 text-center text-text-muted">
                Nenhum equipamento disponível.
              </p>
            ) : (
              topProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-5 flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-black text-gray-100 group-hover:text-primary/10 transition-colors select-none">
                      #{topProducts.indexOf(product) + 1}
                    </div>
                    <div>
                      <p className="font-bold text-text-main leading-tight">
                        {product.title}
                      </p>
                      <p className="text-xs text-text-muted">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">
                      {product.priceRequestCnt}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-text-muted tracking-tighter">
                      Cliques
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
