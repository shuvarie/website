---
title: Codemode
description: "One tool that runs Rhai, and the script calls the rest."
group: Configuration
order: 6
---

## codemode

Codemode turns the tool roster into one tool: instead of emitting N tool
calls and reading N results, the model writes a
[Rhai](https://rhai.rs) script and the script calls the tools. Intermediate
results stay inside the script, so several dependent calls cost one round
trip and one summary — filter, join, page and check first, then return only
what is worth reading.

```kdl
codemode {
    // disabled #true     // #true turns the tool off, #false (or no node) offers it,
    //                    // "auto" offers it only on turns that have a configured
    //                    // tool or an MCP server to orchestrate
    mode "declare-builtin"  // default: builtins stay, configured tools go script-only
    inline-budget 3000   // estimated tokens of inlined tool declarations;
                         // whatever does not fit is still callable, by name
    timeout-ms 0         // wall-clock budget for one script; 0 = none
    max-operations 0     // Rhai operations per script; 0 = unlimited
    max-tool-calls 0     // nested tool calls per script; 0 = unlimited
    store #true          // whether `store`/`load` exist
    tools { tool "run_shell" { disabled #true } }  // tools a script may not run
}
```

The tool is **offered by default**; the file only says something when you
want less. The result is capped by
[`context.tool-output-max-chars`](/docs/configuration/agent), like every
other tool's.

## What a script sees

The model's own roster is not the script's roster: `codemode` builds a
catalog from the same turn's tools, and `mode` decides how much of it the
model also sees directly.

| `mode` | the model sees | a script reaches |
| -------- | ---------------- | ------------------ |
| `declared` | every tool, described as scriptable | every tool |
| `declare-builtin` (default) | the built-ins only | every tool |
| `only` | `codemode` alone | every tool |

`declare-builtin` is the split that pays for itself: the built-ins are few
and stable (`read_file`, `edit_file`, `grep`, `run_shell`, …), while a
connected MCP server or a pile of configured `tool` subprocesses is where
the roster bloats into dozens of schemas the model rarely calls — and where
a typed call in a script reads better than one schema per tool. The catalog
states the split rather than leaving it to be inferred: a tool the model
cannot call directly is marked `script only`.

A tool a script may not run (see `codemode { tools { … } }` below) never
leaves the model's roster: hiding it as well would make it reachable by
neither route.

## The call surface

Tools are namespaced, one map argument in, one value out:

```rhai
let src = tools::read_file(#{ path: "src/main.rs" });
let hits = tools::grep(#{ pattern: "fn main", path: "src" });
let lines = hits.split("\n").filter(|line| line.starts_with("src/"));
`main.rs is ${src.len} characters; ${lines.len} lines matched`
```

MCP tools get real namespaces — `mcp::<server>::<tool>` — rather than the
composite name they dispatch by. Rhai identifiers cannot contain `-`, so
`resolve-library-id` is called as `resolve_library_id`; the catalog always
prints the callable name.

Globals: `text(value)` (emit a value), `console.log/info/warn/error/…`
(captured, shown in the result), `exit(value)`, `return` (a top-level
`return` is the script's value), `store(key, value)` / `load(key)` for JSON
state across scripts, and `ALL_TOOLS`, `search_tools(query, #{ limit,
namespace })`, `describe_tool(name)` and `describe_namespace(name)` for what
the catalog's inline budget left out.

Rhai is a **capability** sandbox, not an OS one: a script has no filesystem,
network, clock or process access, and `import` resolves nothing — but it can
call `run_shell` if the roster allows it. The permission layer, not the
language, is the boundary.

## What you see

A script's calls are **real tool calls**: they pass through the same
permission gates, so an ask mid-script is the ordinary prompt and a denial is
a catchable error. They are also **silent** — no transcript blocks, sidebar
rows or session records of their own. A turn shows one `codemode` block per
script, leading with the script as highlighted code (three lines while
collapsed), then the script's value, its console output, and a
`Tool calls (N)` trace naming each call with its arguments, duration and
outcome. That trace is stored with the result, so a reloaded session reads
exactly like the live one.

The model is told what the tool is for on the turns that offer it: scripts
for multi-step work and for `script only` tools, a direct call for everything
else. The full language reference ships in the binary as a built-in
`codemode` [skill](/docs/configuration/skills) (`/skill:codemode`), marked
`(builtin)` in the sidebar; a `codemode` skill directory of your own replaces
it.

## The `/codemode` overlay

[`/codemode`](/docs/usage/commands) edits the three switches you change
while working — **Offered** (`on`, `auto`, `off`), **Roster** (the mode
above) and **Keep state** (`store`) — and shows the limits, which stay in
`shuvarie.kdl` on purpose. A change is written straight back to your config
file and applies from the next turn.

## Limits

- `timeout-ms`, `max-operations` and `max-tool-calls` bound a runaway
  script; `0` leaves each unset.
- `store #true` keeps `store`/`load` values in memory for the running
  process — they survive between scripts, not across restarts.
- `codemode` never orchestrates itself (no recursion), and it is not offered
  to a subagent worker.
- A scene can drop it like any other tool:
  `tools { disable-all; tool "codemode" { disabled #false } }`.

The nested calls are not re-implementations: permissions, scene asks, file
locks, LSP notifications and `read_file`'s per-turn cache behave exactly as
they do for a direct call.
