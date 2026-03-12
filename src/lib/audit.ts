import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function writeAuditLog({
  session,
  action,
  entity,
  entityId,
  metadata,
}: {
  session: Session | null;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const userId = session?.user?.id;

  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        metadata: metadata ?? null,
      },
    });
  } catch {}
}
