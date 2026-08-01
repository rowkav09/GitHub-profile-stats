import { LangChartLayout } from "@/lib/types";

export type EmbedType = "card" | "langs" | "mini" | "sparkline";

export type CardOpts = {
  showIcons: boolean;
  showRing: boolean;
  hideBorder: boolean;
  hideTitle: boolean;
  borderRadius: string;
  customTitle: string;
  size: "default" | "compact";
  compactCount: 3 | 4 | 6;
  showEmoji: boolean;
};

export type LangOpts = {
  layout: LangChartLayout;
  maxLangs: number;
  hideBorder: boolean;
  hideTitle: boolean;
  borderRadius: string;
};

export type MiniOpts = {
  metric: string;
  label: string;
  color: string;
  style: string;
};

export type SparkOpts = {
  days: string;
  width: string;
  height: string;
  title: string;
  lineColor: string;
  fillColor: string;
  hideBorder: boolean;
  borderRadius: string;
};
