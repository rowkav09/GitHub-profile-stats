import { GitHubStats, ThemeConfig, CardOptions } from "./types";
import { escapeXml, formatNumber } from "./sanitize";

// Octicon-style SVG paths (16x16 viewBox)
const ICONS: Record<string, string> = {
  star: "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z",
  commit:
    "M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32zM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  pr: "M7.177 3.073 9.573.677A.25.25 0 0 1 10 .854v4.792a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354zM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25zM11 2.5h-1V4h1a1 1 0 0 1 1 1v5.628a2.251 2.251 0 1 0 1.5 0V5A2.5 2.5 0 0 0 11 2.5zm1 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0zM3.75 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z",
  issue:
    "M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z",
  fire: "M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.943.114 1.5-.455 1.5-.638 0-1.18-.504-1.48-1.089a3.645 3.645 0 0 1-.346-1.323 3.9 3.9 0 0 0-.6.961c-.563.767-.895 1.636-.895 2.622 0 2.52 2.168 4.5 5 4.5z",
  calendar:
    "M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0zm0 3.5h-.75a.25.25 0 0 0-.25.25V6h8.5V3.75a.25.25 0 0 0-.25-.25h-.75v.75a.75.75 0 0 1-1.5 0V3.5h-5v.75a.75.75 0 0 1-1.5 0zm-1.5 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5z",
  repo: "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8zm-8 11h8v1.5h-8a1 1 0 0 1 0-2z",
  people:
    "M5.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.49 3.49 0 0 1 2 5.5zM11 4a.75.75 0 1 0 0 1.5 1.5 1.5 0 0 1 .666 2.844.75.75 0 0 0-.416.672v.352a.75.75 0 0 0 .574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 1 0 1.434-.44 5.01 5.01 0 0 0-2.56-3.012A3 3 0 0 0 11 4z",
  graph:
    "M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042z",
  trend:
    "M.75 8a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 .75 8zm4-4a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-1.5 0v-9.5A.75.75 0 0 1 4.75 4zM8.75 0a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-1.5 0V.75a.75.75 0 0 1 .75-.75zm4 2a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.75a.75.75 0 0 1 .75-.75z",
  clock:
    "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.5 4.75v3.44l2.78 1.61a.75.75 0 1 1-.75 1.3l-3.16-1.83A.75.75 0 0 1 7 8.69V4.75a.75.75 0 0 1 1.5 0z",
  trophy:
    "M4.25 1a.25.25 0 0 0-.25.25v1h-1A1.75 1.75 0 0 0 1.25 4v1c0 .966.784 1.75 1.75 1.75h.25v.457a4.002 4.002 0 0 0 2.5 3.693V12h-1a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-1v-1.1a4.002 4.002 0 0 0 2.5-3.693V6.75h.25c.966 0 1.75-.784 1.75-1.75V4c0-.966-.784-1.75-1.75-1.75h-1v-1A.25.25 0 0 0 11.75 1zM3 4.25h1v2.5H3.25a.25.25 0 0 1-.25-.25V4.25zm10 0v2.25a.25.25 0 0 1-.25.25H12v-2.5z",
  day:
    "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0zm9.78-2.22-4.03 4.03-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l4.56-4.56a.75.75 0 0 0-1.06-1.06z",
};

interface StatItem {
  label: string;
  value: string;
  icon: string;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
}

function formatTrend(pct: number): { direction: "up" | "down" | "neutral"; text: string } {
  if (pct > 0) return { direction: "up", text: `+${pct}%` };
  if (pct < 0) return { direction: "down", text: `${pct}%` };
  return { direction: "neutral", text: "0%" };
}

