import { GitHubStats, ThemeConfig, CardOptions, LanguageStat, LangChartOptions, ContributionDay } from "./types";
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
  short: string;
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
  order?: string[],
): StatItem[] {
  const year = new Date().getFullYear();
  const all: { key: string; label: string; short: string; value: string; icon: string; trend?: StatItem["trend"] }[] = [
    {
      key: "stars",
      label: "Total Stars Earned",
      short: "Stars",
      value: formatNumber(stats.totalStars),
      icon: "star",
    },
    {
      key: "commits",
      label: `Total Commits (${year})`,
      short: "Commits",
      value: formatNumber(stats.totalCommits),
      icon: "commit",
    },
    {
      key: "prs",
      label: "Pull Requests",
      short: "Pull Requests",
      value: formatNumber(stats.totalPRs),
      icon: "pr",
    },
    {
      key: "issues",
      label: "Issues Opened",
      short: "Issues",
      value: formatNumber(stats.totalIssues),
      icon: "issue",
    },
    {
      key: "streak",
      label: "Current Streak",
      short: "Streak",
      value: `${stats.currentStreak} days`,
      icon: "fire",
    },
    {
      key: "week",
      label: "Commits This Week",
      short: "This Week",
      value: formatNumber(stats.commitsThisWeek),
      icon: "calendar",
    },
    {
      key: "trend",
      label: "Weekly Trend",
      short: "Trend",
      value: `${formatNumber(stats.commitsThisWeek)} commits`,
      icon: "trend",
      trend: formatTrend(stats.weeklyTrend),
    },
    {
      key: "avg",
      label: "Avg Commits / Day",
      short: "Avg / Day",
      value: `${stats.avgCommitsPerDay}`,
      icon: "clock",
    },
    {
      key: "active_day",
      label: "Most Active Day",
      short: "Active Day",
      value: stats.mostActiveDay,
      icon: "day",
    },
    {
      key: "grade",
      label: "Activity Grade",
      short: "Grade",
      value: stats.grade,
      icon: "trophy",
    },
    {
      key: "contributions",
      label: "Contributions This Year",
      short: "Contributions",
      value: formatNumber(stats.contributionsThisYear),
      icon: "graph",
    },
    {
      key: "repos",
      label: "Public Repos",
      short: "Repos",
      value: formatNumber(stats.publicRepos),
      icon: "repo",
    },
    {
      key: "followers",
      label: "Followers",
      short: "Followers",
      value: formatNumber(stats.followers),
      icon: "people",
    },
  ];

  const filtered = all.filter((s) => !hide.includes(s.key));

  // Apply custom order if provided
  if (order && order.length > 0) {
    filtered.sort((a, b) => {
      const ai = order.indexOf(a.key);
      const bi = order.indexOf(b.key);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  return filtered.map(({ label, short, value, icon, trend }) => ({ label, short, value, icon, trend }));
}

function renderActivityRing(
  cx: number,
  cy: number,
  r: number,
  pct: number,
  grade: string,
  theme: ThemeConfig,
  strokeWidth = 5,
): string {
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = theme.title;
  const gradeOffY = strokeWidth <= 4 ? -4 : -6;
  const pctOffY = strokeWidth <= 4 ? 9 : 12;

  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${theme.border}" stroke-width="${strokeWidth}" opacity="0.3"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ringColor}" stroke-width="${strokeWidth}"
    stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
    transform="rotate(-90 ${cx} ${cy})" class="ring-progress"/>
  <text x="${cx}" y="${cy + gradeOffY}" text-anchor="middle" class="ring-grade">${escapeXml(grade)}</text>
  <text x="${cx}" y="${cy + pctOffY}" text-anchor="middle" class="ring-pct">${pct}%</text>`;
}

const EMOJIS: Record<string, string> = {
  star: "⭐", commit: "💻", pr: "🔀", issue: "🐛",
  fire: "🔥", calendar: "📅", trend: "📈", clock: "⏱",
  day: "📆", trophy: "🏆", graph: "📊", repo: "📁", people: "👥",
};

function renderCompactCard(
  stats: GitHubStats,
  theme: ThemeConfig,
  options: CardOptions,
): string {
  const count = options.compact_count;
  // 4 stats → 2 cols; 3 or 6 → 3 cols
  const COLS = count === 4 ? 2 : 3;
  const visible = getVisibleStats(stats, options.hide, options.order).slice(0, count);
  const useEmoji = options.show_emoji;

  const W = 495;
  const PAD_X = 20;
  const PAD_TOP = 14;
  const TITLE_FS = 13;
  const TITLE_H = options.hide_title ? 0 : TITLE_FS + 10;
  const COL_GAP = 1; // gap between cols (visual divider drawn manually)
  const ROW_GAP = 1; // gap between rows (divider line)
  const CELL_H = 62;
  const CELL_W = Math.floor((W - PAD_X * 2) / COLS);
  const PAD_BOT = 14;
  const numRows = Math.ceil(visible.length / COLS);
  const statsStartY = PAD_TOP + TITLE_H;
  const cardHeight = statsStartY + numRows * CELL_H + (numRows - 1) * ROW_GAP + PAD_BOT;
  const rx = options.border_radius;

  const title = options.custom_title
    ? escapeXml(options.custom_title)
    : `${escapeXml(stats.name || stats.username)}&apos;s GitHub Stats`;

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD_X}" y="${PAD_TOP + TITLE_FS}" class="c-title">${title}</text>`;

  // Horizontal dividers between rows
  const rowDividers = Array.from({ length: numRows - 1 }, (_, r) => {
    const y = statsStartY + (r + 1) * CELL_H + r * ROW_GAP;
    return `<line x1="${PAD_X}" y1="${y}" x2="${W - PAD_X}" y2="${y}" stroke="${theme.border}" stroke-width="1" opacity="0.3"/>`;
  }).join("\n");

  // Vertical dividers between columns
  const colDividers = Array.from({ length: COLS - 1 }, (_, c) => {
    const x = PAD_X + (c + 1) * CELL_W;
    return `<line x1="${x}" y1="${statsStartY + 8}" x2="${x}" y2="${cardHeight - PAD_BOT - 8}" stroke="${theme.border}" stroke-width="1" opacity="0.3"/>`;
  }).join("\n");

  const cellSvgs = visible
    .map((stat, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cellX = PAD_X + col * CELL_W;
      const cellCenterX = cellX + CELL_W / 2;
      const cellY = statsStartY + row * (CELL_H + ROW_GAP);
      const delay = i * 70;

      const iconY = cellY + 11;
      const valueY = cellY + 40;
      const labelY = cellY + 55;

      const iconEl = useEmoji
        ? `<text x="${cellCenterX}" y="${iconY + 12}" text-anchor="middle" class="c-emoji">${EMOJIS[stat.icon] ?? "•"}</text>`
        : `<svg x="${cellCenterX - 7}" y="${iconY}" width="14" height="14" viewBox="0 0 16 16" fill="${theme.icon}"><path d="${ICONS[stat.icon] ?? ""}"/></svg>`;

      return `<g class="c-cell" style="animation-delay:${delay}ms">
      ${iconEl}
      <text x="${cellCenterX}" y="${valueY}" text-anchor="middle" class="c-value">${escapeXml(stat.value)}</text>
      <text x="${cellCenterX}" y="${labelY}" text-anchor="middle" class="c-label">${escapeXml(stat.short)}</text>
    </g>`;
    })
    .join("\n");

  const border = options.hide_border
    ? ""
    : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${W}" height="${cardHeight}" viewBox="0 0 ${W} ${cardHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <style>
    .c-title { font: 600 ${TITLE_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; animation: cFadeIn .8s ease-in-out forwards; }
    .c-label { font: 400 10px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.45; letter-spacing: 0.3px; }
    .c-value { font: 700 17px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .c-emoji { font: normal 15px sans-serif; }
    .c-cell { opacity: 0; animation: cFadeIn .3s ease-in-out forwards; }
    @keyframes cFadeIn { from { opacity: 0 } to { opacity: 1 } }
    @media (prefers-reduced-motion: reduce) {
      .c-cell, .c-title { animation: none !important; opacity: 1; }
    }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${cardHeight - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
${rowDividers}
${colDividers}
${cellSvgs}
</svg>`;
}

export function renderCard(
  stats: GitHubStats,
  theme: ThemeConfig,
  options: CardOptions,
): string {
  if (options.size === "compact") {
    return renderCompactCard(stats, theme, options);
  }

  const visible = getVisibleStats(stats, options.hide, options.order);
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
  const ICON_SIZE = 16;
  const TEXT_ICON_PAD = 25;
  const TEXT_Y_OFF = 12.5;
  const CHAR_W = 7.5;
  const TITLE_FS = 18;
  const LABEL_FS = 14;
  const TREND_FS = 10;
  const RING_GRADE_FS = 20;
  const RING_PCT_FS = 11;
  const RING_STROKE = 5;

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
    : `<text x="${PAD_X}" y="${PAD_TOP + TITLE_FS}" class="title">${title}</text>`;

  const statAreaWidth = showRing ? CARD_WIDTH - PAD_X - RING_AREA - 10 : CARD_WIDTH - PAD_X;

  const rows = visible
    .map((stat, i) => {
      const y = statsStartY + i * ROW_H;
      const iconX = PAD_X;
      const textX = PAD_X + (showIcons ? TEXT_ICON_PAD : 0);
      const delay = i * 150;

      const iconSvg = showIcons
        ? `<svg x="${iconX}" y="${y}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 16 16" fill="${theme.icon}"><path d="${ICONS[stat.icon] ?? ""}"/></svg>`
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
        const labelWidth = stat.value.length * CHAR_W + (showIcons ? TEXT_ICON_PAD : 0);
        const arrowX = textX + labelWidth + 60;
        trendSvg = `<g transform="translate(${arrowX}, ${y + 2})">
          <path d="${arrowPath}" fill="${arrowColor}"/>
          <text x="12" y="9" fill="${arrowColor}" class="trend-text">${escapeXml(stat.trend.text)}</text>
        </g>`;
      }

      return `    <g class="row" style="animation-delay:${delay}ms">
      ${iconSvg}
      <text x="${textX}" y="${y + TEXT_Y_OFF}" class="label">${escapeXml(stat.label)}:</text>
      <text x="${statAreaWidth}" y="${y + TEXT_Y_OFF}" class="value" text-anchor="end">${escapeXml(stat.value)}</text>
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
    ? renderActivityRing(ringCx, ringCy, RING_R, stats.activityLevel, stats.grade, theme, RING_STROKE)
    : "";

  return `<svg width="${CARD_WIDTH}" height="${cardHeight}" viewBox="0 0 ${CARD_WIDTH} ${cardHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <style>
    .title { font: 600 ${TITLE_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; animation: fadeIn .8s ease-in-out forwards; }
    .label { font: 400 ${LABEL_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .value { font: 700 ${LABEL_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .trend-text { font: 700 ${TREND_FS}px 'Segoe UI', Ubuntu, Sans-Serif; }
    .ring-grade { font: 800 ${RING_GRADE_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .ring-pct { font: 600 ${RING_PCT_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.7; }
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

// ─── Language Chart ─────────────────────────────────────────────────────────

export function renderLanguageChart(
  languages: LanguageStat[],
  theme: ThemeConfig,
  options: LangChartOptions,
): string {
  const maxLangs = Math.min(options.max_langs, 12);
  const topLangs = languages.slice(0, maxLangs);

  if (topLangs.length === 0) {
    return renderErrorCard("No language data available for this user.", theme);
  }

  const totalSize = topLangs.reduce((s, l) => s + l.size, 0);

  if (options.layout === "stacked") {
    return renderStackedLanguageChart(topLangs, totalSize, theme, options);
  }

  const W = 495;
  const PAD = 25;
  const TITLE_H = options.hide_title ? 0 : 30;
  const BAR_TOP = TITLE_H + 12;
  const BAR_H = 10;
  const BAR_W = W - PAD * 2;
  const COLS = 3;
  const ROW_H = 20;
  const NAMES_TOP = BAR_TOP + BAR_H + 16;
  const numRows = Math.ceil(topLangs.length / COLS);
  const H = NAMES_TOP + numRows * ROW_H + 16;
  const rx = options.border_radius;

  // Stacked colour bar (clipped to rounded rect for pill shape)
  let bx = PAD;
  const barSegments = topLangs.map((lang) => {
    const w = Math.max(2, Math.round((lang.size / totalSize) * BAR_W));
    const el = `<rect x="${bx}" y="${BAR_TOP}" width="${w}" height="${BAR_H}" fill="${lang.color ?? "#586069"}"/>`;
    bx += w;
    return el;
  });

  const clipDef = `<clipPath id="lc-clip"><rect x="${PAD}" y="${BAR_TOP}" width="${BAR_W}" height="${BAR_H}" rx="${BAR_H / 2}"/></clipPath>`;

  // Language name + percentage labels in 3 columns
  const COL_W = Math.floor(BAR_W / COLS);
  const langLabels = topLangs.map((lang, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const lx = PAD + col * COL_W;
    const ly = NAMES_TOP + row * ROW_H;
    const pct = ((lang.size / totalSize) * 100).toFixed(1);
    const name = lang.name.length > 16 ? lang.name.slice(0, 15) + "…" : lang.name;
    return `<circle cx="${lx + 6}" cy="${ly + 5}" r="4" fill="${lang.color ?? "#586069"}"/>
  <text x="${lx + 14}" y="${ly + 9}" class="lc-name">${escapeXml(name)}</text>
  <text x="${lx + COL_W - 2}" y="${ly + 9}" class="lc-pct" text-anchor="end">${pct}%</text>`;
  });

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD}" y="${TITLE_H - 4}" class="lc-title">${escapeXml(options.custom_title ?? "Top Languages")}</text>`;

  const border = options.hide_border ? "" : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top Languages">
  <title>${escapeXml(options.custom_title ?? "Top Languages")}</title>
  <defs>${clipDef}</defs>
  <style>
    .lc-title { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.title}; }
    .lc-name  { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; }
    .lc-pct   { font: 600 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; opacity: 0.7; }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${H - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
  <g clip-path="url(#lc-clip)">${barSegments.join("")}</g>
  ${langLabels.join("\n  ")}
</svg>`;
}

function renderStackedLanguageChart(
  languages: LanguageStat[],
  totalSize: number,
  theme: ThemeConfig,
  options: LangChartOptions,
): string {
  const W = 495;
  const PAD = 22;
  const TITLE_H = options.hide_title ? 0 : 28;
  const BAR_H = 16;
  const BAR_Y = TITLE_H + 10;
  const BAR_W = W - PAD * 2;
  const COLS = 3;
  const ROW_H = 20;
  const COL_W = Math.floor(BAR_W / COLS);

  const NAMES_TOP = BAR_Y + BAR_H + 18;
  const numRows = Math.ceil(Math.min(languages.length, 12) / COLS);
  const H = NAMES_TOP + numRows * ROW_H + 16;
  const rx = options.border_radius;

  // Compute stacked segments with widths that fill the bar exactly
  let used = 0;
  const segments = languages.map((lang, idx) => {
    const pct = totalSize > 0 ? (lang.size / totalSize) * 100 : 0;
    let w = Math.max(3, Math.round((pct / 100) * BAR_W));
    if (idx === languages.length - 1) {
      w = Math.max(0, BAR_W - used); // fill remaining width to avoid gaps
    }
    used += w;
    return { lang, pct, w };
  });

  let bx = PAD;
  const barSegments = segments.map(({ lang, pct, w }) => {
    const rect = `<rect x="${bx}" y="${BAR_Y}" width="${w}" height="${BAR_H}" fill="${lang.color ?? "#586069"}"/>`;
    const label = w >= 36
      ? `<text x="${bx + w / 2}" y="${BAR_Y + BAR_H / 2 + 4}" text-anchor="middle" font="600 10px 'Segoe UI', Ubuntu, sans-serif" fill="#fff" opacity="0.9">${escapeXml(lang.name)}</text>`
      : "";
    bx += w;
    return rect + label;
  });

  const langLabels = languages.slice(0, 12).map((lang, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const lx = PAD + col * COL_W;
    const ly = NAMES_TOP + row * ROW_H;
    const pct = totalSize > 0 ? (lang.size / totalSize) * 100 : 0;
    const pctText = `${pct.toFixed(1)}%`;
    const name = lang.name.length > 16 ? `${lang.name.slice(0, 15)}…` : lang.name;
    return `<circle cx="${lx + 6}" cy="${ly + 5}" r="4" fill="${lang.color ?? "#586069"}"/>
  <text x="${lx + 14}" y="${ly + 9}" class="lc-name">${escapeXml(name)}</text>
  <text x="${lx + COL_W - 2}" y="${ly + 9}" class="lc-pct" text-anchor="end">${pctText}</text>`;
  });

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD}" y="${TITLE_H - 4}" class="lc-title">${escapeXml(options.custom_title ?? "Top Languages")}</text>`;

  const border = options.hide_border ? "" : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top Languages (stacked)">
  <title>${escapeXml(options.custom_title ?? "Top Languages")}</title>
  <style>
    .lc-title { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.title}; }
    .lc-name  { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; }
    .lc-pct   { font: 600 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; opacity: 0.7; }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${H - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
  <g>${barSegments.join("")}</g>
  ${langLabels.join("\n  ")}
</svg>`;
}

// ─── Sparkline (recent contributions) ──────────────────────────────────────

export interface SparklineOptions {
  days: number;
  width: number;
  height: number;
  hide_border: boolean;
  border_radius: number;
  line_color?: string;
  fill_color?: string;
  custom_title?: string;
}

export function renderSparkline(
  days: ContributionDay[],
  theme: ThemeConfig,
  options: SparklineOptions,
): string {
  const totalDays = Math.min(Math.max(options.days, 7), 90);
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-totalDays);

  if (recent.length === 0) {
    return renderErrorCard("No contribution data available.", theme);
  }

  const WIDTH = Math.max(180, Math.min(options.width, 800));
  const HEIGHT = Math.max(40, Math.min(options.height, 240));
  const PAD_X = 14;
  const TITLE_Y = 16;
  const PAD_TOP = 28; // give the title breathing room so it doesn't overlap the line
  const PAD_BOTTOM = 10;
  const contentW = WIDTH - PAD_X * 2;
  const contentH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const values = recent.map((d) => d.contributionCount);
  const maxVal = Math.max(...values, 1);
  const points = values.map((v, i) => {
    const x = recent.length === 1 ? WIDTH / 2 : PAD_X + (i / (recent.length - 1)) * contentW;
    const y = PAD_TOP + contentH - (v / maxVal) * contentH;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, v };
  });

  const lineColor = `#${options.line_color ?? theme.title.replace(/^#/, "")}`;
  const fillColor = `#${options.fill_color ?? theme.title.replace(/^#/, "")}`;
  const rx = options.border_radius;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const firstX = points[0]?.x ?? PAD_X;
  const lastPoint = points[points.length - 1];
  const areaPath = `M ${firstX} ${HEIGHT - PAD_BOTTOM} ${linePath.replace(/^M/, "L")} L ${lastPoint.x} ${HEIGHT - PAD_BOTTOM} Z`;

  const title = options.custom_title ?? `Last ${recent.length} days`; // fallback title
  const latestVal = values[values.length - 1];

  const border = options.hide_border ? "" : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Contributions sparkline (latest ${latestVal})">
  <title>${escapeXml(title)}</title>
  <style>
    .sl-title { font: 600 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.title}; }
    .sl-value { font: 600 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; opacity: 0.8; }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="${theme.bg}"${border}/>
  <path d="${areaPath}" fill="${fillColor}" opacity="0.12" />
  <path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="2.2" stroke-linecap="round" />
  <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="3.6" fill="${lineColor}" stroke="${theme.bg}" stroke-width="1" />
  <text x="${PAD_X}" y="${TITLE_Y}" class="sl-title">${escapeXml(title)}</text>
  <text x="${WIDTH - PAD_X}" y="${TITLE_Y}" class="sl-value" text-anchor="end">Today: ${latestVal}</text>
</svg>`;
}

// ─── Streak Card ─────────────────────────────────────────────────────────────

export interface StreakOptions {
  hide_border: boolean;
  hide_title: boolean;
  custom_title?: string;
  border_radius: number;
  show_ring: boolean;
}

export function renderStreakCard(
  stats: GitHubStats,
  theme: ThemeConfig,
  options: StreakOptions,
): string {
  const W = 495;
  const PAD_X = 25;
  const PAD_TOP = 20;
  const TITLE_FS = 16;
  const TITLE_H = options.hide_title ? 0 : TITLE_FS + 14;
  const BODY_TOP = PAD_TOP + TITLE_H;
  const RING_R = 48;
  const RING_AREA = options.show_ring ? RING_R * 2 + 20 : 0;
  const rx = options.border_radius;

  const mainAreaW = W - PAD_X * 2 - (options.show_ring ? RING_AREA + 10 : 0);
  const cardH = BODY_TOP + RING_R * 2 + 30;

  const ringCx = W - PAD_X - RING_R - 5;
  const ringCy = BODY_TOP + RING_R + 10;

  const displayName = escapeXml(stats.name || stats.username);
  const title = options.custom_title
    ? escapeXml(options.custom_title)
    : `${displayName}&apos;s Streak Stats`;

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD_X}" y="${PAD_TOP + TITLE_FS}" class="sk-title">${title}</text>`;

  const border = options.hide_border ? "" : ` stroke="${theme.border}" stroke-width="1"`;

  // Current streak — big center display
  const streakY = BODY_TOP + 18;
  const streakNumY = streakY + 38;
  const streakLabelY = streakNumY + 18;

  // Two stats below
  const statsY = streakLabelY + 28;
  const col2X = PAD_X + mainAreaW / 2;

  const ringSvg = options.show_ring
    ? renderActivityRing(ringCx, ringCy, RING_R, stats.activityLevel, stats.grade, theme, 6)
    : "";

  // New-user guard: show a helpful message if no contribution data exists
  if (stats.currentStreak === 0 && stats.longestStreak === 0 && stats.contributionsThisYear === 0) {
    return renderErrorCard("No contribution data found. Start committing to see your streak!", theme);
  }

  return `<svg width="${W}" height="${cardH}" viewBox="0 0 ${W} ${cardH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <style>
    .sk-title { font: 600 ${TITLE_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; animation: fadeIn .8s ease-in-out forwards; }
    .sk-big   { font: 800 36px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; animation: fadeIn .6s ease-in-out forwards; }
    .sk-unit  { font: 600 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.7; }
    .sk-label { font: 600 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.45; text-transform: uppercase; letter-spacing: 0.5px; }
    .sk-val   { font: 700 15px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .ring-grade { font: 800 22px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .ring-pct   { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.7; }
    .ring-progress { animation: ringFill 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes ringFill { from { stroke-dashoffset: ${2 * Math.PI * RING_R}; } }
    @media (prefers-reduced-motion: reduce) {
      .sk-title, .sk-big { animation: none !important; }
      .ring-progress { animation: none !important; }
    }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${cardH - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
  <svg x="${PAD_X}" y="${streakY}" width="20" height="20" viewBox="0 0 16 16" fill="${theme.title}"><path d="${ICONS.fire}"/></svg>
  <text x="${PAD_X + 24}" y="${streakY + 14}" class="sk-unit">Current Streak</text>
  <text x="${PAD_X}" y="${streakNumY}" class="sk-big">${stats.currentStreak}<tspan class="sk-unit"> days</tspan></text>
  <line x1="${PAD_X}" y1="${streakLabelY + 8}" x2="${W - PAD_X}" y2="${streakLabelY + 8}" stroke="${theme.border}" stroke-width="1" opacity="0.3"/>
  <text x="${PAD_X}" y="${statsY}" class="sk-label">Longest Streak</text>
  <text x="${PAD_X}" y="${statsY + 18}" class="sk-val">${stats.longestStreak} days</text>
  <text x="${col2X}" y="${statsY}" class="sk-label">This Year</text>
  <text x="${col2X}" y="${statsY + 18}" class="sk-val">${formatNumber(stats.contributionsThisYear)} contributions</text>
  ${ringSvg}
</svg>`;
}

