import { NextRequest } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { renderHeatmapCard, renderErrorCard } from "@/lib/svg";
import { resolveTheme } from "@/lib/themes";
import { sanitizeUsername, sanitizeHexParam } from "@/lib/sanitize";
import { HeatmapOptions } from "@/lib/svg";

export const dynamic = "force-dynamic";

const VALID_COLOR_SCHEMES: HeatmapOptions["color_scheme"][] = [
  "default",
  "halloween",
  "winter",
  "pink",
];

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

  const rawWeeks = parseInt(params.get("weeks") ?? "16", 10);
  const weeks = Math.min(Math.max(isNaN(rawWeeks) ? 16 : rawWeeks, 4), 52);

  const rawScheme = params.get("color_scheme") ?? "default";
  const color_scheme: HeatmapOptions["color_scheme"] = VALID_COLOR_SCHEMES.includes(
    rawScheme as HeatmapOptions["color_scheme"],
  )
    ? (rawScheme as HeatmapOptions["color_scheme"])
    : "default";

  const options: HeatmapOptions = {
    hide_border: params.get("hide_border") === "true",
    hide_title: params.get("hide_title") === "true",
    custom_title: params.get("custom_title") ?? undefined,
    border_radius: Math.min(
      Math.max(parseFloat(params.get("border_radius") ?? "4.5") || 4.5, 0),
      50,
    ),
    weeks,
    color_scheme,
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
    return new Response(
      renderHeatmapCard(stats.contributionDays, theme, options),
      { status: 200, headers },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return new Response(renderErrorCard(message, theme), {
      status: 500,
      headers,
    });
  }
}
