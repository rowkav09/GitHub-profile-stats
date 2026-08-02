import { collectStatusReport } from "@/lib/status";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = await collectStatusReport();

  return Response.json(report, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
