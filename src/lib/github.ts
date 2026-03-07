import { GitHubStats, ContributionDay } from "./types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
query($username: String!) {
  user(login: $username) {
    name
    login
    avatarUrl
    followers {
      totalCount
    }
    repositories(
      first: 100
      ownerAffiliations: OWNER
      orderBy: { field: STARGAZERS, direction: DESC }
    ) {
      totalCount
      nodes {
        stargazerCount
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function calculateStreak(days: ContributionDay[]): {
  current: number;
  longest: number;
} {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let currentRun = 0;
  for (const day of sorted) {
    if (day.contributionCount > 0) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 0;
    }
  }

  let current = 0;
  const today = new Date().toISOString().split("T")[0];

  for (let i = sorted.length - 1; i >= 0; i--) {
    const day = sorted[i];
    if (day.date > today) continue;

    if (day.contributionCount > 0) {
      current++;
    } else {
      if (day.date === today) continue;
      break;
    }
  }

  return { current, longest };
}

function calculateWeeklyTrend(
  days: ContributionDay[],
): { thisWeek: number; lastWeek: number } {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const weekAgoStr = weekAgo.toISOString().split("T")[0];
  const twoWeeksAgoStr = twoWeeksAgo.toISOString().split("T")[0];

  const thisWeek = days
    .filter((d) => d.date >= weekAgoStr)
    .reduce((sum, d) => sum + d.contributionCount, 0);

  const lastWeek = days
    .filter((d) => d.date >= twoWeeksAgoStr && d.date < weekAgoStr)
    .reduce((sum, d) => sum + d.contributionCount, 0);

  return { thisWeek, lastWeek };
}

function calculateMostActiveDay(days: ContributionDay[]): string {
  const totals = [0, 0, 0, 0, 0, 0, 0]; // Sun–Sat
  for (const d of days) {
    const dow = new Date(d.date + "T00:00:00").getDay();
    totals[dow] += d.contributionCount;
  }
  const maxIdx = totals.indexOf(Math.max(...totals));
  return DAY_NAMES[maxIdx];
}

function calculateAvgCommitsPerDay(days: ContributionDay[]): number {
  if (days.length === 0) return 0;
  const total = days.reduce((sum, d) => sum + d.contributionCount, 0);
  return Math.round((total / days.length) * 10) / 10;
}

function calculateActivityLevel(days: ContributionDay[]): number {
  // Activity level: % of days in past 7 that had at least 1 contribution
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const cutoff = weekAgo.toISOString().split("T")[0];

  const recent = days.filter((d) => d.date >= cutoff);
  if (recent.length === 0) return 0;
  const activeDays = recent.filter((d) => d.contributionCount > 0).length;
  return Math.round((activeDays / recent.length) * 100);
}

function calculateGrade(activityLevel: number, streak: number, commitsThisWeek: number): string {
  // Weighted score: 50% activity (past 7 days), 25% streak (capped at 7 days), 25% weekly volume (capped at 20)
  const actScore = activityLevel; // 0–100
  const streakScore = Math.min(streak / 7, 1) * 100;
  const commitScore = Math.min(commitsThisWeek / 20, 1) * 100;
  const score = actScore * 0.5 + streakScore * 0.25 + commitScore * 0.25;

  if (score >= 80) return "A+";
  if (score >= 65) return "A";
  if (score >= 50) return "B+";
  if (score >= 35) return "B";
  if (score >= 20) return "C";
  return "D";
}

export async function fetchGitHubStats(
  username: string,
): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-profile-stats",
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with status ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    const msg = json.errors[0]?.message ?? "Unknown GraphQL error";
    throw new Error(msg);
  }

  const user = json.data?.user;
  if (!user) {
    throw new Error(`User "${username}" not found`);
  }

  const contrib = user.contributionsCollection;
  const calendar = contrib.contributionCalendar;

  const allDays: ContributionDay[] = calendar.weeks.flatMap(
    (w: { contributionDays: ContributionDay[] }) => w.contributionDays,
  );

  const totalStars = user.repositories.nodes.reduce(
    (sum: number, repo: { stargazerCount: number }) =>
      sum + repo.stargazerCount,
    0,
  );

  const { current, longest } = calculateStreak(allDays);
  const { thisWeek, lastWeek } = calculateWeeklyTrend(allDays);
  const weeklyTrend =
    lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;
  const activityLevel = calculateActivityLevel(allDays);

  return {
    username: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    totalStars,
    totalCommits: contrib.totalCommitContributions,
    totalPRs: contrib.totalPullRequestContributions,
    totalIssues: contrib.totalIssueContributions,
    currentStreak: current,
    longestStreak: longest,
    commitsThisWeek: thisWeek,
    commitsLastWeek: lastWeek,
    weeklyTrend,
    avgCommitsPerDay: calculateAvgCommitsPerDay(allDays),
    mostActiveDay: calculateMostActiveDay(allDays),
    publicRepos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    contributionsThisYear: calendar.totalContributions,
    activityLevel,
    grade: calculateGrade(activityLevel, current, thisWeek),
  };
}
