# K3 Agent Command — Phase 1 Pilot

## Current scope
The pilot runs **read-only task discovery**, never Codex. It is not yet an autonomous coding system.
`.github/workflows/ci.yml` validates draft pull requests with the existing lint/build/export tests and observer unit tests.
`.github/workflows/agent-observer.yml` is scheduled four times per hour (minute 7, 22, 37, 52 UTC) to inspect GitHub issues labeled `agent-ready`.
No OpenAI key, paid model, external service, deployment, write permission, database, or long-running host is required.

## Start
1. Review and merge the draft PR only after the CI check passes and you approve the changes.
2. Create a GitHub issue with narrowly scoped acceptance criteria and apply `agent-ready` (create the label if needed).
3. Open Actions → K3 Agent Queue Observer (DRY RUN) → Run workflow.
4. Read the run summary; verify the correct issue number appears and that no code or issues were modified.
5. Check a scheduled run; scheduled GitHub Actions can be delayed or skipped, so this is best-effort monitoring rather than guaranteed minute-by-minute service.

## Pilot stop controls
- To pause discovery immediately, disable the `K3 Agent Queue Observer (DRY RUN)` workflow under GitHub Actions.
- Removing the `agent-ready` label or applying `agent-paused` / `agent-blocked` removes a task from the reported candidate queue.
- Each execution has a three-minute timeout and a single-run concurrency limit; observer reports at most five candidates.
- The observer only requests the first 100 GitHub issues returned by the filtered API. Expand pagination before production use.

## Phase 2 — gated coding worker (not implemented)
Only after reviewing a successful read-only run:
1. Provision a separate Codex identity/credentials and hard dollar/token caps; do not assume ChatGPT subscription entitlements cover API or hosted execution.
2. Add an explicit controller-level allowlist, durable job/attempt state, one active task per repository, and a 20-minute maximum job duration.
3. Run bounded Codex tasks on isolated branches/worktrees and interpret GitHub issue text as untrusted data.
4. Verify changed files and tests in a separate process before offering **draft** PRs for human approval.
5. Add audit logs, retries (maximum 3), alerting, pause/resume and a daily report. Never auto-merge or deploy.

## Phase 3 — application delivery
Once the pilot is verified, use K3 Agent Command to develop the approved K3 Commerce OS backlog with synthetic test data first.
Keep company/customer data and the Variya UAT bot outside unattended cloud execution without separate authorization.
