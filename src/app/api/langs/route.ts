import { NextRequest } from "next/server";
import { fetchLanguageStats } from "@/lib/github";
import { renderLanguageChart, renderErrorCard } from "@/lib/svg";
import { resolveTheme } from "@/lib/themes";
import { sanitizeUsername, sanitizeHexParam } from "@/lib/sanitize";
import { LangChartOptions } from "@/lib/types";

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

  const maxLangs = Math.min(
    Math.max(parseInt(params.get("max_langs") ?? "8") || 8, 1),
    12,
  );

  const options: LangChartOptions = {
    hide_border: params.get("hide_border") === "true",
    hide_title: params.get("hide_title") === "true",
    custom_title: params.get("custom_title") ?? undefined,
    border_radius: Math.min(
      Math.max(parseFloat(params.get("border_radius") ?? "4.5") || 4.5, 0),
      50,
    ),
    max_langs: maxLangs,
    layout:
      params.get("layout") === "stacked"
        ? "stacked"
        : params.get("layout") === "donut"
          ? "donut"
          : "bar",
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
    const languages = await fetchLanguageStats(username);
    return new Response(renderLanguageChart(languages, theme, options), {
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
