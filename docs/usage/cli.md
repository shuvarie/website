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
- `/skill:<name> [args]` expands a
  [skill](/docs/configuration/skills/) into its stored prompt and sends it.
- Type `@path` to attach a document or image (see
  [Attachments](/docs/configuration/attachments/)); a completion popup
  offers matching paths as you type.
