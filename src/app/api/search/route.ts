import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !requireRole(session, ["ADMIN", "SUPER_ADMIN", "EXECUTIVE", "SALES", "ANALYST"])
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    if (q.length < 2) {
      return NextResponse.json({ products: [], leads: [], users: [] });
    }

    const [products, leads, users] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, category: true, slug: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.quoteRequest.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, email: true, status: true, createdAt: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, email: true, role: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ products, leads, users });
  } catch {
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}

