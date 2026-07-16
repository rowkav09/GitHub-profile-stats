import { escapeXml } from "@/lib/sanitize";

type BadgeColors = {
  accent?: string;
  labelBg?: string;
  text?: string;
};

export type BadgeStyle =
  | "flat"
  | "flat-square"
  | "for-the-badge"
  | "plastic"
  | "minimal";

type BadgeStyleConfig = {
  height: number;
  charWidth: number;
  pad: number;
  rx: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textY: number;
  uppercase: boolean;
  transparent: boolean;
  gradient: "shields" | "plastic" | "none";
  clipId: string;
  gradientId: string;
};

const STYLE_CONFIGS: Record<BadgeStyle, BadgeStyleConfig> = {
  flat: {
    height: 20,
    charWidth: 6.6,
    pad: 10,
    rx: 3,
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: 0,
    textY: 14,
    uppercase: false,
    transparent: false,
    gradient: "shields",
    clipId: "r_flat",
    gradientId: "s_flat",
  },
  "flat-square": {
    height: 20,
    charWidth: 6.6,
    pad: 10,
    rx: 0,
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: 0,
    textY: 14,
    uppercase: false,
    transparent: false,
    gradient: "shields",
    clipId: "r_sq",
    gradientId: "s_sq",
  },
  "for-the-badge": {
    height: 28,
    charWidth: 7.6,
    pad: 16,
    rx: 0,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.5,
    textY: 20,
    uppercase: true,
    transparent: false,
    gradient: "none",
    clipId: "r_ftb",
    gradientId: "g_ftb",
  },
  plastic: {
    height: 20,
    charWidth: 6.6,
    pad: 10,
    rx: 3,
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: 0,
    textY: 14,
    uppercase: false,
    transparent: false,
    gradient: "plastic",
    clipId: "r_pl",
    gradientId: "s_pl",
  },
  minimal: {
    height: 20,
    charWidth: 6.6,
    pad: 10,
    rx: 0,
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: 0,
    textY: 14,
    uppercase: false,
    transparent: true,
    gradient: "none",
    clipId: "r_min",
    gradientId: "g_min",
  },
};

const VALID_STYLES = new Set<string>(Object.keys(STYLE_CONFIGS));

export function resolveBadgeStyle(style?: string | null): BadgeStyle {
  if (style && VALID_STYLES.has(style)) {
    return style as BadgeStyle;
  }
  return "flat";
}

export function renderBadge(
  label: string,
  value: string,
  color: string | BadgeColors = "4c8eda",
  style?: string | BadgeStyle,
): string {
  const safeLabel = escapeXml(label);
  const safeValue = escapeXml(value);
  const cfg = STYLE_CONFIGS[resolveBadgeStyle(typeof style === "string" ? style : null)];

  const accent = typeof color === "string" ? color : color.accent ?? "4c8eda";
  const labelBg = typeof color === "string" ? "555" : (color.labelBg ?? "555");
  const text = typeof color === "string" ? "fff" : (color.text ?? "fff");

  const displayLabel = cfg.uppercase ? safeLabel.toUpperCase() : safeLabel;
  const displayValue = cfg.uppercase ? safeValue.toUpperCase() : safeValue;

  if (cfg.transparent) {
    const labelTextWidth = Math.round(displayLabel.length * cfg.charWidth);
    const valueTextWidth = Math.round(displayValue.length * cfg.charWidth);
    const totalWidth = labelTextWidth + valueTextWidth + cfg.pad * 2 + 4;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${cfg.height}" role="img" aria-label="${safeLabel}: ${safeValue}">
  <title>${safeLabel}: ${safeValue}</title>
  <g font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="${cfg.fontSize}" font-weight="${cfg.fontWeight}">
    <text x="${cfg.pad}" y="${cfg.textY}" fill="#${labelBg}" text-anchor="start">${displayLabel}</text>
    <text x="${cfg.pad + labelTextWidth + 4}" y="${cfg.textY}" fill="#${accent}" text-anchor="start">${displayValue}</text>
  </g>
</svg>`;
  }

  const labelWidth = Math.round(displayLabel.length * cfg.charWidth + cfg.pad * 2);
  const valueWidth = Math.round(displayValue.length * cfg.charWidth + cfg.pad * 2);
  const totalWidth = labelWidth + valueWidth;

  let gradientDef = "";
  let overlayRect = "";
  if (cfg.gradient === "shields") {
    gradientDef = `<linearGradient id="${cfg.gradientId}" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>`;
    overlayRect = `<rect width="${totalWidth}" height="${cfg.height}" fill="url(#${cfg.gradientId})"/>`;
  } else if (cfg.gradient === "plastic") {
    gradientDef = `<linearGradient id="${cfg.gradientId}" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset="0.1" stop-color="#fff" stop-opacity=".15"/>
    <stop offset="0.9" stop-color="#000" stop-opacity=".15"/>
    <stop offset="1" stop-color="#000" stop-opacity=".35"/>
  </linearGradient>`;
    overlayRect = `<rect width="${totalWidth}" height="${cfg.height}" fill="url(#${cfg.gradientId})"/>`;
  }

  const letterSpacingAttr = cfg.letterSpacing
    ? ` letter-spacing="${cfg.letterSpacing}"`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${cfg.height}" role="img" aria-label="${safeLabel}: ${safeValue}">
  <title>${safeLabel}: ${safeValue}</title>
  ${gradientDef}
  <clipPath id="${cfg.clipId}"><rect width="${totalWidth}" height="${cfg.height}" rx="${cfg.rx}" fill="#fff"/></clipPath>
  <g clip-path="url(#${cfg.clipId})">
    <rect width="${labelWidth}" height="${cfg.height}" fill="#${labelBg}"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${cfg.height}" fill="#${accent}"/>
    ${overlayRect}
  </g>
  <g fill="#${text}" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="${cfg.fontSize}" font-weight="${cfg.fontWeight}"${letterSpacingAttr}>
    <text x="${labelWidth / 2}" y="${cfg.textY}">${displayLabel}</text>
    <text x="${labelWidth + valueWidth / 2}" y="${cfg.textY}">${displayValue}</text>
  </g>
</svg>`;
}
