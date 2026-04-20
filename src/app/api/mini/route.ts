import { NextRequest } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { renderBadge } from "../badge/badge-svg";
import { renderErrorCard } from "@/lib/svg";
import { resolveTheme } from "@/lib/themes";
import { sanitizeUsername, sanitizeHexParam, formatNumber } from "@/lib/sanitize";
import { GitHubStats } from "@/lib/types";
import { getCacheHeaders, getMiniMetricCacheProfile } from "@/lib/cache";

export const dynamic = "force-dynamic";

type MetricDef = {
  label: string;
  color: string;
  get: (stats: GitHubStats) => number | string;
};

const METRICS: Record<string, MetricDef> = {
  stars: { label: "Stars", color: "f59e0b", get: (s) => s.totalStars },
  commits: { label: "Commits", color: "4c8eda", get: (s) => s.totalCommits },
  prs: { label: "PRs", color: "8b5cf6", get: (s) => s.totalPRs },
  issues: { label: "Issues", color: "ef4444", get: (s) => s.totalIssues },
  streak: { label: "Streak", color: "f97316", get: (s) => `${s.currentStreak}d` },
  week: { label: "This Week", color: "10b981", get: (s) => s.commitsThisWeek },
  followers: { label: "Followers", color: "22c55e", get: (s) => s.followers },
  repos: { label: "Repos", color: "0ea5e9", get: (s) => s.publicRepos },
  contributions: { label: "YTD", color: "06b6d4", get: (s) => s.contributionsThisYear },
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawUsername = params.get("username") ?? "";
  const username = sanitizeUsername(rawUsername);

  const metricKey = (params.get("metric") ?? "stars").toLowerCase();
  const metric = METRICS[metricKey] ?? METRICS.stars;

  const themeName = params.get("theme") ?? "default";
  const theme = resolveTheme(themeName, {
    bg: sanitizeHexParam(params.get("bg")),
    text: sanitizeHexParam(params.get("text")),
    title_color: sanitizeHexParam(params.get("title_color")),
    icon_color: sanitizeHexParam(params.get("icon_color")),
    border_color: sanitizeHexParam(params.get("border_color")),
  });

  const color = sanitizeHexParam(params.get("color")) ?? theme.title.replace(/^#/, "") ?? metric.color;
  const customLabel = params.get("label")?.trim();
  const label = customLabel && customLabel.length > 0 ? customLabel.slice(0, 32) : metric.label;

  const headers = {
    "Content-Type": "image/svg+xml",
    ...getCacheHeaders(getMiniMetricCacheProfile(metricKey)),
  } as const;

  if (!username) {
    return new Response(
      renderErrorCard('Missing or invalid "username" parameter.', theme),
      { status: 400, headers },
    );
  }

  try {
    const stats = await fetchGitHubStats(username);
    const raw = metric.get(stats);
    const value = typeof raw === "number" ? formatNumber(raw) : raw;

    const labelBg = theme.border?.replace(/^#/, "") ?? "555";
    const text = theme.text?.replace(/^#/, "") ?? "fff";

    return new Response(renderBadge(label, value, { accent: color, labelBg, text }), {
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
