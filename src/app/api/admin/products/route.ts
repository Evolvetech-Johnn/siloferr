import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, image, isFeatured } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Título e categoria são obrigatórios" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        image,
        isFeatured: !!isFeatured,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product Creation Error:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 },
    );
  }
}
