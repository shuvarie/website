---
title: Decisions
description: "System One-style decision models that answer permission asks."
group: Configuration
order: 11
---

Decision models answer named, typed questions — they are **not** generative
completions (no streaming, no tools, no free text) and do **not** ride the
LLM provider path. They have their own connection (see
[`decision-providers`](/docs/configuration/providers#decision-providers))
and their own client.

The feature is **off by default** — it reaches a network endpoint — so it
stays inert until `decisions { enabled #true }` opts in. Decision checks are
used by [permission rules](/docs/configuration/permissions#decision-checks).

## decisions

Each `decision` is a named, reusable question:

```kdl
decisions {
    enabled #true
    decision "is-this-safe" {
        type "noul"                        // probability the answer is yes
        instructions "Decide whether this shell command is safe to run."
        yes "The command is safe."
        no "The command is risky."
    }
    decision "pick-verb" {
        type "choice"
        instructions "Pick how the tool call should be treated."
        option "read-only" { description "Reads only; allow it." }
        option "destructive" { description "Changes state; deny it." }
    }
    decision "severity" {
        type "score"
        instructions "Rate the severity of the finding."
        level "info"
        level "warn" { description "Worth a look." }
        level "error"
    }
}
```

- `type` is required: `noul` (a yes/no judgment), `choice` (pick one
  labeled option) or `score` (rank ordered levels).
- `instructions` is required and must be non-empty.
- `noul` takes optional `yes` / `no` descriptions (both or neither).
- `choice` takes one or more `option "label" { description "…" }`.
- `score` takes one or more `level` children, lowest first; each level is
  either the wire text itself (`level "…"`) or a local label with a
  description (`level "warn" { description "…" }`).

`noul` answers are probabilities in `0..=1` (not booleans), and `confidence`
is the distribution's concentration — **not** the chance the answer is
correct. Threshold policy belongs to the caller (the permission check's
`threshold`).

## ranking

`ranking` names which `decision` ranks the options the `question` tool
asks about. It is cosmetic and off unless a decision is named:

```kdl
ranking {
    decision "severity"
}
```

A scene can override the top-level `ranking` in its own block — see
[scenes](/docs/configuration/scenes).

## The provider dialog

[`/decision-provider`](/docs/usage/commands) opens the only model-selection
surface for decision models (name, endpoint, optional key, free-text model),
because no registry enumerates decision models. It writes the
`decision-providers` and `decision` blocks to
[`connections.kdl`](/docs/configuration/providers).
