---
layout: page
title: Permissions
parent: Configuration
nav_order: 8
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

Out of the box: everything in the workspace is allowed (hidden files
excluded), and shell commands are allowed. Rules are evaluated in
declaration order, then the scope fallback (`paths`/`shell-patterns`
`*-all`), then the top-level verb, then `ask`. Extra `deny` shell-patterns
also watch command *output* and cut the turn when they match. Scenes can
tighten this further per-tool (`tools { ask-all }`) — see
[scenes](/docs/configuration/scenes/).
Custom stdio tools and MCP tools (`mcp__<server>__<tool>`) ask for every
call by default; a grant can be remembered by name for the session.

The Shuvarie repository itself
uses one: [`shuvarie.kdl`](https://github.com/shuvarie/shuvarie) in its
root.
