---
layout: page
title: Command line & the prompt
parent: Usage
nav_order: 1
permalink: /docs/usage/cli/
---

## Command line

| Invocation | Meaning |
| ------------ | --------- |
| `shuvarie [WORK_DIR]` | Start a new session (optionally in another directory — the session database lives there too) |
| `-c`, `--current` | Resume the most recently updated session |
| `-s`, `--session <UUID>` | Resume a specific session by UUID |
| `--config <FILE>` | Use an explicit config file, bypassing the workspace-config trust scan |
| `shuvarie run <PROMPT>` | Run one prompt headlessly, without the TUI (see below) |
| `shuvarie import <FILE>` | Import a session JSON snapshot and exit |
| `shuvarie export [DEST]` | Export a session to JSON and exit (`-s` picks the session, default the most recent; an empty `DEST` picks an automatic path) |
| `shuvarie update` | Update the binary to the latest release |
| `-h`, `--help` | Show help |
| `-V`, `--version` | Show version |

When you quit, Shuvarie prints the exact command to reopen the session:

```
This session can be reopened with:

  shuvarie -s <session-uuid>
```

## Headless mode

`shuvarie run <PROMPT>` drives the agent with a single prompt and no TUI: it
is the same core, config and permission engine, with the terminal left
alone. The prompt is every word after `run`, joined with spaces.

```sh
shuvarie run fix the failing tests in src/parser
shuvarie -c run --permission-handle allow-all now commit it   # resume a session
```

The assistant's reply is streamed to **stdout** as it arrives, so it pipes
into `less`, a file or another program cleanly. Everything else — tool
activity, permission decisions, retries, warnings and the resume hint — goes
to **stderr**. A run that finishes cleanly (or is cancelled) exits `0`; a
failed turn exits non-zero. `-c`/`--session` resume a session first, exactly
as they do interactively.

| Flag | Meaning |
| ------ | --------- |
| `--permission-handle <MODE>` | How `ask` gates are answered: `allow-ask` (default, allow the single call), `deny-ask` (deny it, cutting the turn) or `allow-all` (allow and remember the scope for the rest of the run) |
| `-t`, `--transient` | Use an in-memory session database, so the run leaves nothing behind (cannot be combined with `-c`/`-s`) |
| `--trust <SPEC>` | The workspace trust this run starts under: `all`, `none`, or a comma-separated list of categories (`contexts,skills,configs`). Without it the recorded decision for the workspace is used, else nothing |

A headless run **never prompts** for workspace trust and never writes
`trusts.kdl`: it takes `--trust`, or the decision already recorded for the
directory. The `question` tool is not offered to the model in this mode, so
it cannot block on a dialog; a stray ask is dismissed with a warning.

## Updating

`shuvarie update` fetches the latest GitHub release, verifies the download
against the release's `SHA256SUMS` and swaps the binary in place — picking
the right build for your platform, including musl. When it finishes,
restart `shuvarie` to use the new version.

## The prompt

- <kbd>Enter</kbd> submits, <kbd>Shift</kbd>+<kbd>Enter</kbd> inserts a
  newline.
- A leading `!` runs the rest of the line as a **local shell command**
  instead of prompting the agent (bash mode).
- A leading `/` or `:` starts a **slash command**
  ([list](/docs/usage/commands/)). Matching is case-insensitive; type the
  trigger twice (`//`) to send a literal slash. An autocomplete menu
  appears as you type.
- A submit that opens with `/` or `:` but matches no built-in, custom or
  skill command is held back as a likely typo, with the prompt
  *“This might be an invalid slash command”*: <kbd>Enter</kbd> sends it as
  plain text anyway, <kbd>Esc</kbd> hands it back to the composer to keep
  editing.
- `/skill:<name> [args]` expands a
  [skill](/docs/configuration/skills/) into its stored prompt and sends it.
- Type `@path` to attach a document or image (see
  [Attachments](/docs/configuration/attachments/)); a completion popup
  offers matching paths as you type. A file dragged onto the terminal
  arrives as the same `@path` mention, and
  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> (or
  <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>) pastes an image straight off
  the system clipboard.
