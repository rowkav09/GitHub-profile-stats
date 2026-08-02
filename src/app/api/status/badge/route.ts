import { renderBadge, resolveBadgeStyle } from "@/lib/svg/badge";
import { getCacheHeaders } from "@/lib/cache";
import { SITE, SITE_ROUTES } from "@/lib/site";
import {
  getStatusCopy,
  formatPercentage,
  type StatusReport,
  type StatusLevel,
} from "@/lib/status";

export const dynamic = "force-dynamic";

function toneForStatus(status: StatusLevel): string {
  switch (status) {
    case "operational":
      return "3fb950";
    case "degraded":
      return "d29922";
    case "down":
      return "f85149";
  }
}

async function fetchStatusReport(request: Request): Promise<StatusReport> {
  const statusUrl = new URL(SITE_ROUTES.apiStatus, request.url);
  const response = await fetch(statusUrl, {
    cache: "no-store",
    headers: {
      "x-status-badge": "1",
    },
  });

  if (!response.ok) {
    throw new Error(`Status API returned ${response.status}`);
  }

  return (await response.json()) as StatusReport;
}

function getWindowValue(report: StatusReport, period: string): string {
  if (period === "7d") {
    return report.overall.uptime7d !== null
      ? formatPercentage(report.overall.uptime7d)
      : getStatusCopy(report.overall.status).label.toLowerCase();
  }

  return report.overall.uptime24h !== null
    ? formatPercentage(report.overall.uptime24h)
    : getStatusCopy(report.overall.status).label.toLowerCase();
}

function getWindowLabel(period: string): string {
  return period === "7d" ? "7d uptime" : "24h uptime";
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const style = resolveBadgeStyle(params.get("style"));
  const period = params.get("period") === "7d" ? "7d" : "24h";

  try {
    const report = await fetchStatusReport(request);
    const copy = getStatusCopy(report.overall.status);
    const uptimeValue = getWindowValue(report, period);
    const accent = toneForStatus(report.overall.status);

    const svg = renderBadge(
      getWindowLabel(period),
      uptimeValue,
      { accent, labelBg: "555", text: "fff" },
      style,
    );

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        "CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const fallback = renderBadge(
      getWindowLabel(period),
      "unknown",
      { accent: "8b949e", labelBg: "555", text: "fff" },
      style,
    );

    return new Response(fallback, {
      status: 503,
      headers: {
        "Content-Type": "image/svg+xml",
        ...getCacheHeaders("no-store"),
      },
    });
  }
}