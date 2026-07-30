import {
  ThemeConfig,
  LanguageStat,
  LangChartLayout,
  LangChartOptions,
} from "@/lib/types";

export type LanguageChartRenderer = (
  languages: LanguageStat[],
  totalSize: number,
  theme: ThemeConfig,
  options: LangChartOptions,
) => string;
