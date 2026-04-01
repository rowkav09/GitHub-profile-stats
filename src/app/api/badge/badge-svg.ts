import { escapeXml } from "@/lib/sanitize";

/**
 * Render a small shields.io-style SVG badge.
 * Label on the left (dark), value on the right (accent colour).
 */
export function renderBadge(
  label: string,
  value: string,
  color = "4c8eda",
): string {
  const safeLabel = escapeXml(label);
  const safeValue = escapeXml(value);
  const CHAR_WIDTH = 6.6;
  const PAD = 10;

  const labelWidth = Math.round(safeLabel.length * CHAR_WIDTH + PAD * 2);
  const valueWidth = Math.round(safeValue.length * CHAR_WIDTH + PAD * 2);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${safeLabel}: ${safeValue}">
  <title>${safeLabel}: ${safeValue}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="14">${safeLabel}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${safeValue}</text>
  </g>
</svg>`;
}
