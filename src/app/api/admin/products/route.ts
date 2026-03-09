import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

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
    const { title, description, category, image, isFeatured, details } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Título e categoria são obrigatórios" },
        { status: 400 },
      );
    }

    const baseSlug = generateSlug(title);
    let finalSlug = baseSlug;
    
    // Simple collision check (could be improved with loop but unlikely to have many collisions for now)
    const existing = await prisma.product.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug: finalSlug,
        description,
        details,
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
