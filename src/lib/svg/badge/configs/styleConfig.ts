import { BadgeStyle, BadgeStyleConfig, BadgeStyleDefinition } from "../types";

const BASE_CONFIG: BadgeStyleConfig = {
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
};

const STYLE_DEFS: Array<{
  key: BadgeStyle;
  label: string;
  desc: string;
  overrides: Partial<BadgeStyleConfig>;
}> = [
  {
    key: "flat",
    label: "Flat",
    desc: "Default shields.io look with subtle gradient and rounded corners.",
    overrides: {},
  },
  {
    key: "flat-square",
    label: "Flat Square",
    desc: "Same as Flat, but with sharp square corners.",
    overrides: {
      rx: 0,
      clipId: "r_sq",
      gradientId: "s_sq",
    },
  },
  {
    key: "for-the-badge",
    label: "For The Badge",
    desc: "Large, bold, uppercase — built to stand out in a README.",
    overrides: {
      height: 28,
      charWidth: 7.6,
      pad: 16,
      rx: 0,
      fontWeight: 900,
      letterSpacing: 0.5,
      textY: 20,
      uppercase: true,
      gradient: "none",
      clipId: "r_ftb",
      gradientId: "g_ftb",
    },
  },
  {
    key: "plastic",
    label: "Plastic",
    desc: "Glossy plastic finish with a top-light, bottom-shadow gradient.",
    overrides: {
      gradient: "plastic",
      clipId: "r_pl",
      gradientId: "s_pl",
    },
  },
  {
    key: "minimal",
    label: "Minimal",
    desc: "Just text on a transparent background — clean and unobtrusive.",
    overrides: {
      rx: 0,
      transparent: true,
      gradient: "none",
      clipId: "r_min",
      gradientId: "g_min",
    },
  },
];

export const BADGE_STYLE_DEFINITIONS: BadgeStyleDefinition[] = STYLE_DEFS.map(
  ({ key, label, desc, overrides }) => ({
    key,
    label,
    desc,
    config: { ...BASE_CONFIG, ...overrides },
  }),
);
