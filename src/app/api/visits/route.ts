import { getVisitCount } from "@/lib/tracking";
import { renderBadge } from "../badge/badge-svg";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getVisitCount();
  const svg = renderBadge("visits", count.toLocaleString("en-US"), "44cc11");

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control":
        "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
