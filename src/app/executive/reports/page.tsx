import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startOfDay, subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Trophy, Target, Users, Package } from "lucide-react";

export const dynamic = "force-dynamic";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]);
}

export default async function ExecutiveReportsPage() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "EXECUTIVE" &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "ANALYST")
  ) {
    redirect("/login");
  }

  const today = startOfDay(new Date());
  const last30Days = subDays(today, 30);

  const leadsByStatus = await withTimeout(
    prisma.quoteRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    1500,
  ).catch(
    () =>
      [] as {
        status: string;
        _count: { _all: number };
      }[],
  );

  const leadsLast30Days = await withTimeout(
    prisma.quoteRequest.count({
      where: { createdAt: { gte: last30Days } },
    }),
    1500,
  ).catch(() => 0);

  const wonLast30Days = await withTimeout(
    prisma.quoteRequest.count({
      where: { status: "WON", updatedAt: { gte: last30Days } },
    }),
    1500,
  ).catch(() => 0);

  const topProducts = await withTimeout(
    prisma.product.findMany({
      take: 8,
      orderBy: { priceRequestCnt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        priceRequestCnt: true,
      },
    }),
    1500,
  ).catch(
    () =>
      [] as {
        id: string;
        title: string;
        category: string;
        priceRequestCnt: number;
      }[],
  );

  const recentLeads = await withTimeout(
    prisma.quoteRequest.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    }),
    1500,
  ).catch(
    () =>
      [] as {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        status: string;
        createdAt: Date;
      }[],
  );

  const statusMap = new Map(leadsByStatus.map((s) => [s.status, s._count._all]));
  const statusOrder = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">
            Relatórios e Metas
          </h1>
          <p className="text-slate-500 mt-1">
            Consolidado executivo dos últimos 30 dias e visão operacional.
          </p>
        </div>

        <Link
          href="/executive"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium tracking-tight">
              Leads (30 dias)
            </p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black text-slate-900 leading-none">
              {leadsLast30Days}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
              Desde {format(last30Days, "dd/MM", { locale: ptBR })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium tracking-tight">
              Negócios ganhos (30 dias)
            </p>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Trophy size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black text-slate-900 leading-none">
              {wonLast30Days}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
              Status WON atualizado
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium tracking-tight">
              Meta sugerida (30 dias)
            </p>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Target size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black text-slate-900 leading-none">
              {Math.max(10, Math.ceil(leadsLast30Days * 0.15))}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
              15% de conversão de leads
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Distribuição por Status
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Totais consolidados (base completa).
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {statusOrder.map((status) => {
              const count = statusMap.get(status) || 0;
              return (
                <div
                  key={status}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="text-sm font-semibold text-slate-800">
                      {status}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Produtos mais solicitados
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Ranking por pedidos de cotação.
              </p>
            </div>
            <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
              <Package size={18} />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.length === 0 ? (
              <div className="px-6 py-8 text-slate-400 italic">
                Sem dados de produtos no momento.
              </div>
            ) : (
              topProducts.map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {p.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {p.category}
                    </div>
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {p.priceRequestCnt}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Leads recentes</h2>
          <p className="text-sm text-slate-500 mt-1">
            Últimos registros cadastrados (base completa).
          </p>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-bold px-6 py-3">Nome</th>
                <th className="text-left font-bold px-6 py-3">E-mail</th>
                <th className="text-left font-bold px-6 py-3">Telefone</th>
                <th className="text-left font-bold px-6 py-3">Status</th>
                <th className="text-left font-bold px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-slate-400 italic"
                  >
                    Sem leads cadastrados no momento.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{lead.email}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {lead.phone || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {format(lead.createdAt, "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
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
