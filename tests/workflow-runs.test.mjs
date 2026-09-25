import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { fetchWorkflowRuns } from "../src/lib/workflow-runs.ts";

const originalFetch = globalThis.fetch;
let calls;
beforeEach(() => {
  process.env.GITHUB_TOKEN = "test-token";
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push([url, init]);
    if (url.endsWith("/graphql")) {
      const { variables } = JSON.parse(init.body);
      const nodes = variables.login === "user" ? ["one", "two"] : ["shared"];
      return new Response(JSON.stringify({ data: { repositoryOwner: { repositories: {
        nodes: nodes.map((name) => ({ name, owner: { login: variables.login } })),
        pageInfo: { hasNextPage: false, endCursor: null },
      } } } }));
    }
    return new Response(JSON.stringify({ total_count: url.includes("/two/") ? 0 : 7 }));
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

test("totals public repos of user and opt-in owner with one run-count call per repo", async () => {
  assert.deepEqual(await fetchWorkflowRuns(["user", "org"]), { count: 14, repos: 3 });
  const graph = calls.filter(([url]) => url.endsWith("/graphql"));
  const runs = calls.filter(([url]) => url.includes("/actions/runs"));
  assert.equal(graph.length, 2);
  assert.equal(runs.length, 3);
  assert.ok(runs.every(([url]) => url.endsWith("?per_page=1")));
  assert.ok(graph.every(([, init]) => init.body.includes("privacy: PUBLIC")));
});

test("failure refuses partial totals", async () => {
  globalThis.fetch = async (url, init) => {
    if (url.endsWith("/graphql")) return new Response(JSON.stringify({ data: { repositoryOwner: { repositories: {
      nodes: [{ name: "a", owner: { login: "user" } }, { name: "b", owner: { login: "user" } }],
      pageInfo: { hasNextPage: false, endCursor: null },
    } } } }));
    return url.includes("/b/") ? new Response("{}", { status: 403 }) : new Response('{"total_count":12}');
  };
  await assert.rejects(fetchWorkflowRuns(["user"]), /failed \(403\)/);
});

test("missing owner fails rather than publishing zero", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ data: { repositoryOwner: null } }));
  await assert.rejects(fetchWorkflowRuns(["missing"]), /not found/);
});
