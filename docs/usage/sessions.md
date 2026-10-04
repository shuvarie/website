---
layout: page
title: Sessions
parent: Usage
nav_order: 4
permalink: /docs/usage/sessions/
---

Sessions live in an embedded SQLite database at `<project>/.shuvarie/`
(auto-gitignored; the `WORK_DIR` argument relocates it). Set
`db { global-store #true }` to keep them in one shared store
(`~/.local/share/shuvarie/data.db`) instead — see
[Configuration files](/docs/configuration/files/). A session is
created by your first prompt — titled from it — and every message, tool
call and scroll position is persisted immediately, so killing the terminal
loses nothing.

- **Resume** with `shuvarie -c`, `shuvarie -s <UUID>`, or `/sessions`
  (<kbd>Enter</kbd> resume, <kbd>N</kbd> new, <kbd>Ctrl+D</kbd> delete with
  confirmation).
- **Titles.** New sessions are titled from the first prompt. `/title`
  renames them, [`/gen-title`](/docs/usage/commands/) drafts one with the
  LLM, and `ui { title { auto-gen } }` drafts automatically — see
  [Interface](/docs/configuration/ui/).
- **One knight per horse**: a session locks while it is open elsewhere, and
  the picker marks it *in use*.
- **History is a tree.** `/undo` forks before the last prompt, `/replay`
  forks and re-runs it, and `/tree` walks the whole tree — <kbd>Enter</kbd>
  forks from a node, `s` summarizes the forked-away prefix, `d` deletes a
  branch (confirmed). Files on disk are never reverted.
- **Compaction.** When the input budget is exceeded, older history is
  summarized automatically; `/compact [instruction]` runs it on demand —
  see [Agent & context](/docs/configuration/agent/).
- **Export / import.** `/export [path]` (or `shuvarie export [DEST]`)
  writes a self-contained JSON snapshot; `shuvarie import <FILE>` restores
  one. [Embeddings](/docs/configuration/providers/) are regenerated on
  import.
- **Assisted-By.** `/assisted-by` shows the models that served the session
  as an `Assisted-By:` trailer; <kbd>Enter</kbd> copies it.
