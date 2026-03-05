import { trackVisit } from "@/lib/tracking";
import { renderBadge } from "../badge/badge-svg";

export const dynamic = "force-dynamic";

export async function GET() {
  // Increment on every load — GitHub fetches this image each time someone
  // views the README, so the badge request itself counts as a repo visit.
  const count = await trackVisit();
  const svg = renderBadge("visits", count.toLocaleString("en-US"), "44cc11");

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      // Must not cache — every request must reach the server to increment
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
