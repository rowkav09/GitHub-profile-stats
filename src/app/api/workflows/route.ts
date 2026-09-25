import { NextRequest } from "next/server";
import { sanitizeUsername, sanitizeHexParam, formatNumber } from "@/lib/sanitize";
import { parseExtraOwners } from "@/lib/github";
import { getWorkflowRuns } from "@/lib/workflow-runs";
import { renderBadge, resolveBadgeStyle } from "@/lib/svg/badge";
import { resolveTheme } from "@/lib/themes/themes";
import { renderErrorCard } from "@/lib/svg";
import { getCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const username = sanitizeUsername(params.get("username") ?? "");
  const theme = resolveTheme(params.get("theme") ?? "default", {});
  const headers = { "Content-Type": "image/svg+xml", ...getCacheHeaders("daily") };
  if (!username) return new Response(renderErrorCard("Missing or invalid username", theme), { status: 400, headers });
  try {
    const owners = [username, ...parseExtraOwners(params.get("orgs"), username)];
    const { count } = await getWorkflowRuns(owners);
    const label = params.get("label")?.trim().slice(0, 32) || "Workflow runs";
    const accent = sanitizeHexParam(params.get("color")) ?? "4c8eda";
    const svg = renderBadge(label, formatNumber(count), { accent, labelBg: "30363d", text: "ffffff" }, resolveBadgeStyle(params.get("style")));
    return new Response(svg, { status: 200, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load workflow runs";
    return new Response(renderErrorCard(message, theme), { status: 503, headers: { "Content-Type": "image/svg+xml", ...getCacheHeaders("no-store") } });
  }
}
