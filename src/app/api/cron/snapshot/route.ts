import { NextResponse } from "next/server";
import { generateSnapshot } from "@/lib/jobs/snapshot-job";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const header = req.headers.get("authorization") || "";
      const ok = header === `Bearer ${secret}`;
      if (!ok) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
    }

    const result = await generateSnapshot();
    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar snapshot" },
      { status: 500 },
    );
  }
}

