import { ThemeConfig } from "@/lib/types";
import { escapeXml } from "@/lib/sanitize";
import { truncateToWidth } from "../text-metrics";
import { renderBaseCard } from "../svg-primitives";

export default function renderLanguageCard(
  x: number,
  y: number,
  w: number,
  h: number,
  lang: { name: string; color: string },
  pct: string,
  rx: number,
  theme: ThemeConfig,
  isHero: boolean,
): string {
  const CIRCLE_R = isHero ? 6 : 5;
  const NAME_FONT = isHero ? 15 : 13;
  const PCT_FONT = isHero ? 24 : 20;

  const PAD_TOP = 16;
  const NAME_AREA = 24;
  const PAD_BOTTOM = 16;

  const headerY = y + PAD_TOP + CIRCLE_R;
  const CIRCLE_SPACE = 14 + CIRCLE_R + 6;
  const TEXT_AREA = w - CIRCLE_SPACE - 8;
  const nameText = truncateToWidth(lang.name, TEXT_AREA, NAME_FONT);

  const pctContentTop = y + PAD_TOP + NAME_AREA;
  const pctContentH = h - PAD_TOP - NAME_AREA - PAD_BOTTOM;
  const pctY = pctContentTop + pctContentH / 2 + PCT_FONT * 0.35;

  return [
    renderBaseCard(x, y, w, h, rx, theme, theme.text, 0.15),
    `<circle cx="${x + 14}" cy="${headerY}" r="${CIRCLE_R}" fill="${lang.color ?? "#586069"}"/>`,
    `<text x="${x + 14 + CIRCLE_R + 6}" y="${headerY + 4}" class="gl-name" font-size="${NAME_FONT}">${escapeXml(nameText)}</text>`,
    `<text x="${x + w / 2}" y="${pctY}" text-anchor="middle" class="gl-pct" font-size="${PCT_FONT}" fill="${lang.color ?? "#586069"}">${escapeXml(pct)}</text>`,
  ].join("\n    ");
}
