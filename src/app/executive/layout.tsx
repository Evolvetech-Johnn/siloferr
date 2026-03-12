import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, TrendingUp, LogOut } from "lucide-react";
import { NotificationsBell } from "@/components/dashboard/NotificationsBell";

export default async function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = session.user.role;
  if (
    userRole !== "EXECUTIVE" &&
    userRole !== "ADMIN" &&
    userRole !== "SUPER_ADMIN" &&
    userRole !== "ANALYST"
  ) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-nobg.png"
            alt="Siloferr"
            className="h-8 w-auto object-contain"
          />
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link
            href="/executive"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-white font-medium transition-colors"
          >
            <BarChart3 size={20} className="text-accent" />
            Visão Executiva
          </Link>
          <Link
            href="/executive/reports"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-white font-medium transition-colors"
          >
            <TrendingUp size={20} className="text-accent" />
            Relatórios e Metas
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 font-medium transition-colors"
          >
            <LogOut size={20} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <NotificationsBell />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-500">Diretoria / Executivo</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
              {session.user.name?.charAt(0) || "D"}
            </div>
          </div>
        </header>
        <div className="p-8 overflow-auto h-[calc(100vh-4rem)]">{children}</div>
      </main>
    </div>
  );
}
