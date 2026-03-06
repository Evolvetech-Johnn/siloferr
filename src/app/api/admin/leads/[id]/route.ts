import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const lead = await prisma.quoteRequest.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Lead Update Error:", error);
    return NextResponse.json({ error: "Erro ao atualizar lead" }, { status: 500 });
  }
}
