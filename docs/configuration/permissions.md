---
layout: page
title: Permissions
parent: Configuration
nav_order: 9
permalink: /docs/configuration/permissions/
---

Three verbs — `allow`, `ask` (prompt in the TUI), `deny` — applied to file
paths and shell commands separately:

```kdl
permissions {
    ask-all                // top-level fallback verb
    paths {
        allow-all          // scope fallback (else the top-level verb)
        allow "./"                                  // relative to the cwd; ~/ to home
        allow mode="ro" "~/.cargo/registry/"        // ro = reads only (default rw)
        deny exact="#true" "~/.ssh/id_ed25519"      // exact path only (default: whole subtree)
        allow except-hidden="#true" "./"            // ignore the rule when a hidden path component is below it
    }
    shell-patterns {
        ask-all
        deny "sudo"                          // literal: word-boundary match, whitespace collapsed
        deny pattern="regex" "rm (-rf|-fr)"  // regex, matched as written
        allow "git status" "git diff"        // several args = one rule each
    }
}
```

## Built-in baseline

Out of the box the built-in rules sit at the **deepest** end of the merged
chain: the top-level verb is `ask`, shell commands are `allow`ed, and these
paths are `allow`ed in order — `.shuvarie` (the workspace dir), `.agents`,
`.git`, `.gitignore`, `.gitattributes`, `.gitmodules`, `.github`, `.gitlab`,
`.gitea`, `.forgejo`, and finally the working directory except hidden files.
A config layer stacks its own rules on top; the `*-all` verbs come from the
highest layer that sets them.

Rules are evaluated in declaration order, then the scope fallback
(`paths`/`shell-patterns` `*-all`), then the top-level verb, then `ask`.
Extra `deny` shell-patterns also watch command *output* and cut the turn
when they match. Scenes can tighten this further per-tool
(`tools { ask-all }`) — see [scenes](/docs/configuration/scenes/).
Custom stdio tools and MCP tools (`mcp__<server>__<tool>`) ask for every
call by default; a grant can be remembered by name for the session.

## Decision checks

Before a shell command (or a generic tool call) is acted on, an optional
[decision model](/docs/configuration/decisions/) can be consulted. A check
costs a model call, so it is opt-in:

```kdl
permissions {
    shell-patterns {
        check "git push" { decision "is-this-safe" }   // a `noul` decision
        check-all { worker "run_tests" }               // or a subagent worker
    }
    tool-check {
        decision "pick-verb"                           // a `choice` decision
        allow "read-only" "safe"
        ask "needs-review"
        deny "destructive"
    }
}
```

- `check "<pattern>"…` / `check-all` take either a `decision "<name>"` or a
  `worker "<name>"` child. Props: `pattern="raw|regex"` (default raw),
  `on-error="allow|ask|deny"` (default `ask`) and, for decisions only,
  `threshold` (a probability in `0..=1`, default `0.5`). Checks are
  tighten-only: they never spend a call on a command already denied by a
  rule.
- `tool-check` names a `decision "<name>"` and maps its option labels to
  `allow` / `ask` / `deny`; `on-error` sets the fallback verb. The decision
  and labels are validated by the decision service, not at parse time.

The Shuvarie repository itself
uses one: [`shuvarie.kdl`](https://github.com/shuvarie/shuvarie) in its
root.
