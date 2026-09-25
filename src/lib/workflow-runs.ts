import { Redis } from "@upstash/redis";

const GRAPHQL = "https://api.github.com/graphql";
const API = "https://api.github.com";
const MAX_REPOS = 150; // Refuse oversized sets before a costly fanout.
const FRESH_SECONDS = 86400;
const STALE_SECONDS = 604800;

type Repo = { name: string; owner: { login: string } };
type Page = { data?: { repositoryOwner?: { repositories: { nodes: Repo[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } | null }; errors?: { message: string }[] };
type Snapshot = { count: number; updated: number; repos: number };

function redis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function token(): string {
  const value = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  if (!value) throw new Error("GitHub token not configured");
  return value;
}

async function listRepos(login: string, auth: string): Promise<Repo[]> {
  const repos: Repo[] = [];
  let cursor: string | null = null;
  do {
    const response = await fetch(GRAPHQL, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json", "User-Agent": "github-profile-stats" },
      body: JSON.stringify({ query: `query($login: String!, $cursor: String) {
        repositoryOwner(login: $login) {
          repositories(first: 100, after: $cursor, ownerAffiliations: OWNER, privacy: PUBLIC) {
            nodes { name owner { login } }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`, variables: { login, cursor } }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub repository lookup failed (${response.status})`);
    const page = await response.json() as Page;
    if (page.errors?.length) throw new Error(page.errors[0].message);
    const owner = page.data?.repositoryOwner;
    if (!owner) throw new Error(`GitHub owner ${login} not found`);
    repos.push(...owner.repositories.nodes);
    if (repos.length > MAX_REPOS) throw new Error(`More than ${MAX_REPOS} public repositories; unable to show an accurate total`);
    const next = owner.repositories.pageInfo;
    if (next.hasNextPage && !next.endCursor) throw new Error("GitHub pagination did not return a cursor");
    cursor = next.hasNextPage ? next.endCursor : null;
  } while (cursor);
  return repos;
}

export async function fetchWorkflowRuns(owners: string[]): Promise<{ count: number; repos: number }> {
  const auth = token();
  const repos: Repo[] = [];
  for (const owner of owners) {
    repos.push(...await listRepos(owner, auth));
    if (repos.length > MAX_REPOS) throw new Error(`More than ${MAX_REPOS} public repositories; unable to show an accurate total`);
  }
  const unique = [...new Map(repos.map((repo) => [`${repo.owner.login}/${repo.name}`.toLowerCase(), repo])).values()];
  let count = 0;
  // Small bounded groups avoid bursts while keeping a multi-repo badge viable.
  for (let i = 0; i < unique.length; i += 4) {
    const totals = await Promise.all(unique.slice(i, i + 4).map(async (repo) => {
      const response = await fetch(`${API}/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}/actions/runs?per_page=1`, {
        headers: { Authorization: `Bearer ${auth}`, Accept: "application/vnd.github+json", "User-Agent": "github-profile-stats" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`GitHub workflow run lookup failed (${response.status})`);
      const body = await response.json() as { total_count?: number };
      if (!Number.isSafeInteger(body.total_count) || (body.total_count ?? -1) < 0) throw new Error("GitHub returned an invalid workflow run count");
      return body.total_count!;
    }));
    count += totals.reduce((sum, total) => sum + total, 0);
  }
  return { count, repos: unique.length };
}

/** Redis lock prevents a cache stampede. A stale verified total is better than a partial one. */
export async function getWorkflowRuns(owners: string[]): Promise<Snapshot> {
  const store = redis();
  if (!store) throw new Error("Workflow badge cache is not configured");
  const key = `workflow-runs:v1:${owners.map((o) => o.toLowerCase()).sort().join(",")}`;
  const old = await store.get<Snapshot>(key);
  if (old && Date.now() - old.updated < FRESH_SECONDS * 1000) return old;
  const lockKey = `${key}:lock`;
  const locked = await store.set(lockKey, "1", { nx: true, ex: 600 });
  if (!locked) {
    if (old) return old;
    throw new Error("Workflow run total is updating; retry shortly");
  }
  try {
    const result = await fetchWorkflowRuns(owners);
    const current = { ...result, updated: Date.now() };
    await store.set(key, current, { ex: STALE_SECONDS });
    return current;
  } catch (error) {
    if (old) return old;
    throw error;
  } finally {
    await store.del(lockKey);
  }
}
