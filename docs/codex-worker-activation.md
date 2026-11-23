# K3 Codex Worker — manual, gated prototype

## Status
This is **not** a 24/7 autonomous coding system. The read-only queue observer is scheduled.
This worker is **manual-only, disabled by default, and not authorized to push or open a PR**.
Only the repository owner can dispatch it. A proposed patch is independently validated
and retained for seven days. Do not remove the approval gates merely to make it run more often.

## Controls against accidental spending
1. No scheduled or issue-driven trigger exists for the coding worker; only manual workflow dispatch.
2. Preflight requires actor Kube13, the exact repository, a valid open issue,
   both agent-ready and agent-approved labels, and neither agent-paused nor agent-blocked.
3. Repository variable K3_CODEX_ENABLED must equal true. Missing means disabled.
4. Every manual dispatch requires confirm_spend=true; default is false.
5. Conservative maximum of two previous workflow runs in the rolling last 24 hours,
   including dry runs, one worker at a time, and a twenty-minute Codex job timeout.
   These bound calls, **not monetary usage**.
6. Set separate OpenAI Platform project spending limits and alerts before activating a key.
7. The Codex job has read-only GitHub permissions. It can edit only its isolated runner.
8. A patch artifact is checked in another job without an API key. There is no automatic
   commit, push, merge, or deployment.

## Safe first check — no model usage
1. Review and merge the draft PR only after its checks pass.
2. Keep repository variable K3_CODEX_ENABLED unset or false.
3. Open GitHub Actions → K3 Codex Worker Prototype (OPT-IN) → Run workflow.
4. Enter issue #6 (read-only smoke test); leave confirm_spend unchecked.
5. Preflight must say BLOCKED; Codex and independent-verification jobs must be skipped.

## Later: authorize one billed coding run
1. Choose a harmless issue with precise acceptance criteria.
2. Apply both agent-ready and agent-approved labels manually.
3. Set secret OPENAI_API_KEY under repository Settings → Secrets and variables → Actions.
   Never paste the key in chat, logs or issue content.
4. Configure OpenAI Platform spending limits and alerts first.
5. Set repository variable K3_CODEX_ENABLED=true.
6. Dispatch workflow as owner with the correct issue number and confirm_spend checked.
7. The worker edits only app/ and tests/ on a temporary runner. It exports a patch,
   and a second job validates the patch with npm lint, build and export tests.
8. Independently inspect the artifact before using it. It is not pushed or deployed.

## Emergency stop
Set K3_CODEX_ENABLED=false, disable the workflow in Actions, or cancel its active run.
For immediate credential revocation, rotate/revoke the API key in OpenAI Platform.
Cancelling cannot reverse previously incurred model usage.

## Next implementation stage
- GitHub Actions schedule is best effort. The *observer* is not guaranteed each quarter-hour.
- Two workflow runs per rolling day is a conservative invocation limit, not a cost limit.
- Manual dispatch is intentional. **No unattended model execution** is enabled at this stage.
- After a verified real run: add durable task leases and retry state, security-reviewed
  draft PR publishing, and only then consider unattended dispatch.
