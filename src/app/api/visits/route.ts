import { NextRequest } from "next/server";
import { trackProfileView, trackVisit } from "@/lib/tracking";
import { renderBadge } from "../badge/badge-svg";
import { sanitizeUsername } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

// These headers force every CDN layer — including Vercel's Edge Network and
// GitHub's camo image proxy — to re-fetch from origin on every request.
// Without them Vercel may serve a cached response and skip the Redis incr.
const NO_CACHE_HEADERS = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawUsername = params.get("username") ?? "";
  const username = sanitizeUsername(rawUsername);

  let count: number;
  let label: string;

  if (username) {
    // Per-profile view counter — the main use-case for README badges.
    // Embed as: ![Views](https://ghstats.dev/api/visits?username=YOUR_USERNAME)
    count = await trackProfileView(username);
    label = "profile views";
  } else {
    // Fallback: global visit counter (legacy / no username provided)
    count = await trackVisit();
    label = "visits";
  }

  const svg = renderBadge(label, count.toLocaleString("en-US"), "44cc11");

  return new Response(svg, { status: 200, headers: NO_CACHE_HEADERS });
}
