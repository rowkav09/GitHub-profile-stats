import { ThemeConfig, LanguageStat, LangChartOptions } from "@/lib/types";
import { escapeXml } from "@/lib/sanitize";

export default function renderCompact(
  languages: LanguageStat[],
  totalSize: number,
  theme: ThemeConfig,
  options: LangChartOptions,
): string {
  const W = 300;
  const PAD = 22;
  const TITLE_H = options.hide_title ? 0 : 34;
  const COLS = 2;
  const ROW_H = 28;
  const DOT_R = 5;

  const numRows = Math.ceil(Math.min(languages.length, 12) / COLS);
  const legendH = numRows * ROW_H;

  const LEGEND_X = PAD;
  const LEGEND_W = W - PAD * 2;
  const COL_W = Math.floor(LEGEND_W / COLS);
  const legendTop = TITLE_H + 8;

  const H = legendTop + legendH + 16;
  const rx = options.border_radius;

  const legend = languages.slice(0, 12).map((lang, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const lx = LEGEND_X + col * COL_W;
    const ly = legendTop + row * ROW_H;
    const maxNameLen = 14;
    const name =
      lang.name.length > maxNameLen
        ? `${lang.name.slice(0, maxNameLen - 1)}…`
        : lang.name;
    return `<circle cx="${lx + DOT_R}" cy="${ly + 10}" r="${DOT_R}" fill="${lang.color ?? "#586069"}"/>
  <text x="${lx + DOT_R * 2 + 8}" y="${ly + 14}" class="lc-name">${escapeXml(name)}</text>`;
  });

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD}" y="${TITLE_H - 12}" class="lc-title">${escapeXml(options.custom_title ?? "Most Used Languages")}</text>`;

  const border = options.hide_border
    ? ""
    : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most Used Languages">
  <title>${escapeXml(options.custom_title ?? "Most Used Languages")}</title>
  <style>
    .lc-title { font: 600 15px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.title}; }
    .lc-name  { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${H - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
  ${legend.join("\n  ")}
</svg>`;
}
