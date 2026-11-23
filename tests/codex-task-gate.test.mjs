import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCodexTask, preflight } from "../scripts/codex-task-gate.mjs";

const readyIssue = (patch = {}) => ({
  number: 18, state: "open",
  labels: [{ name: "agent-ready" }, { name: "agent-approved" }],
  title: "Fix harmless portfolio defect",
  body: "Reproduce the defect and add tests.",
  ...patch,
});
const base = {
  repository: "Kube13/k3-portfolio", actor: "Kube13",
  issueNumber: 18, issue: readyIssue(),
  enabled: true, confirmed: true, recentRuns: 0,
};
test("approves a strictly allowlisted, double-labeled manually confirmed task", () => {
  assert.equal(evaluateCodexTask(base).approved, true);
});
test("denies unauthorized, paused, blocked or unapproved work", () => {
  for (const altered of [
    { repository: "someone/other" }, { actor: "outsider" },
    { issue: readyIssue({ state: "closed" }) },
    { issue: readyIssue({ pull_request: { url: "anything" } }) },
    { issue: readyIssue({ labels: ["agent-ready"] }) },
    { issue: readyIssue({ labels: ["agent-ready", "agent-approved", "agent-paused"] }) },
    { issue: readyIssue({ labels: ["agent-ready", "agent-approved", "agent-blocked"] }) },
    { issue: readyIssue({ body: "" }) },
    { issue: readyIssue({ body: "x".repeat(6001) }) },
    { enabled: false }, { confirmed: false },
    { recentRuns: 2 }, { recentRuns: -1 },
  ]) {
    assert.equal(evaluateCodexTask({ ...base, ...altered }).approved, false);
  }
});
test("preflight short-circuits before API calls for unauthorized actor", async () => {
  const result = await preflight({
    env: { GITHUB_REPOSITORY: base.repository, GITHUB_ACTOR: "stranger", ISSUE_NUMBER: "18" },
    fetchImpl: () => { throw Error("Must not fetch"); },
  });
  assert.equal(result.approved, false);
});
test("preflight rejects disabled runs without inspecting workflow history", async () => {
  let calls = 0;
  const result = await preflight({
    env: { GITHUB_REPOSITORY: base.repository, GITHUB_ACTOR: base.actor,
      ISSUE_NUMBER: "18", GITHUB_TOKEN: "test", K3_CODEX_ENABLED: "false", CONFIRM_SPEND: "true" },
    fetchImpl: async () => { calls++; return { ok: true, json: async () => readyIssue() }; },
  });
  assert.equal(result.approved, false);
  assert.equal(calls, 1);
});
test("preflight enforces rolling 24-hour run cap and excludes current run", async () => {
  const nowMs = Date.parse("2026-11-23T12:00:00Z");
  const result = await preflight({
    nowMs,
    env: { GITHUB_REPOSITORY: base.repository, GITHUB_ACTOR: base.actor,
      ISSUE_NUMBER: "18", GITHUB_TOKEN: "test", GITHUB_RUN_ID: "9",
      K3_CODEX_ENABLED: "true", CONFIRM_SPEND: "true" },
    fetchImpl: async (url) => {
      if (url.endsWith("/issues/18")) return { ok: true, json: async () => readyIssue() };
      return {
        ok: true,
        json: async () => ({ workflow_runs: [
          { id: 1, created_at: "2026-11-23T11:00:00Z" },
          { id: 2, created_at: "2026-11-23T10:00:00Z" },
          { id: 9, created_at: "2026-11-23T12:00:00Z" },
          { id: 3, created_at: "2026-11-21T12:00:00Z" },
        ] }),
      };
    },
  });
  assert.equal(result.approved, false);
  assert.match(result.reason, /maximum/);
});
test("preflight passes when just one earlier run is within 24h", async () => {
  const result = await preflight({
    nowMs: Date.parse("2026-11-23T12:00:00Z"),
    env: { GITHUB_REPOSITORY: base.repository, GITHUB_ACTOR: base.actor,
      ISSUE_NUMBER: "18", GITHUB_TOKEN: "test", GITHUB_RUN_ID: "9",
      K3_CODEX_ENABLED: "true", CONFIRM_SPEND: "true" },
    fetchImpl: async (url) => ({
      ok: true,
      json: async () => url.endsWith("/issues/18") ? readyIssue() : { workflow_runs: [
        { id: 1, created_at: "2026-11-23T10:00:00Z" },
        { id: 9, created_at: "2026-11-23T12:00:00Z" },
      ] },
    }),
  });
  assert.equal(result.approved, true);
});