// ─── Top Repos Card ──────────────────────────────────────────────────────────

export interface RepoCardOptions {
  hide_border: boolean;
  hide_title: boolean;
  custom_title?: string;
  border_radius: number;
  repo_count: number; // 1–6
}

export function renderRepoCard(
  stats: GitHubStats,
  theme: ThemeConfig,
  options: RepoCardOptions,
): string {
  const repos = stats.topRepos.slice(0, options.repo_count);

  if (repos.length === 0) {
    return renderErrorCard("No public repositories found for this user.", theme);
  }

  const W = 495;
  const PAD_X = 22;
  const PAD_TOP = 18;
  const TITLE_FS = 15;
  const TITLE_H = options.hide_title ? 0 : TITLE_FS + 12;
  const ROW_H = 58;
  const PAD_BOT = 14;
  const rx = options.border_radius;
  const cardH = PAD_TOP + TITLE_H + repos.length * ROW_H + PAD_BOT;

  const displayName = escapeXml(stats.name || stats.username);
  const title = options.custom_title
    ? escapeXml(options.custom_title)
    : `${displayName}&apos;s Top Repos`;

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD_X}" y="${PAD_TOP + TITLE_FS}" class="rp-title">${title}</text>`;

  const border = options.hide_border ? "" : ` stroke="${theme.border}" stroke-width="1"`;

  const repoRows = repos.map((repo, i) => {
    const rowY = PAD_TOP + TITLE_H + i * ROW_H;
    const nameY = rowY + 18;
    const descY = nameY + 15;
    const metaY = descY + 16;
    const divider = i < repos.length - 1
      ? `<line x1="${PAD_X}" y1="${rowY + ROW_H - 1}" x2="${W - PAD_X}" y2="${rowY + ROW_H - 1}" stroke="${theme.border}" stroke-width="1" opacity="0.25"/>`
      : "";

    const desc = repo.description
      ? repo.description.length > 52 ? repo.description.slice(0, 51) + "…" : repo.description
      : "";
    const repoName = repo.name.length > 30 ? repo.name.slice(0, 29) + "…" : repo.name;

    const langBadge = repo.primaryLanguage
      ? `<circle cx="${W - PAD_X - 110 + 5}" cy="${metaY - 4}" r="4" fill="${repo.primaryLanguage.color}"/>
         <text x="${W - PAD_X - 100}" y="${metaY}" class="rp-meta">${escapeXml(repo.primaryLanguage.name)}</text>`
      : "";

    return `<g style="animation:rp-fade .4s ${i * 80}ms ease-in-out both">
  <svg x="${PAD_X}" y="${nameY - 13}" width="14" height="14" viewBox="0 0 16 16" fill="${theme.icon}"><path d="${ICONS.repo}"/></svg>
  <text x="${PAD_X + 18}" y="${nameY}" class="rp-name">${escapeXml(repoName)}</text>
  ${desc ? `<text x="${PAD_X}" y="${descY}" class="rp-desc">${escapeXml(desc)}</text>` : ""}
  <svg x="${PAD_X}" y="${metaY - 11}" width="13" height="13" viewBox="0 0 16 16" fill="${theme.icon}"><path d="${ICONS.star}"/></svg>
  <text x="${PAD_X + 17}" y="${metaY}" class="rp-meta">${formatNumber(repo.stars)}</text>
  <svg x="${PAD_X + 60}" y="${metaY - 11}" width="13" height="13" viewBox="0 0 16 16" fill="${theme.icon}"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"/></svg>
  <text x="${PAD_X + 77}" y="${metaY}" class="rp-meta">${formatNumber(repo.forks)}</text>
  ${langBadge}
</g>
${divider}`;
  }).join("\n");

  return `<svg width="${W}" height="${cardH}" viewBox="0 0 ${W} ${cardH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title}</title>
  <style>
    .rp-title { font: 600 ${TITLE_FS}px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .rp-name  { font: 700 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .rp-desc  { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.65; }
    .rp-meta  { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.7; }
    @keyframes rp-fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
    @media (prefers-reduced-motion: reduce) { g[style*="rp-fade"] { animation: none !important; opacity: 1; } }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${cardH - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
${repoRows}
</svg>`;
}

