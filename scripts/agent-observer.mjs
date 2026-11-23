import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const MAX_ISSUES = 5;

function hasLabel(issue, label) {
  return Array.isArray(issue?.labels) && issue.labels.some((item) =>
    (typeof item === "string" ? item : item?.name) === label
  );
}

export function selectReadyIssues(issues, maxIssues = MAX_ISSUES) {
  if (!Array.isArray(issues)) throw new TypeError("Expected a GitHub issues array");
  if (!Number.isInteger(maxIssues) || maxIssues < 1 || maxIssues > MAX_ISSUES) {
    throw new RangeError("maxIssues must be an integer from 1 to 5");
  }
  return issues
    .filter((issue) =>
      issue && issue.state === "open" && !issue.pull_request &&
      hasLabel(issue, "agent-ready") &&
      !hasLabel(issue, "agent-paused") &&
      !hasLabel(issue, "agent-blocked")
    )
    .sort((a, b) => a.number - b.number)
    .slice(0, maxIssues)
    .map((issue) => ({
      number: issue.number,
      title: String(issue.title ?? "").replace(/[\r\n|]/g, " ").slice(0, 100),
      url: issue.html_url,
    }));
}

export async function observe({ repository, token, fetchImpl = fetch, summaryPath } = {}) {
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository ?? "")) {
    throw new Error("GITHUB_REPOSITORY must have owner/repository format");
  }
  if (!token) throw new Error("Missing GITHUB_TOKEN for read-only issue discovery");
  const endpoint = "https://api.github.com/repos/" + repository +
    "/issues?state=open&labels=agent-ready&per_page=100";
  const response = await fetchImpl(endpoint, {
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("GitHub API returned HTTP " + response.status);
  const selected = selectReadyIssues(await response.json());
  const lines = [
    "## K3 Agent Command — read-only observer",
    "",
    "No Codex run. No issue, code, deployment or billing changes.",
    "",
    "Eligible queued issues: **" + selected.length + "** (first API page, maximum 5 shown).",
    "",
    ...selected.map((issue) => "- #" + issue.number + " " + issue.title),
    ...(selected.length === 0 ? ["- None currently queued."] : []),
    "",
  ];
  const report = lines.join("\n");
  console.log(report);
  if (summaryPath) await appendFile(summaryPath, report + "\n", "utf8");
  return selected;
}

const isEntrypoint = process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isEntrypoint) {
  observe({
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GITHUB_TOKEN,
    summaryPath: process.env.GITHUB_STEP_SUMMARY,
  }).catch((error) => {
    console.error("Observer failed:", error.message);
    process.exitCode = 1;
  });
}
