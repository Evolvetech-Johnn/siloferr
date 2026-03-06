import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, equipmentId } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e E-mail são obrigatórios." },
        { status: 400 },
      );
    }

    // Transaction to ensure data integrity
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.quoteRequest.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          message: message || null,
          equipmentId: equipmentId || null,
          status: "NEW",
        },
      });

      if (equipmentId) {
        await tx.product.update({
          where: { id: equipmentId },
          data: { priceRequestCnt: { increment: 1 } },
        });
      }

      return newLead;
    });

    console.log(`Novo Lead Salvo: ${lead.id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Oportunidade de negócio enviada com sucesso!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar sua solicitação." },
      { status: 500 },
    );
  }
}
