export interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  title: string;
  icon: string;
  border: string;
}

export type ThemeSurface = "visual_builder" | "hero";

export type ThemeDefinition = ThemeConfig & {
  key: string;
  showIn: ThemeSurface[];
};