function getVisibleStats(
  stats: GitHubStats,
  hide: string[],
): StatItem[] {
  const year = new Date().getFullYear();
  const all: { key: string; label: string; value: string; icon: string; trend?: StatItem["trend"] }[] = [
    {
      key: "stars",
      label: "Total Stars Earned",
      value: formatNumber(stats.totalStars),
      icon: "star",
    },
    {
      key: "commits",
      label: `Total Commits (${year})`,
      value: formatNumber(stats.totalCommits),
      icon: "commit",
    },
    {
      key: "prs",
      label: "Pull Requests",
      value: formatNumber(stats.totalPRs),
      icon: "pr",
    },
    {
      key: "issues",
      label: "Issues Opened",
      value: formatNumber(stats.totalIssues),
      icon: "issue",
    },
    {
      key: "streak",
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: "fire",
    },
    {
      key: "week",
      label: "Commits This Week",
      value: formatNumber(stats.commitsThisWeek),
      icon: "calendar",
    },
    {
      key: "trend",
      label: "Monthly Trend",
      value: `${formatNumber(stats.commitsThisMonth)} commits`,
      icon: "trend",
      trend: formatTrend(stats.monthlyTrend),
    },
    {
      key: "avg",
      label: "Avg Commits / Day",
      value: `${stats.avgCommitsPerDay}`,
      icon: "clock",
    },
    {
      key: "active_day",
      label: "Most Active Day",
      value: stats.mostActiveDay,
      icon: "day",
    },
    {
      key: "grade",
      label: "Activity Grade",
      value: stats.grade,
      icon: "trophy",
    },
    {
      key: "contributions",
      label: "Contributions This Year",
      value: formatNumber(stats.contributionsThisYear),
      icon: "graph",
    },
    {
      key: "repos",
      label: "Public Repos",
      value: formatNumber(stats.publicRepos),
      icon: "repo",
    },
    {
      key: "followers",
      label: "Followers",
      value: formatNumber(stats.followers),
      icon: "people",
    },
  ];

  return all
    .filter((s) => !hide.includes(s.key))
    .map(({ label, value, icon, trend }) => ({ label, value, icon, trend }));
}

