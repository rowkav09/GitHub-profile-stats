import { renderErrorCard } from "../svg-primitives";
import { languageChartRegistry } from "./registry";
import { LanguageStat, LangChartOptions } from "@/lib/types";
import { ThemeConfig } from "@/lib/themes/types";

export function renderLanguageChart(
  languages: LanguageStat[],
  theme: ThemeConfig,
  options: LangChartOptions,
): string {
  const topLangs = languages.slice(0, Math.min(options.max_langs, 12));

  if (!topLangs.length) {
    return renderErrorCard("No language data available for this user.", theme);
  }

  const totalSize = topLangs.reduce((sum, lang) => sum + lang.size, 0);

  return languageChartRegistry[options.layout](
    topLangs,
    totalSize,
    theme,
    options,
  );
}
