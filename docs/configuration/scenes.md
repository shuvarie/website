---
layout: page
title: Scenes
parent: Configuration
nav_order: 9
permalink: /docs/configuration/scenes/
---

A *scene* is the agent's mission profile: its system prompts, sub-agents and
tool gates.

## Built-in scenes

Four scenes ship in the binary. A scene's built-in fields are the **bottom
layer**: a configured scene of the same name overrides only the fields it
sets.

| Scene | Description | Roster & tools |
| ------- | ------------- | ---------------- |
| **Default** | Plain coding behavior, no scene configured | Full tool roster; all subagents |
| **Advisor** | Advice and planning: inspection and research only, no modifications | Read-only tools; `run_tests`/`edit_files` disabled |
| **Reviewer** | Code review: read the code, run checks, report findings without applying them | Read-only tools plus `run_shell`; `edit_files` disabled |
| **Orchestrator** | Agent orchestration: decompose the task, delegate to subagent workers, verify, integrate | Full tool roster; `tool-concurrency 4`; extra `architect`, `critic`, `scout` read-only workers |

The built-in subagent workers are **`explore_workspace`** (read-only
research), **`run_tests`** (build/test/lint commands) and **`edit_files`**
(write files). The Orchestrator adds a planning bench of read-only workers
on top.

## Declaring a scene

```kdl
scenes {
    default "Plan"  // scene used for new sessions
    scene name="Plan" {
        description "Read and plan before touching code"
        system-prompts { prelude "Think before you act." }
        tools {
            ask-all
            tool "edit_file" { disabled #true }
        }
    }
}
```

Scene fields:

- `description "…"` — free text shown in the picker.
- `system-prompts { … }` — `prelude "…"` replaces the agent preamble,
  `interlude "…"` is injected once when the scene is entered mid-session,
  and `before-each { … }` / `after-each { … }` wrap every message with
  `user-prompt "…"`, `assistant-prompt "…"` and `turn "…"` hooks.
- `tools { … }` — one verb, `enable-all` (default), `ask-all` or
  `disable-all`, plus per-tool overrides: `tool "a" "b" { disabled #true }`
  or `tool "…" { ask #true }`. Under `disable-all`, re-enable a tool with
  `disabled #false` / `enabled #true`.
- `subagents { … }` — the worker roster. `disabled #true` empties it
  entirely; a named child overrides a built-in worker or defines a new one.
  A worker takes `description "…"`, `toolset "none|read|command|edit"`
  (default `read`), `disabled`/`enabled`, `thinking`, and its own
  `system-prompts` and `tools` blocks.
- `ranking { … }` — how the scene ranks the `question` tool's options —
  see [Decisions](/docs/configuration/decisions/).
- `tool-concurrency N` — how many tool calls from one assistant message run
  at once (default `1`, sequential).
- `thinking #true` — reserved for future use; it round-trips but does
  nothing yet.

```kdl
scenes {
    scene name="Squad" {
        description "Write, then have a reviewer look"
        tool-concurrency 4
        subagents {
            edit_files { toolset "edit" }
            inspector {
                description "Check the diff for regressions"
                toolset "read"
            }
        }
    }
}
```

Scenes can also be dropped in as `scene.d/*.kdl` files next to any config
level. Switch scenes live with [`/scene`](/docs/usage/commands/).

## Mid-session switching

[`/scene`](/docs/usage/commands/) can only switch into a scene that defines
a non-empty `system-prompts { interlude """…""" }` — scenes without one are
start-only and dimmed (marked *no interlude*) in the picker. The interlude
is a system prompt injected once, at the top of the outgoing history of the
first request after the switch, marking the transition. The built-in
**Default** scene always carries one, so it can be re-entered at any time.
