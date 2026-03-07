"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Factory,
  TrendingUp,
  PieChart as PieIcon,
} from "lucide-react";

const COLORS = [
  "#0056b3",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#ec4899",
  "#8b5cf6",
];

export function ExecutiveCharts({
  totalLeads,
  wonDeals,
  leadConversionRate,
  chartData = [],
  categoryData = [],
  leadsGrowth = 0,
}: {
  totalLeads: number;
  wonDeals: number;
  leadConversionRate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryData?: any[];
  leadsGrowth?: number;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 font-medium tracking-tight">
              Total de Oportunidades
            </p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Factory size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-4xl font-black text-slate-900 leading-none">
              {totalLeads}
            </h3>
            <span
              className={`flex items-center text-sm font-bold px-2 py-1 rounded-md ${leadsGrowth >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
            >
              {leadsGrowth >= 0 ? (
                <ArrowUpRight size={14} className="mr-0.5" />
              ) : (
                <ArrowDownRight size={14} className="mr-0.5" />
              )}
              {Math.abs(leadsGrowth)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
            Vs. Semana Passada
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 font-medium tracking-tight">
              Negócios Fechados
            </p>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-4xl font-black text-slate-900 leading-none">
              {wonDeals}
            </h3>
            <span className="text-xs font-bold text-slate-400 italic">
              Conversão em foco
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
            Total Histórico
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 font-medium tracking-tight">
              Taxa de Conversão
            </p>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-4xl font-black text-slate-900 leading-none">
              {leadConversionRate}%
            </h3>
            <div className="flex flex-col items-end">
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-1000"
                  style={{
                    width: `${Math.min(parseFloat(leadConversionRate) / 0.15, 100)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-bold">
                Meta: 15%
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
            Performance Global
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Area Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Performance Semanal de Captação
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0056b3" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0056b3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#0056b3"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieIcon size={20} className="text-orange-400" />
            Distribuição por Categoria
          </h3>
          <div className="h-72 w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Sem dados de categoria.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Lead vs Conversion Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Comparativo: Leads vs Vendas
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="leads"
                  name="Leads"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="won"
                  name="Vendas"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