// ─── Contribution Heatmap ────────────────────────────────────────────────────

export interface HeatmapOptions {
  hide_border: boolean;
  hide_title: boolean;
  custom_title?: string;
  border_radius: number;
  weeks: number; // 4–52 weeks to display (default 16)
  color_scheme: "default" | "halloween" | "winter" | "pink";
}

export function renderHeatmapCard(
  days: ContributionDay[],
  theme: ThemeConfig,
  options: HeatmapOptions,
): string {
  const numWeeks = Math.min(Math.max(options.weeks, 4), 52);
  const totalDays = numWeeks * 7;

  // Sort and take recent days
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-totalDays);

  if (recent.length === 0) {
    return renderErrorCard("No contribution data available.", theme);
  }

  // Color schemes: levels 0-4
  const COLOR_SCHEMES: Record<HeatmapOptions["color_scheme"], string[]> = {
    default:    ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    halloween:  ["#161b22", "#631c03", "#bd561d", "#fa7a18", "#fddf68"],
    winter:     ["#161b22", "#023e8a", "#0077b6", "#0096c7", "#90e0ef"],
    pink:       ["#161b22", "#5c0c3f", "#a61d4c", "#e05897", "#f9a8d4"],
  };
  const levelColors = COLOR_SCHEMES[options.color_scheme] ?? COLOR_SCHEMES.default;

  // For light theme use lighter versions
  const isLight = theme.bg.toLowerCase() === "#ffffff" || theme.bg.toLowerCase() === "#fff";
  const lightScheme = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const colors = isLight ? lightScheme : levelColors;

  const CELL = 11;
  const GAP = 2;
  const STEP = CELL + GAP;
  const PAD_X = 14;
  const MONTH_H = 14;
  const PAD_TOP = 14;
  const TITLE_FS = 13;
  const TITLE_H = options.hide_title ? 0 : TITLE_FS + 8;
  const DAY_LABEL_W = 0; // no day labels (keep it compact)

  const gridW = numWeeks * STEP - GAP;
  const W = PAD_X * 2 + DAY_LABEL_W + gridW;
  const gridStartX = PAD_X + DAY_LABEL_W;
  const gridStartY = PAD_TOP + TITLE_H + MONTH_H;
  const H = gridStartY + 7 * STEP - GAP + 12;
  const rx = options.border_radius;

  // Pad `recent` to start on a Sunday boundary so weeks align
  const firstDate = recent[0]?.date ?? "";
  const firstDow = firstDate ? new Date(firstDate + "T00:00:00").getDay() : 0;
  const cells: { count: number; date: string }[] = [];
  for (let p = 0; p < firstDow; p++) cells.push({ count: -1, date: "" }); // empty padding
  for (const d of recent) cells.push({ count: d.contributionCount, date: d.date });

  // Build weeks array
  const grid: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    grid.push(cells.slice(i, i + 7));
  }

  const maxCount = Math.max(...recent.map((d) => d.contributionCount), 1);

  function levelFor(count: number): number {
    if (count <= 0) return 0;
    if (count >= maxCount) return 4;
    return Math.ceil((count / maxCount) * 3);
  }

  // Month labels — detect when month changes across weeks
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabels: string[] = [];
  let lastMonth = -1;
  for (let wi = 0; wi < grid.length; wi++) {
    const firstDay = grid[wi]?.find((d) => d.date);
    if (firstDay?.date) {
      const m = new Date(firstDay.date + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        monthLabels.push(`<text x="${gridStartX + wi * STEP}" y="${gridStartY - 3}" class="hm-month">${monthNames[m]}</text>`);
        lastMonth = m;
      } else {
        monthLabels.push("");
      }
    } else {
      monthLabels.push("");
    }
  }

  // Render cells
  const cellSvgs: string[] = [];
  for (let wi = 0; wi < grid.length; wi++) {
    const week = grid[wi];
    for (let di = 0; di < week.length; di++) {
      const cell = week[di];
      if (!cell || cell.count < 0) continue;
      const cx = gridStartX + wi * STEP;
      const cy = gridStartY + di * STEP;
      const level = levelFor(cell.count);
      const fill = colors[level];
      const tip = cell.date ? `<title>${cell.date}: ${cell.count} contributions</title>` : "";
      cellSvgs.push(`<rect x="${cx}" y="${cy}" width="${CELL}" height="${CELL}" rx="2" fill="${fill}">${tip}</rect>`);
    }
  }

  const titleText = options.custom_title
    ? escapeXml(options.custom_title)
    : "Contribution Heatmap";
  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD_X}" y="${PAD_TOP + TITLE_FS}" class="hm-title">${titleText}</text>`;

  const border = options.hide_border ? "" : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${titleText}">
  <title>${titleText}</title>
  <style>
    .hm-title  { font: 600 ${TITLE_FS}px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.title}; }
    .hm-month  { font: 400 9px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; opacity: 0.55; }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${H - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
  ${monthLabels.join("\n  ")}
  ${cellSvgs.join("\n  ")}
</svg>`;
}
