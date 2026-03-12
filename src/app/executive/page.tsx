import { prisma } from "@/lib/prisma";
import { ExecutiveCharts } from "@/components/dashboard/ExecutiveCharts";
import { subDays, startOfDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]);
}

export default async function ExecutiveDashboard() {
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

  // 1. Fetch Global Metrics (Aggregate from snapshots for performance)
  const aggregateMetrics = await withTimeout(
    prisma.analyticsSnapshot.aggregate({
      _sum: { totalLeads: true, wonDeals: true },
    }),
    1500,
  ).catch(() => ({
    _sum: { totalLeads: 0, wonDeals: 0 },
  }));

  const totalLeads = aggregateMetrics._sum.totalLeads || 0;
  const wonDeals = aggregateMetrics._sum.wonDeals || 0;
  const leadConversionRate =
    totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : "0.0";

  // 2. WoW Growth Calculation (Last 7 days vs Previous 7 days)
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 7);
  const fourteenDaysAgo = subDays(today, 14);

  const currentPeriod = await withTimeout(
    prisma.analyticsSnapshot.aggregate({
      where: { date: { gte: sevenDaysAgo, lt: today } },
      _sum: { totalLeads: true },
    }),
    1500,
  ).catch(() => ({
    _sum: { totalLeads: 0 },
  }));

  const previousPeriod = await withTimeout(
    prisma.analyticsSnapshot.aggregate({
      where: { date: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
      _sum: { totalLeads: true },
    }),
    1500,
  ).catch(() => ({
    _sum: { totalLeads: 0 },
  }));

  const currentLeadsCount = currentPeriod._sum.totalLeads || 0;
  const previousLeadsCount = previousPeriod._sum.totalLeads || 0;

  let leadsGrowth = 0;
  if (previousLeadsCount > 0) {
    leadsGrowth = Math.round(
      ((currentLeadsCount - previousLeadsCount) / previousLeadsCount) * 100,
    );
  } else if (currentLeadsCount > 0) {
    leadsGrowth = 100;
  }

  // 3. Category Distribution (Joining leads with products)
  const leads = await withTimeout(
    prisma.quoteRequest.findMany({
      select: { equipmentId: true },
    }),
    1500,
  ).catch(() => [] as { equipmentId: string | null }[]);

  const products = await withTimeout(
    prisma.product.findMany({
      select: { id: true, category: true },
    }),
    1500,
  ).catch(() => [] as { id: string; category: string }[]);

  const productCategoryById = new Map(products.map((p) => [p.id, p.category]));

  const categoryMap: Record<string, number> = {};
  leads.forEach((lead) => {
    const category = (lead.equipmentId && productCategoryById.get(lead.equipmentId)) || "OUTROS";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 4. Chart Data (Last 7 days)
  const snapshots = await withTimeout(
    prisma.analyticsSnapshot.findMany({
      where: { date: { gte: sevenDaysAgo } },
      orderBy: { date: "asc" },
    }),
    1500,
  ).catch(() => [] as { date: Date; totalLeads: number; wonDeals: number }[]);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = date.toISOString().split("T")[0];
    const snapshot = snapshots.find(
      (s) => s.date.toISOString().split("T")[0] === dateStr,
    );

    return {
      name: format(date, "EEE", { locale: ptBR }),
      leads: snapshot?.totalLeads || 0,
      won: snapshot?.wonDeals || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900">
          Dashboard Estratégico
        </h1>
        <p className="text-slate-500 mt-1">
          Acompanhamento de Metas e Performance de Vendas
        </p>
      </div>

      <ExecutiveCharts
        totalLeads={totalLeads}
        wonDeals={wonDeals}
        leadConversionRate={leadConversionRate}
        chartData={chartData}
        categoryData={categoryData}
        leadsGrowth={leadsGrowth}
      />
    </div>
  );
}
