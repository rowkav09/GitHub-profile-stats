export type BadgeColors = {
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

export type BadgeStyleConfig = {
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
