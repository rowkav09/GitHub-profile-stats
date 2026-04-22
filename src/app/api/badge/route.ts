import { getUserCount } from "@/lib/tracking";
import { renderBadge } from "./badge-svg";
import { getCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getUserCount();
  const svg = renderBadge("users", count.toLocaleString("en-US"));

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      ...getCacheHeaders("slow"),
    },
  });
}
