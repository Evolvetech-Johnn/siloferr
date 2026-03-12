import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    void req;
    const session = await getServerSession(authOptions);
    if (!requireRole(session, ["ADMIN", "SUPER_ADMIN", "SALES"])) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const activities = await prisma.leadActivity.findMany({
      where: { leadId: id },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(activities);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar atividades" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!requireRole(session, ["ADMIN", "SUPER_ADMIN", "SALES"])) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const description = (body?.description as string | undefined)?.trim();

    if (!description) {
      return NextResponse.json(
        { error: "Descrição é obrigatória" },
        { status: 400 },
      );
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: id,
        userId: session.user.id,
        type: "NOTE",
        description,
      },
      include: { user: { select: { name: true, email: true } } },
    });

    await writeAuditLog({
      session,
      action: "lead.note_create",
      entity: "LeadActivity",
      entityId: activity.id,
      metadata: { leadId: id },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar atividade" },
      { status: 500 },
    );
  }
}
