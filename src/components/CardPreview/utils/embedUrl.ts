import { STAT_OPTIONS } from "../configs";
import { CardOpts, LangOpts, SparkOpts, MiniOpts } from "../types";

export function appendCardParams(p: URLSearchParams, card: CardOpts) {
  if (!card.showIcons) p.set("show_icons", "false");
  if (!card.showRing) p.set("show_ring", "false");
  if (card.hideBorder) p.set("hide_border", "true");
  if (card.hideTitle) p.set("hide_title", "true");
  if (card.borderRadius !== "4.5") p.set("border_radius", card.borderRadius);
  if (card.customTitle.trim()) p.set("custom_title", card.customTitle.trim());
  if (card.size === "compact") {
    p.set("size", "compact");
    if (card.compactCount !== 6)
      p.set("compact_count", String(card.compactCount));
    if (card.showEmoji) p.set("show_emoji", "true");
  }
}

export function appendCardOrderParams(
  p: URLSearchParams,
  statsOrder: string[],
  hiddenStats: string[],
) {
  if (hiddenStats.length > 0) p.set("hide", hiddenStats.join(","));

  const visibleOrder = statsOrder.filter((k) => !hiddenStats.includes(k));
  const defaultVisible = STAT_OPTIONS.map((s) => s.key).filter(
    (k) => !hiddenStats.includes(k),
  );
  const isReordered =
    visibleOrder.length === defaultVisible.length &&
    visibleOrder.some((k, i) => k !== defaultVisible[i]);
  if (isReordered) p.set("order", visibleOrder.join(","));
}

export function appendLangsParams(
  p: URLSearchParams,
  langs: LangOpts,
  customTitle: string,
) {
  if (langs.hideBorder) p.set("hide_border", "true");
  if (langs.hideTitle) p.set("hide_title", "true");
  if (langs.borderRadius !== "4.5") p.set("border_radius", langs.borderRadius);
  if (customTitle.trim()) p.set("custom_title", customTitle.trim());
  if (langs.maxLangs !== 8) p.set("max_langs", String(langs.maxLangs));
  if (langs.layout !== "bar") p.set("layout", langs.layout);
}

export function appendMiniParams(p: URLSearchParams, mini: MiniOpts) {
  if (mini.metric !== "stars") p.set("metric", mini.metric);
  if (mini.label.trim()) p.set("label", mini.label.trim());
  if (mini.color.trim()) p.set("color", mini.color.trim());
  if (mini.style !== "flat") p.set("style", mini.style);
}

export function appendSparklineParams(p: URLSearchParams, spark: SparkOpts) {
  p.set("days", spark.days || "30");
  p.set("width", spark.width || "320");
  p.set("height", spark.height || "80");
  if (spark.hideBorder) p.set("hide_border", "true");
  if (spark.borderRadius !== "6") p.set("border_radius", spark.borderRadius);
  if (spark.lineColor.trim()) p.set("line_color", spark.lineColor.trim());
  if (spark.fillColor.trim()) p.set("fill_color", spark.fillColor.trim());
  if (spark.title.trim()) p.set("title", spark.title.trim());
}
