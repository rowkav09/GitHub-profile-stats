export const SITE = {
  url: "https://ghstats.dev",
  name: "GitHub Profile Stats",
  title: "GitHub Profile Stats — Beautiful Stats Cards for Your README",
  description:
    "Generate beautiful, dynamically generated GitHub stats cards for your profile README. 13 stats, 18 themes, fully customizable SVG cards — just paste one line. No tokens, no setup, no deployment needed. Free and open source.",
  authorName: "rowkav09",
  authorUrl: "https://github.com/rowkav09",
  creator: "rowkav09",
  publisher: "rowkav09",
  repoUrl: "https://github.com/rowkav09/GitHub-profile-stats",
  avatarUrl: "https://github.com/rowkav09.png",
  ogImagePath: "/opengraph-image",
} as const;

export const SITE_ROUTES = {
  home: "/",
  apiCard: "/api/card",
  apiBadge: "/api/badge",
  apiVisits: "/api/visits",
} as const;

export const ROBOTS_DISALLOW_ROUTES = [
  SITE_ROUTES.apiCard,
  SITE_ROUTES.apiBadge,
  SITE_ROUTES.apiVisits,
] as const;

export const SITEMAP_ROUTES = [
  {
    url: SITE.url,
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    url: new URL(SITE_ROUTES.apiCard, SITE.url).href,
    changeFrequency: "daily" as const,
    priority: 0.8,
  },
] as const;