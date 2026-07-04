import { getUserCount } from "@/lib/tracking";
import { renderBadge, resolveBadgeStyle } from "./badge-svg";
import { getCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const style = resolveBadgeStyle(url.searchParams.get("style"));
  const count = await getUserCount();
  const svg = renderBadge("users", count.toLocaleString("en-US"), "4c8eda", style);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      ...getCacheHeaders("slow"),
    },
  });
}
