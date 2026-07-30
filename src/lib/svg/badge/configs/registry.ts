import { BadgeStyle, BadgeStyleConfig } from "../types";
import { BADGE_STYLE_DEFINITIONS } from "./styleConfig";

export const STYLE_CONFIGS: Record<BadgeStyle, BadgeStyleConfig> =
  Object.fromEntries(
    BADGE_STYLE_DEFINITIONS.map((d) => [d.key, d.config]),
  ) as Record<BadgeStyle, BadgeStyleConfig>;

export const BADGE_STYLES = BADGE_STYLE_DEFINITIONS.map(
  ({ key, label, desc }) => ({ key, label, desc }),
);

export const VALID_STYLES = new Set<string>(
  BADGE_STYLE_DEFINITIONS.map((d) => d.key),
);
