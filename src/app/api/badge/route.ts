import { getUserCount } from "@/lib/tracking";
import { renderBadge } from "./badge-svg";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getUserCount();
  const svg = renderBadge("users", count.toLocaleString("en-US"));

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control":
        "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
