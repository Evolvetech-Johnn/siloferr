import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(
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
    const { status } = body;

    const validStatuses = [
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "PROPOSAL_SENT",
      "NEGOTIATION",
      "WON",
      "LOST",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const lead = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });

    await prisma.leadActivity
      .create({
        data: {
          leadId: id,
          userId: session.user.id,
          type: "STATUS_CHANGE",
          description: `Status alterado para ${status}`,
        },
      })
      .catch(() => null);

    await writeAuditLog({
      session,
      action: "lead.status_update",
      entity: "QuoteRequest",
      entityId: lead.id,
      metadata: { status: lead.status },
    });

    if (lead.status === "WON") {
      await prisma.analyticsEvent
        .create({
          data: {
            type: "lead_won",
            entity: "QuoteRequest",
            entityId: lead.id,
            metadata: { email: lead.email, company: lead.company },
          },
        })
        .catch(() => null);

      await prisma.notification
        .create({
          data: {
            userId: session.user.id,
            title: "Lead ganho",
            message: `${lead.name} marcado como vendido.`,
          },
        })
        .catch(() => null);
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Lead Update Error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar lead" },
      { status: 500 },
    );
  }
}
