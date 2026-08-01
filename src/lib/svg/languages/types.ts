import { LanguageStat, LangChartOptions } from "@/lib/types";
import { ThemeConfig } from "@/lib/themes/types";

export type LanguageChartRenderer = (
  languages: LanguageStat[],
  totalSize: number,
  theme: ThemeConfig,
  options: LangChartOptions,
) => string;
