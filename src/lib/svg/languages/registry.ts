import { LangChartLayout } from "@/lib/types";

import renderDefault from "./renderers/default";
import renderGrid from "./renderers/grid";
import renderStacked from "./renderers/stacked";
import renderDonut from "./renderers/donut";
import renderDonutVertical from "./renderers/donut-vertical";
import renderCompact from "./renderers/compact";
import renderHorizontalList from "./renderers/horizontal-list";
import renderVerticalList from "./renderers/vertical-list";

import { LanguageChartRenderer } from "./types/types";

export const languageChartRegistry = {
  bar: renderDefault,
  grid: renderGrid,
  stacked: renderStacked,
  donut: renderDonut,
  donut_vertical: renderDonutVertical,
  compact: renderCompact,
  horizontal_list: renderHorizontalList,
  vertical_list: renderVerticalList,
} satisfies Record<LangChartLayout, LanguageChartRenderer>;
