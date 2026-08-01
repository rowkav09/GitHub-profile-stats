import { LanguageStat, LangChartOptions } from "@/lib/types";
import { ThemeConfig } from "@/lib/themes/types";
import { escapeXml } from "@/lib/sanitize";
import { formatLangPct } from "../../text-metrics";
import renderLanguageCard from "../base";

export default function renderGridLanguageChart(
  languages: LanguageStat[],
  totalSize: number,
  theme: ThemeConfig,
  options: LangChartOptions,
): string {
  const filteredLangs = languages.filter((l) => l.size > 0.0);
  const filteredTotal = filteredLangs.reduce(
    (sum: number, l: LanguageStat) => sum + l.size,
    0,
  );

  const W = 495;
  const PAD = 25;
  const TITLE_H = options.hide_title ? 0 : 28;
  const BAR_H = 10;
  const BAR_Y = TITLE_H + 12;
  const BAR_W = W - PAD * 2;
  const GAP = 12;
  const rx = options.border_radius;

  const numLangs = filteredLangs.length;
  const COLS = numLangs <= 1 ? 1 : numLangs <= 4 ? 2 : 4;
  const CARD_W = Math.floor((BAR_W - (COLS - 1) * GAP) / COLS);
  const CARD_H = numLangs === 1 ? 80 : 72;
  const GRID_TOP = BAR_Y + BAR_H + 16;
  const numRows = Math.ceil(numLangs / COLS);
  const H = GRID_TOP + numRows * (CARD_H + GAP) - GAP + 16;

  let bx = PAD;
  const barSegments = filteredLangs.map((lang) => {
    const w = Math.max(2, Math.round((lang.size / filteredTotal) * BAR_W));
    const el = `<rect x="${bx}" y="${BAR_Y}" width="${w}" height="${BAR_H}" fill="${lang.color ?? "#586069"}"/>`;
    bx += w;
    return el;
  });

  const barClip = `<clipPath id="gl-clip"><rect x="${PAD}" y="${BAR_Y}" width="${BAR_W}" height="${BAR_H}" rx="${BAR_H / 2}"/></clipPath>`;
  const cardClips = filteredLangs
    .map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = PAD + col * (CARD_W + GAP);
      const cy = GRID_TOP + row * (CARD_H + GAP);
      return `<clipPath id="gl-card-${i}"><rect x="${cx}" y="${cy}" width="${CARD_W}" height="${CARD_H}" rx="${rx}"/></clipPath>`;
    })
    .join("\n    ");
  const clipDef = `${barClip}\n    ${cardClips}`;

  const langCards = filteredLangs.map((lang, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = PAD + col * (CARD_W + GAP);
    const cy = GRID_TOP + row * (CARD_H + GAP);
    const pct = formatLangPct(lang.size, filteredTotal);
    const cardContent = renderLanguageCard(
      cx,
      cy,
      CARD_W,
      CARD_H,
      lang,
      pct,
      rx,
      theme,
      numLangs === 1,
    );
    return `<g clip-path="url(#gl-card-${i})">${cardContent}</g>`;
  });

  const titleSvg = options.hide_title
    ? ""
    : `<text x="${PAD}" y="${TITLE_H - 4}" class="gl-title">${escapeXml(options.custom_title ?? "Top Languages")}</text>`;

  const border = options.hide_border
    ? ""
    : ` stroke="${theme.border}" stroke-width="1"`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top Languages (grid)">
  <title>${escapeXml(options.custom_title ?? "Top Languages")}</title>
  <defs>${clipDef}</defs>
  <style>
    .gl-title { font: 600 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.title}; }
    .gl-name  { font: 400 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${theme.text}; }
    .gl-pct   { font: 600 20px 'Segoe UI', Ubuntu, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" rx="${rx}" ry="${rx}" width="${W - 1}" height="${H - 1}" fill="${theme.bg}"${border}/>
  ${titleSvg}
  <g clip-path="url(#gl-clip)">${barSegments.join("")}</g>
  ${langCards.join("\n")}
</svg>`;
}
