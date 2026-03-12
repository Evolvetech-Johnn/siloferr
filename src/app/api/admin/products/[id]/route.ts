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
    const session = await getServerSession(authOptions);
    if (!requireRole(session, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!requireRole(session, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, category, image, isFeatured } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        category,
        image,
        isFeatured: !!isFeatured,
      },
    });

    await writeAuditLog({
      session,
      action: "product.update",
      entity: "Product",
      entityId: product.id,
      metadata: {
        title: product.title,
        category: product.category,
        isFeatured: product.isFeatured,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product Update Error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!requireRole(session, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await prisma.product.delete({
      where: { id },
    });

    await writeAuditLog({
      session,
      action: "product.delete",
      entity: "Product",
      entityId: deleted.id,
      metadata: {
        title: deleted.title,
        category: deleted.category,
        slug: deleted.slug,
      },
    });

    return NextResponse.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    console.error("Product Delete Error:", error);
    return NextResponse.json(
      { error: "Erro ao remover produto" },
      { status: 500 },
    );
  }
}
