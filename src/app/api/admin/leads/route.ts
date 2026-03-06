import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const leads = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Leads Fetch Error:", error);
    return NextResponse.json({ error: "Erro ao buscar leads" }, { status: 500 });
  }
}