function renderActivityRing(
  cx: number,
  cy: number,
  r: number,
  pct: number,
  grade: string,
  theme: ThemeConfig,
): string {
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = theme.title;

  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${theme.border}" stroke-width="5" opacity="0.3"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ringColor}" stroke-width="5"
    stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
    transform="rotate(-90 ${cx} ${cy})" class="ring-progress"/>
  <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="ring-grade">${escapeXml(grade)}</text>
  <text x="${cx}" y="${cy + 12}" text-anchor="middle" class="ring-pct">${pct}%</text>`;
}

export function renderCard(
  stats: GitHubStats,
  theme: ThemeConfig,
  options: CardOptions,
): string {
  const visible = getVisibleStats(stats, options.hide);
  const showIcons = options.show_icons;
  const showRing = options.show_ring;

  const CARD_WIDTH = 495;
  const PAD_X = 25;
  const PAD_TOP = 25;
  const TITLE_H = options.hide_title ? 0 : 30;
  const GAP = 5;
  const ROW_H = 25;
  const PAD_BOT = 20;
  const RING_R = 40;
  const RING_AREA = showRing ? RING_R * 2 + 30 : 0;

  const statsStartY = PAD_TOP + TITLE_H + GAP;
  const statsHeight = visible.length * ROW_H;
  const minHeight = showRing ? RING_AREA + PAD_TOP + TITLE_H + GAP + PAD_BOT : 0;
  const cardHeight = Math.max(statsStartY + statsHeight + PAD_BOT, minHeight);
  const rx = options.border_radius;

  const title = options.custom_title
    ? escapeXml(options.custom_title)
    : `${escapeXml(stats.name || stats.username)}&apos;s GitHub Stats`;

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD_X}" y="${PAD_TOP + 18}" class="title">${title}</text>`;

  const statAreaWidth = showRing ? CARD_WIDTH - PAD_X - RING_AREA - 10 : CARD_WIDTH - PAD_X;

  const rows = visible
    .map((stat, i) => {
      const y = statsStartY + i * ROW_H;
      const iconX = PAD_X;
      const textX = PAD_X + (showIcons ? 25 : 0);
      const delay = i * 150;

      const iconSvg = showIcons
        ? `<svg x="${iconX}" y="${y}" width="16" height="16" viewBox="0 0 16 16" fill="${theme.icon}"><path d="${ICONS[stat.icon] ?? ""}"/></svg>`
        : "";

      // Trend arrow for monthly trend stat
      let trendSvg = "";
      if (stat.trend) {
        const arrowColor =
          stat.trend.direction === "up" ? "#3fb950" : stat.trend.direction === "down" ? "#f85149" : theme.text;
        const arrowPath =
          stat.trend.direction === "up"
            ? "M 0 6 L 4 0 L 8 6 L 5 6 L 5 10 L 3 10 L 3 6 Z"
            : stat.trend.direction === "down"
              ? "M 0 4 L 4 10 L 8 4 L 5 4 L 5 0 L 3 0 L 3 4 Z"
              : "M 0 4 L 8 4 L 8 6 L 0 6 Z";
        const labelWidth = stat.value.length * 7.5 + (showIcons ? 25 : 0);
        const arrowX = textX + labelWidth + 60;
        trendSvg = `<g transform="translate(${arrowX}, ${y + 2})">
          <path d="${arrowPath}" fill="${arrowColor}"/>
          <text x="12" y="9" fill="${arrowColor}" class="trend-text">${escapeXml(stat.trend.text)}</text>
        </g>`;
      }

      return `    <g class="row" style="animation-delay:${delay}ms">
      ${iconSvg}
      <text x="${textX}" y="${y + 12.5}" class="label">${escapeXml(stat.label)}:</text>
      <text x="${statAreaWidth}" y="${y + 12.5}" class="value" text-anchor="end">${escapeXml(stat.value)}</text>
      ${trendSvg}
    </g>`;
    })
    .join("\n");

  const border = options.hide_border
    ? ""
    : ` stroke="${theme.border}" stroke-width="1"`;

  const ringCx = CARD_WIDTH - PAD_X - RING_R - 5;
  const ringCy = statsStartY + (statsHeight / 2);
  const ringSvg = showRing
    ? renderActivityRing(ringCx, ringCy, RING_R, stats.activityLevel, stats.grade, theme)
    : "";

  return `<svg width="${CARD_WIDTH}" height="${cardHeight}" viewBox="0 0 ${CARD_WIDTH} ${cardHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <style>
    .title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; animation: fadeIn .8s ease-in-out forwards; }
    .label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .value { font: 700 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .trend-text { font: 700 10px 'Segoe UI', Ubuntu, Sans-Serif; }
    .ring-grade { font: 800 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .ring-pct { font: 600 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.7; }
    .row   { opacity: 0; animation: fadeIn .3s ease-in-out forwards; }
    .ring-progress { animation: ringFill 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes ringFill {
      from { stroke-dashoffset: ${2 * Math.PI * RING_R}; }
    }
    @media (prefers-reduced-motion: reduce) {
      .row, .title { animation: none !important; opacity: 1; }
      .ring-progress { animation: none !important; }
    }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${CARD_WIDTH - 1}" height="${cardHeight - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
${rows}
  ${ringSvg}
</svg>`;
}

export function renderErrorCard(message: string, theme: ThemeConfig): string {
  const safe = escapeXml(message);
  return `<svg width="495" height="120" viewBox="0 0 495 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Error">
  <title>Error</title>
  <style>
    .err-title { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #f85149; }
    .err-msg   { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
  </style>
  <rect x="0.5" y="0.5" rx="4.5" ry="4.5" width="494" height="119" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <text x="25" y="45" class="err-title">Something went wrong</text>
  <text x="25" y="75" class="err-msg">${safe}</text>
</svg>`;
}
