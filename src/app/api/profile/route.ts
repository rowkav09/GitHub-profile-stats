import { NextRequest } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { sanitizeUsername } from "@/lib/sanitize";
import { renderProfileCard, resolveProfileCardOptions } from "@/lib/profile-card";
import { getCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

async function avatarDataUri(url: string): Promise<string> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") || "image/png";
    const data = Buffer.from(await response.arrayBuffer()).toString("base64");
    return `data:${contentType};base64,${data}`;
  } catch { return ""; }
}

export async function GET(request: NextRequest) {
  const username = sanitizeUsername(request.nextUrl.searchParams.get("username") || "");
  if (!username) return new Response("Missing or invalid username", { status: 400 });
  try {
    const stats = await fetchGitHubStats(username);
    const svg = renderProfileCard({ ...stats, avatarDataUri: await avatarDataUri(stats.avatarUrl) }, resolveProfileCardOptions(request.nextUrl.searchParams));
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml", ...getCacheHeaders("default") } });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unable to render profile card", { status: 500 });
  }
}
