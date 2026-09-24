// Run with `npm test` (Node 22.18+ strips the TypeScript types in src/lib/github.ts).
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { fetchGitHubStats, fetchLanguageStats, parseExtraOwners } from "../src/lib/github.ts";

const lang = (name, size, color = "#123456") => ({ size, node: { name, color } });

const USER_DATA = {
  user: {
    name: "Octo Cat",
    login: "octocat",
    avatarUrl: "https://example.com/a.png",
    bio: null,
    followers: { totalCount: 7 },
    repositories: {
      totalCount: 2,
      nodes: [
        { stargazerCount: 5, languages: { edges: [lang("TypeScript", 300), lang("CSS", 100)] } },
        { stargazerCount: 1, languages: { edges: [lang("Python", 100)] } },
      ],
    },
    contributionsCollection: {
      contributionYears: [2026],
      totalCommitContributions: 40,
      totalIssueContributions: 3,
      totalPullRequestContributions: 9,
      contributionCalendar: {
        totalContributions: 52,
        weeks: [{ contributionDays: [
          { contributionCount: 2, date: "2026-01-01" },
          { contributionCount: 0, date: "2026-01-02" },
        ] }],
      },
    },
  },
};

const LANG_USER_DATA = {
  user: { repositories: { nodes: USER_DATA.user.repositories.nodes } },
};

const ORG_DATA = {
  repositoryOwner: {
    login: "octo-org",
    repositories: {
      totalCount: 3,
      nodes: [
        { stargazerCount: 31, languages: { edges: [lang("TypeScript", 600)] } },
        { stargazerCount: 4, languages: { edges: [lang("Rust", 200)] } },
        { stargazerCount: 0, languages: { edges: [] } },
      ],
    },
  },
};

let calls;
const realFetch = globalThis.fetch;

beforeEach(() => {
  calls = [];
  process.env.GITHUB_TOKEN = "test-token";
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body);
    let data;
    if (body.query.includes("repositoryOwner(")) {
      data = body.variables.login === "missing-org" ? { repositoryOwner: null } : ORG_DATA;
    } else if (body.query.includes("contributionsCollection")) {
      data = USER_DATA;
    } else {
      data = LANG_USER_DATA;
    }
    return new Response(JSON.stringify({ data }), { status: 200 });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

test("parseExtraOwners: absent or empty means no extra owners", () => {
  assert.deepEqual(parseExtraOwners(null, "octocat"), []);
  assert.deepEqual(parseExtraOwners(undefined, "octocat"), []);
  assert.deepEqual(parseExtraOwners("", "octocat"), []);
  assert.deepEqual(parseExtraOwners(" , ", "octocat"), []);
});

test("parseExtraOwners: validates, dedupes, drops self, caps at 3", () => {
  assert.deepEqual(parseExtraOwners("rowkavdev", "rowkav09"), ["rowkavdev"]);
  assert.deepEqual(parseExtraOwners("a, A, rowkav09, -bad-, b, c, d", "rowkav09"), ["a", "b", "c"]);
  assert.deepEqual(parseExtraOwners("x<script>,ok-org", "u"), ["ok-org"]);
});

test("default behaviour unchanged: one request, user-only stats", async () => {
  const stats = await fetchGitHubStats("octocat");
  assert.equal(calls.length, 1);
  assert.ok(!calls[0].query.includes("repositoryOwner"));
  assert.equal(stats.totalStars, 6);
  assert.equal(stats.publicRepos, 2);
  assert.equal(stats.totalCommits, 40);
  assert.equal(stats.totalPRs, 9);
  assert.equal(stats.totalIssues, 3);
  assert.equal(stats.followers, 7);
  assert.deepEqual(stats.languages.map((l) => [l.name, l.size, l.percentage]), [
    ["TypeScript", 300, 60],
    ["CSS", 100, 20],
    ["Python", 100, 20],
  ]);

  // An explicit empty list is the same as leaving it out.
  calls = [];
  const again = await fetchGitHubStats("octocat", false, []);
  assert.equal(calls.length, 1);
  assert.deepEqual(again, stats);
});

test("orgs: stars, repos and languages combine; contribution stats do not", async () => {
  const base = await fetchGitHubStats("octocat");
  calls = [];
  const stats = await fetchGitHubStats("octocat", false, ["octo-org"]);
  assert.equal(calls.length, 2);
  const orgCall = calls.find((c) => c.query.includes("repositoryOwner("));
  assert.equal(orgCall.variables.login, "octo-org");
  assert.match(orgCall.query, /privacy: PUBLIC/);
  assert.match(orgCall.query, /isFork: false/);

  assert.equal(stats.totalStars, 6 + 35);
  assert.equal(stats.publicRepos, 2 + 3);
  assert.deepEqual(stats.languages.map((l) => [l.name, l.size]), [
    ["TypeScript", 900],
    ["Rust", 200],
    ["CSS", 100],
    ["Python", 100],
  ]);
  for (const key of [
    "username", "name", "followers", "totalCommits", "totalPRs", "totalIssues",
    "contributionsThisYear", "currentStreak", "longestStreak", "contributionDays",
    "estimatedCodingHours", "grade",
  ]) {
    assert.deepEqual(stats[key], base[key], key);
  }
});

test("orgs: unknown account gives a clear error", async () => {
  await assert.rejects(
    fetchGitHubStats("octocat", false, ["missing-org"]),
    /Account "missing-org" in orgs= not found/,
  );
});

test("languages endpoint: default unchanged, orgs merged when asked", async () => {
  const base = await fetchLanguageStats("octocat");
  assert.equal(calls.length, 1);
  assert.deepEqual(base.map((l) => l.name), ["TypeScript", "CSS", "Python"]);

  calls = [];
  const merged = await fetchLanguageStats("octocat", ["octo-org"]);
  assert.equal(calls.length, 2);
  assert.deepEqual(merged.map((l) => [l.name, l.size]), [
    ["TypeScript", 900],
    ["Rust", 200],
    ["CSS", 100],
    ["Python", 100],
  ]);
});
