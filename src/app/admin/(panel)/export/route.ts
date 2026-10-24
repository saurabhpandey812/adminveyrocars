import { requireAdmin } from "@/server/admin";
import { readDB } from "@/server/db";

export async function GET() {
  await requireAdmin();
  return new Response(JSON.stringify(await readDB(), null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="backup-${new Date().toISOString().slice(0, 10)}.json"` },
  });
}
