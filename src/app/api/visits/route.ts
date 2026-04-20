import { NextRequest } from "next/server";
import { trackView, trackVisit } from "@/lib/tracking";
import { renderBadge } from "../badge/badge-svg";
import { sanitizeUsername } from "@/lib/sanitize";
import { getCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

// These headers force every CDN layer — including Vercel's Edge Network and
// GitHub's camo image proxy — to re-fetch from origin on every request,
// so Redis.incr is always called and the count always increments.
const NO_CACHE_HEADERS = {
  "Content-Type": "image/svg+xml",
  ...getCacheHeaders("no-store"),
};

// Only allow safe repo name chars (alphanumeric, hyphens, underscores, dots)
function sanitizeRepo(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const clean = raw.trim();
  return /^[a-zA-Z0-9._-]{1,100}$/.test(clean) ? clean : undefined;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawUsername = params.get("username") ?? "";
  const username = sanitizeUsername(rawUsername);
  const repo = sanitizeRepo(params.get("repo"));

  let count: number;
  let label: string;

  if (username) {
    // Per-repo counter:  ?username=rowkav09&repo=GitHub-profile-stats
    // Per-profile counter: ?username=rowkav09
    count = await trackView(username, repo);
    label = repo ? "repo views" : "profile views";
  } else {
    // Legacy global counter (no username provided)
    count = await trackVisit();
    label = "visits";
  }

  const svg = renderBadge(label, count.toLocaleString("en-US"), "44cc11");
  return new Response(svg, { status: 200, headers: NO_CACHE_HEADERS });
}
