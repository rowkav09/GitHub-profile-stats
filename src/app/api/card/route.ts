import { NextRequest } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { renderCard, renderErrorCard } from "@/lib/svg";
import { resolveTheme } from "@/lib/themes";
import { sanitizeUsername, sanitizeHexParam } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawUsername = params.get("username") ?? "";
  const username = sanitizeUsername(rawUsername);

  const themeName = params.get("theme") ?? "default";

  const theme = resolveTheme(themeName, {
    bg: sanitizeHexParam(params.get("bg")),
    text: sanitizeHexParam(params.get("text")),
    title_color: sanitizeHexParam(params.get("title_color")),
    icon_color: sanitizeHexParam(params.get("icon_color")),
    border_color: sanitizeHexParam(params.get("border_color")),
  });

  const options = {
    theme: themeName,
    hide_border: params.get("hide_border") === "true",
    hide_title: params.get("hide_title") === "true",
    hide: (params.get("hide") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    show_icons: params.get("show_icons") !== "false",
    show_ring: params.get("show_ring") !== "false",
    border_radius: Math.min(
      Math.max(parseFloat(params.get("border_radius") ?? "4.5") || 4.5, 0),
      50,
    ),
    custom_title: params.get("custom_title") ?? undefined,
    size: (params.get("size") === "compact" ? "compact" : "default") as "default" | "compact",
    compact_count: ([3, 4, 6].includes(parseInt(params.get("compact_count") ?? "")) ? parseInt(params.get("compact_count")!) : 6) as 3 | 4 | 6,
    show_emoji: params.get("show_emoji") === "true",
  };

  const headers = {
    "Content-Type": "image/svg+xml",
    "Cache-Control":
      "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
  };

  if (!username) {
    return new Response(
      renderErrorCard('Missing or invalid "username" parameter.', theme),
      { status: 400, headers },
    );
  }

  try {
    const stats = await fetchGitHubStats(username);
    return new Response(renderCard(stats, theme, options), {
      status: 200,
      headers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return new Response(renderErrorCard(message, theme), {
      status: 500,
      headers,
    });
  }
}
