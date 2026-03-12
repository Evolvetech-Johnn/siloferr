import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

type AuditLogRow = {
  id: string;
  createdAt: Date;
  action: string;
  entity: string;
  entityId: string | null;
  user: { email: string; name: string | null } | null;
};

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams?: Promise<{
    user?: string;
    action?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  const resolved = (await searchParams) || {};

  const user = resolved.user?.trim() || "";
  const action = resolved.action?.trim() || "";
  const from = resolved.from?.trim() || "";
  const to = resolved.to?.trim() || "";

  const createdAt: { gte?: Date; lte?: Date } = {};
  if (from) createdAt.gte = new Date(from);
  if (to) createdAt.lte = new Date(to);

  const where = {
    ...(user
      ? { user: { email: { contains: user, mode: "insensitive" as const } } }
      : {}),
    ...(action
      ? { action: { contains: action, mode: "insensitive" as const } }
      : {}),
    ...(from || to ? { createdAt } : {}),
  };

  const logs: AuditLogRow[] = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-dark">
            Auditoria do Sistema
          </h1>
          <p className="text-text-muted mt-1 text-lg">
            Rastreamento de alterações críticas e acessos.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Usuário (email)
            </label>
            <input
              name="user"
              defaultValue={user}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="ex: vendas@siloferr.com.br"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Ação
            </label>
            <input
              name="action"
              defaultValue={action}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="ex: product.update"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
              De
            </label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Até
            </label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="btn-primary px-8">
              Filtrar
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-text-muted uppercase tracking-widest">
                <th className="p-6">Data</th>
                <th className="p-6">Usuário</th>
                <th className="p-6">Ação</th>
                <th className="p-6">Entidade</th>
                <th className="p-6">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-text-muted">
                    Nenhum evento encontrado para os filtros atuais.
                  </td>
                </tr>
              ) : (
                logs.map((log: AuditLogRow) => (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/10 transition-colors"
                  >
                    <td className="p-6 text-sm text-text-muted">
                      {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-text-main">
                        {log.user?.email || "-"}
                      </div>
                      {log.user?.name && (
                        <div className="text-xs text-text-muted">
                          {log.user.name}
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-text-main">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-text-main font-semibold">
                      {log.entity}
                    </td>
                    <td className="p-6 text-xs text-text-muted">
                      {log.entityId || "-"}
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
