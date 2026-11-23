import { appendFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const REPOSITORY = "Kube13/k3-portfolio";
const MAX_RUNS_PER_DAY = 2;
const MAX_BODY_CHARS = 6000;

const labelSet = (issue) => new Set((issue?.labels ?? []).map((value) =>
  typeof value === "string" ? value : value?.name).filter(Boolean));

export function evaluateCodexTask({
  repository, actor, issueNumber, issue, enabled, confirmed, recentRuns = 0,
} = {}) {
  if (repository !== REPOSITORY) return { approved: false, reason: "Repository not allowlisted" };
  if (actor !== "Kube13") return { approved: false, reason: "Only the owner can launch this prototype" };
  if (!Number.isSafeInteger(issueNumber) || issueNumber < 1) {
    return { approved: false, reason: "Invalid issue number" };
  }
  if (!issue || issue.number !== issueNumber || issue.state !== "open" || issue.pull_request) {
    return { approved: false, reason: "Must select an open GitHub issue, not a pull request" };
  }
  const labels = labelSet(issue);
  if (!labels.has("agent-ready") || !labels.has("agent-approved")) {
    return { approved: false, reason: "Missing explicit agent-ready and agent-approved labels" };
  }
  if (labels.has("agent-paused") || labels.has("agent-blocked")) {
    return { approved: false, reason: "Issue is paused or blocked" };
  }
  if (!String(issue.body ?? "").trim() || String(issue.body).length > MAX_BODY_CHARS) {
    return { approved: false, reason: "Issue body missing or over 6000 characters" };
  }
  if (!enabled) return { approved: false, reason: "K3_CODEX_ENABLED repository variable is disabled" };
  if (!confirmed) return { approved: false, reason: "Manual spend confirmation not provided" };
  if (!Number.isSafeInteger(recentRuns) || recentRuns < 0 || recentRuns >= MAX_RUNS_PER_DAY) {
    return { approved: false, reason: "Conservative maximum of two previous worker runs per 24h reached" };
  }
  return { approved: true, reason: "Approved manual bounded Codex session" };
}

function countRecentRuns(runs, currentRunId, nowMs) {
  const cutoff = nowMs - 24 * 60 * 60 * 1000;
  return (runs ?? []).filter((run) =>
    String(run.id) !== String(currentRunId) &&
    new Date(run.created_at).getTime() >= cutoff &&
    !run.pull_requests?.length
  ).length;
}

export async function preflight({ env = process.env, fetchImpl = fetch, nowMs = Date.now() } = {}) {
  const issueNumber = Number(env.ISSUE_NUMBER);
  const repository = env.GITHUB_REPOSITORY;
  const actor = env.GITHUB_ACTOR;
  if (repository !== REPOSITORY || actor !== "Kube13" ||
    !Number.isSafeInteger(issueNumber) || issueNumber < 1) {
    return { approved: false, reason: "Invalid repository, actor or issue number" };
  }
  if (!env.GITHUB_TOKEN) throw new Error("Read-only GitHub token unavailable");
  const headers = {
    Authorization: "Bearer " + env.GITHUB_TOKEN,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const getJson = async (path) => {
    const response = await fetchImpl("https://api.github.com/repos/" + REPOSITORY + path, {
      headers, signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("GitHub read failed with status " + response.status);
    return response.json();
  };
  const issue = await getJson("/issues/" + issueNumber);
  const enabled = env.K3_CODEX_ENABLED === "true";
  const confirmed = env.CONFIRM_SPEND === "true";
  const provisional = evaluateCodexTask({
    repository, actor, issueNumber, issue, enabled, confirmed, recentRuns: 0,
  });
  if (!provisional.approved) return provisional;

  const listing = await getJson("/actions/workflows/codex-worker-prototype.yml/runs?event=workflow_dispatch&per_page=100");
  const recentRuns = countRecentRuns(listing.workflow_runs, env.GITHUB_RUN_ID, nowMs);
  return evaluateCodexTask({ repository, actor, issueNumber, issue, enabled, confirmed, recentRuns });
}

async function main() {
  const result = await preflight();
  const summary = "K3 gated worker: **" + (result.approved ? "APPROVED" : "BLOCKED") +
    "** — " + result.reason + "\n";
  console.log(summary);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT,
      "approved=" + result.approved + "\n" +
      "issue_number=" + Number(process.env.ISSUE_NUMBER || 0) + "\n", "utf8");
  }
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary, "utf8");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error("Preflight failed closed:", error.message);
    process.exitCode = 1;
  });
}
