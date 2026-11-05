---
title: Tabs
description: "Run several agents at once, each in its own workspace, and switch between them."
group: Usage
order: 6
---

## A tab is an agent

A tab is not a view of the same conversation: it is a **separate agent**, with
its own workspace, its own core task, its own session and its own composer.
Switching tabs switches who you are talking to. Nothing is suspended — a
background tab's turn keeps streaming, its tools keep running, and its chat
fills in while you work somewhere else. The desktop
[notification](/docs/configuration/ui#notify) for a finished turn still fires
from a tab you are not looking at.

The strip is one row and only appears once there is something to choose
between; a single-tab session paints exactly as it did before tabs existed. An
entry reads `<number> <label>`, the label being the session's title or — before
there is a session — the workspace directory's name, with a `●` while that
agent is busy. The active entry is the one with a background. When the strip
does not fit, the window is anchored on the active tab and the dropped runs
collapse to `…`.

## Opening and closing

- [`/newtab [path]`](/docs/usage/commands) opens another agent. Without a path
  it inherits the active tab's workspace, which makes it the way to get a
  second *conversation* in the same project; a path runs it somewhere else. `~`
  expands, and a relative path resolves against the directory `shuvarie` was
  started in — a tab never moves the process's working directory, since that
  would move the ground under every other tab.
- `/closetab` stops the tab's agent: a turn still streaming is cancelled (it
  must not keep talking, and billing, with nowhere to deliver), and its LSP
  servers and MCP connections stop with it.
- The **last** tab stays open — closing it would leave nothing to draw, so
  `/closetab` says so instead; `/quit` is what exits the program.

## Switching

| Key | Action |
| ----- | -------- |
| <kbd>Alt</kbd>+<kbd>←</kbd> / <kbd>Alt</kbd>+<kbd>→</kbd> | Cycle back / forward, wrapping at the ends |
| <kbd>Alt</kbd>+<kbd>1</kbd> … <kbd>Alt</kbd>+<kbd>9</kbd> | Jump to that position in the strip |

Both are gated on there being more than one tab, so with a single tab every
chord the composer had before tabs existed is still the composer's.

## What is per tab, what is shared

Per tab, because it belongs to a workspace:

- the working directory every tool resolves against, `run_shell`'s default cwd,
  the context files, and the permission rules built on that root;
- the config chain — so `/scene` offers *that* project's scenes, and a new
  session starts under *that* tab's default scene;
- the session store (`<workspace>/.shuvarie/` or the shared global one),
  the conversation, the composer draft and its pending attachments.

Shared, because it belongs to you:

- [`connections.kdl`](/docs/configuration/providers) — one active provider and
  model, so the sidebar can never show a model the turn did not run on;
- the `ui` prefs (theme, sidebar, notifications), the command menu, the model
  and theme pickers, and the Selune catalog.

Commands follow that split. Connection and preference commands — `/model`,
`/provider`, `/variant`, `/theme`, `/reload` and friends — reach **every**
tab's agent, so a background tab does not keep running on a model its sidebar
no longer shows. Session commands — a send, `/undo`, `/tree`, `/compact`,
`/export` — go to the tab on screen.

## Trust

Opening a tab **never** prompts: a key press must not yank the terminal into a
dialog. The workspace's recorded [trust](/docs/usage/trust) decision is used
when it has one, and otherwise the tab inherits the grants the startup workspace
was given.

## Limits

- Tabs are process state: there is no restoring them across restarts. `-c` and
  `-s` resume one session into the first tab.
- Each tab is a full agent — its own LSP manager and MCP connections, started
  lazily. An idle tab is cheap; a tab that has used `lsp` or an MCP server holds
  those resources until it is closed.
