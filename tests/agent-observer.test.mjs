import test from "node:test";
import assert from "node:assert/strict";
import { selectReadyIssues, observe } from "../scripts/agent-observer.mjs";

const ready = (number, extra = {}) => ({
  number, title: "Task " + number, state: "open",
  labels: [{ name: "agent-ready" }],
  html_url: "https://github.com/Kube13/k3-portfolio/issues/" + number,
  ...extra,
});

test("selects open approved issues, excludes pull requests and blocked tasks", () => {
  const result = selectReadyIssues([
    ready(8), ready(2, { pull_request: { url: "example" } }),
    ready(3, { labels: ["agent-ready", "agent-blocked"] }),
    ready(4, { state: "closed" }),
    ready(9, { labels: ["agent-ready", "agent-paused"] }),
    ready(1),
  ]);
  assert.deepEqual(result.map((issue) => issue.number), [1, 8]);
});

test("limits work candidates to five and sanitizes issue title", () => {
  const result = selectReadyIssues([
    ...Array.from({ length: 8 }, (_, index) => ready(index + 1)),
    ready(9, { title: "Untrusted\n|text" }),
  ]);
  assert.equal(result.length, 5);
  assert.deepEqual(result.map((item) => item.number), [1, 2, 3, 4, 5]);
  assert.equal(selectReadyIssues([ready(9, { title: "Untrusted\n|text" })])[0].title, "Untrusted  text");
});

test("rejects malformed inputs", () => {
  assert.throws(() => selectReadyIssues({}), TypeError);
  assert.throws(() => selectReadyIssues([], 100), RangeError);
});

test("observer calls only the read-only endpoint and returns queue metadata", async () => {
  let fetchedUrl;
  const result = await observe({
    repository: "Kube13/k3-portfolio", token: "local-test-token",
    fetchImpl: async (url) => {
      fetchedUrl = url;
      return { ok: true, json: async () => [ready(11)] };
    },
  });
  assert.match(fetchedUrl, /\/issues\?state=open&labels=agent-ready/);
  assert.equal(result[0].number, 11);
});

test("observer fails closed if credentials are missing", async () => {
  await assert.rejects(observe({ repository: "Kube13/k3-portfolio" }), /Missing GITHUB_TOKEN/);
});
