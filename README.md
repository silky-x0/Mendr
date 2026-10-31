# Mendr

**Self-maintaining APIs.** Mendr watches the HTTP traffic your service sends and
serves, notices when an API contract drifts — an upstream provider changes a
response, deprecates a field, tightens a rate limit, or your own deploy breaks a
consumer — and tells you exactly what changed, where in your code it hurts, and
how to fix it. Over time, and only as far as you allow, it opens the fix as a PR.

> Status: early / pre-alpha. Everything below is the current design, not a
> stable release.

---

## Why

APIs rot quietly. A third-party API ships a breaking change in a changelog nobody
reads; a field you depend on starts coming back `null`; a provider lowers your
rate limit; a teammate's deploy renames a response field another service still
reads. Generic monitoring shows *that* error rates went up. It rarely tells you
*which contract changed* and *which lines of your code depend on it*.

Mendr focuses on that one layer: the contracts between your service and the APIs
around it.

| What drifts | Example | What Mendr does |
|---|---|---|
| **Upstream APIs** | A payment provider starts returning `400 unknown_field` on an endpoint that was stable for weeks | Flags the new error class, links the upstream changelog or spec diff, points at the call sites |
| **Your own contract** | A deploy renames `user_id` → `userId` and a consumer starts failing | Ties the break to the deploy and the OpenAPI diff, proposes a rollback or a compatible fix |
| **Dependencies** | An SDK version you pin is deprecated, or will be soon | Opens an issue (later, a PR) before it breaks |

---

## Trust model

Autonomy is tiered and earned, never assumed.

- **Tier 0 — read-only.** Mendr detects drift, explains it, and proposes a fix in
  Slack or a GitHub issue. No write access anywhere. *This is the first release.*
- **Tier 1 — scoped, reversible actions.** For example: pin an upstream API
  version header, enable a configured fallback or circuit breaker, or roll back
  the deploy that broke your contract. Each action type is opted into
  separately, per service.
- **Tier 2 — code fixes.** Mendr opens a PR (client code updated for the new
  upstream shape, plus a regression test that reproduces the failure). Your
  tests and your reviewers decide. Mendr never has merge rights.
- **Tier 3 — escalate.** Anything ambiguous, low-confidence, or touching auth,
  payments, or data pages a human with full context attached.

---

## How it works

```
 OTel HTTP spans          upstream specs /           your repo
 (client + server)        changelogs                 (call sites)
        │                        │                        │
        ▼                        ▼                        ▼
 ┌─────────────┐   drift   ┌─────────────┐  context  ┌─────────────┐
 │  baseline   │ ────────▶ │   explain   │ ────────▶ │   propose   │
 │ per endpoint│  detected │ (what       │           │ (report, or │
 │ status/shape│           │  changed?)  │           │  PR at T2)  │
 └─────────────┘           └─────────────┘           └─────────────┘
                                                            │
                                         immutable audit log of every decision
```

1. **Baseline.** From OpenTelemetry HTTP client and server spans, Mendr learns
   what normal looks like per endpoint: status-code mix, latency, and
   (opt-in) response schema.
2. **Detect.** A new error class or a schema change on a previously stable
   endpoint is drift. Detection is statistical; no model is involved.
3. **Explain.** Mendr pulls the upstream's OpenAPI spec diff or changelog (or your
   own spec diff between deploys) and finds the call sites in your code that
   depend on the changed fields. This is where the LLM is used.
4. **Propose.** Tier 0 posts a report. Higher tiers act, within the scope you
   granted.

---

## Getting started

Not installable yet. Planned onboarding:

1. Point your existing OTel HTTP instrumentation at Mendr. Most stacks already
   emit the client and server spans it needs.
2. Optionally enable response-schema capture. Bodies are reduced to shapes
   (field names and types) at the edge, so values and PII never leave your
   service.
3. Connect Slack or GitHub for Tier 0 reports.
4. Opt in to higher tiers per action, per service, once Tier 0 has earned it.

---

## Design principles

- **Autonomy is opt-in, per action.** No global "enable autonomy" switch.
- **Mendr proposes; your gates decide.** No merge rights, no broad standing
  credentials — only the minimum permissions each allowlisted action needs.
- **Untrusted input stays untrusted.** Response bodies, error messages, and
  upstream changelogs are data for diagnosis, never instructions. Policy limits
  what Mendr can do, regardless of what any model suggests.
- **Every decision is audited.** Each detection, proposal, and action writes an
  append-only, queryable record: what was observed, what changed, what was done,
  and why.
- **Verification is mechanical.** A fix counts only when tests pass and the
  endpoint that drifted returns to its baseline — never on a model's "looks fine".

---

## Roadmap

- [ ] Ingest OTel HTTP client/server spans; per-endpoint baselines
- [ ] Drift detection: new error classes, latency shifts, rate-limit changes
- [ ] Opt-in response-shape capture with edge redaction
- [ ] Upstream spec/changelog diffing for common providers
- [ ] Call-site mapping in your repo
- [ ] Tier 0 reports to Slack / GitHub issues
- [ ] Own-contract checks: OpenAPI diff between deploys
- [ ] Tier 1 actions (version pinning, fallbacks, rollback)
- [ ] Tier 2 PRs with regression tests

---

## Contributing

Not yet open for external contributions — core interfaces are still in flux.
Design feedback is welcome once the first working version lands.

## License

MIT
