# Mendr

**Plug-and-play self-maintaining APIs.** Mendr watches your service's telemetry,
diagnoses failures, and remediates the ones it can safely handle — restarting or
rolling back broken infrastructure, opening PRs for code-level fixes, and merging
only what's proven safe to merge. Everything else escalates to a human with full
context attached.

> Status: early / pre-alpha. Architecture and interfaces below are the current
> design, not a stable release.

---

## Why

Most "self-healing" tooling either isn't autonomous (dashboards + alerts, human
still does everything) or is too autonomous to trust (unattended production changes
with no verification gate). Mendr is built around a simple idea: **autonomy should
be tiered and earned, not assumed.**

- **Tier 0 — read-only.** Mendr diagnoses and proposes; you decide.
- **Tier 1 — scoped autonomous actions.** Restart, rollback, scale — narrow,
  reversible, per-action opt-in.
- **Tier 2 — code fixes.** Mendr opens a PR, runs your tests + a canary, a human merges.
- **Tier 3 — escalate.** Anything ambiguous, high-risk, or low-confidence pages a human.

Mendr never has merge rights on your repo. It proposes; your own branch protection
and reviewers decide.

---

## How it works

Mendr splits into a platform-agnostic **core** and swappable **adapters**:

```
            ┌──────────────────────────────┐
            │   Core (platform-agnostic)   │
            │                              │
            │  OTel ingestion → RAG        │
            │  diagnosis → tiering policy  │
            │  → immutable audit log       │
            └───────────────┬──────────────┘
                            │
                  common adapter interface
                restart / rollback / scale /
                    promote_canary
                             │
              ┌──────────────┼────────────────┐
              ▼               ▼               ▼
      Kubernetes adapter  Docker/Compose  Serverless adapter
      (Argo Rollouts       adapter          (alias rollback,
       canary)             (nginx weighted   traffic-split
                            canary)           canary)
```

- **Core**: ingests OpenTelemetry traces/logs/metrics plus a deploy/change-event
  feed, retrieves relevant context (runbooks, past incidents, your architecture
  docs) via RAG, decides which tier an incident belongs to, and writes an
  immutable audit record for every decision it makes.
- **Adapters**: translate the core's decisions into platform-specific actions.
  Each adapter implements the same interface (`restart()`, `rollback()`, `scale()`,
  `get_traffic_split()`, `promote_canary()`), so the core never needs to know what
  platform it's running against.

The first adapter is Kubernetes, since Argo Rollouts/Flagger gives Tier 2 canary
verification largely for free. Docker/Compose and serverless adapters are planned
once the core/adapter split has proven out against real usage.

---

## Getting started

> Setup instructions will live here once the first installable version ships.
> For now, see [`/docs/architecture.md`](./docs/architecture.md) for the full
> design doc.

Planned onboarding flow:

1. Install the OTel SDK integration — Mendr reads telemetry, does nothing else.
2. Run in Tier 0 (read-only). Mendr posts diagnosis + proposed fixes to Slack or
   as PR comments. No write access at all.
3. Opt in to specific Tier 1 actions, per action type, scoped to specific
   namespaces/services — not a global "enable autonomy" switch.
4. Enable Tier 2 per-repo once you trust Tier 1 — still gated entirely by your
   own required-reviewer branch protection.

---

## Design principles

- **Autonomy is tiered and opt-in**, never assumed. Every escalation in autonomy
  is a deliberate choice the user makes, not a default.
- **Mendr proposes, your infrastructure's own gates decide.** No standing merge
  rights, no broad standing credentials — every adapter requests the minimum
  permissions its allowlisted actions need.
- **Untrusted input stays untrusted.** Anything derived from user-facing traffic
  (error messages, headers, logs) is treated as data flowing into diagnosis, never
  as instructions — the action space is constrained by policy, independent of
  what any model "decides."
- **Every decision is audited.** Tier 0 through Tier 3, every action (or proposed
  action) writes an immutable, user-queryable record: what was observed, what was
  diagnosed, what was done, and why.
- **Verification is mechanical, not vibes-based.** A fix is only considered
  resolved after tests pass and a bake/canary period confirms the original
  triggering metric stays healthy — never on the model's own "looks fine" judgment.

---

## Roadmap

- [ ] Core: OTel ingestion + change-feed correlation
- [ ] Core: RAG diagnosis (runbooks, past incidents, architecture docs)
- [ ] Core: tiering policy engine + immutable audit log
- [ ] Kubernetes adapter (Tier 1 actions: restart, rollback, scale)
- [ ] Kubernetes adapter: Argo Rollouts canary integration (Tier 2 verification)
- [ ] Tier 2: PR generation + regression test synthesis
- [ ] Per-action opt-in / permission scoping UI
- [ ] Docker/Compose adapter
- [ ] Serverless adapter

---

## Contributing

Not yet open for external contributions — the core interfaces (especially the
adapter contract) are still in flux. Issues and design feedback are welcome once
the repo has its first working core.

## License

MIT