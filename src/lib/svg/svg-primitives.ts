import { ThemeConfig } from "@/lib/themes/types";
import { escapeXml } from "../sanitize";

export function renderBaseCard(
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  theme: ThemeConfig,
  borderColor?: string,
  borderOpacity?: number,
): string {
  const stroke = borderColor ?? theme.border;
  const opacity =
    borderOpacity !== undefined ? ` stroke-opacity="${borderOpacity}"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="${theme.bg}" stroke="${stroke}" stroke-width="1"${opacity}/>`;
}

export function renderActivityRing(
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
