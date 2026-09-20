import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { sanitizeUsername } from "@/lib/sanitize";
import { renderProfileCard, resolveProfileCardOptions } from "@/lib/profile-card";

export const dynamic = "force-dynamic";
export const runtime = "edge";

async function avatarDataUri(url: string): Promise<string> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") || "image/png";
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return `data:${contentType};base64,${btoa(binary)}`;
  } catch { return ""; }
}

export async function GET(request: NextRequest) {
  const username = sanitizeUsername(request.nextUrl.searchParams.get("username") || "");
  if (!username) return new Response("Missing or invalid username", { status: 400 });
  try {
    const stats = await fetchGitHubStats(username);
    const options = resolveProfileCardOptions(request.nextUrl.searchParams);
    const svg = renderProfileCard({ ...stats, avatarDataUri: await avatarDataUri(stats.avatarUrl) }, options);
    const dataUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    const response = new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri} width={options.width} height={options.height} alt="" />
      </div>,
      { width: options.width, height: options.height },
    );
    if (request.nextUrl.searchParams.get("download") === "true") {
      response.headers.set("Content-Disposition", `attachment; filename="${username}-github-profile.png"`);
    }
    return response;
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unable to render profile card", { status: 500 });
  }
}
