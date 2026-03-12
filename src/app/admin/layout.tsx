import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { NotificationsBell } from "@/components/dashboard/NotificationsBell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = session.user.role;
  if (userRole === "EXECUTIVE") {
    redirect("/executive");
  }

  if (
    userRole !== "ADMIN" &&
    userRole !== "SUPER_ADMIN" &&
    userRole !== "SALES"
  ) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg-alt flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-nobg.png" alt="Siloferr" className="h-8 w-auto" />
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link
            href="/admin/leads"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-alt text-text-main font-medium transition-colors"
          >
            <Users size={20} className="text-primary" />
            Cotações/Leads
          </Link>
          {userRole !== "SALES" && (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-alt text-text-main font-medium transition-colors"
              >
                <LayoutDashboard size={20} className="text-primary" />
                Visão Geral
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-alt text-text-main font-medium transition-colors"
              >
                <Package size={20} className="text-primary" />
                Equipamentos
              </Link>
              {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
                <Link
                  href="/admin/audit"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-alt text-text-main font-medium transition-colors"
                >
                  <ShieldCheck size={20} className="text-primary" />
                  Auditoria
                </Link>
              )}
            </>
          )}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors"
          >
            <LogOut size={20} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <NotificationsBell />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-text-main">
                {session.user.name}
              </p>
              <p className="text-xs text-text-muted">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-bold">
              {session.user.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>
        <div className="p-8 overflow-auto h-[calc(100vh-4rem)]">{children}</div>
      </main>
    </div>
  );
}
