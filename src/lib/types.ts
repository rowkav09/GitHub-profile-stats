export interface GitHubStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  currentStreak: number;
  longestStreak: number;
  commitsThisWeek: number;
  commitsThisMonth: number;
  commitsLastMonth: number;
  monthlyTrend: number; // percentage change vs last month
  avgCommitsPerDay: number;
  mostActiveDay: string; // e.g. "Monday"
  publicRepos: number;
  followers: number;
  contributionsThisYear: number;
  activityLevel: number; // 0–100 percentage for the ring
  grade: string; // A+, A, B+, B, C, D
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  title: string;
  icon: string;
  border: string;
}

export interface CardOptions {
  theme: string;
  hide_border: boolean;
  hide_title: boolean;
  hide: string[];
  show_icons: boolean;
  show_ring: boolean;
  border_radius: number;
  custom_title?: string;
}

export type StatKey =
  | "stars"
  | "commits"
  | "prs"
  | "issues"
  | "streak"
  | "week"
  | "trend"
  | "avg"
  | "active_day"
  | "grade"
  | "repos"
  | "followers"
  | "contributions";
