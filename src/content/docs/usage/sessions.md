---
title: Sessions
description: "Resume, fork, export and import a session tree."
group: Usage
order: 4
---

Sessions live in an embedded SQLite database at `<project>/.shuvarie/`
(auto-gitignored; the `WORK_DIR` argument relocates it). Set
`db { global-store #true }` to keep them in one shared store
(`~/.local/share/shuvarie/data.db`) instead — see
[Configuration files](/docs/configuration/files). A session is
created by your first prompt — titled from it — and every message, tool
call and scroll position is persisted immediately, so killing the terminal
loses nothing.

- **Resume** with `shuvarie -c`, `shuvarie -s <UUID>`, or `/sessions`,
  where the query row takes the first keystroke: typing filters titles
  (fuzzy, best match first), <kbd>↑</kbd>/<kbd>↓</kbd> move, <kbd>Enter</kbd>
  resumes, <kbd>Ctrl+D</kbd> deletes (then again to confirm) and
  <kbd>Ctrl+O</kbd> starts a new session without one to resume.
- **Every tab has its own session.** A session belongs to the tab whose
  workspace it lives in, and the picker lists the sessions of the workspace on
  screen — see [Tabs](/docs/usage/tabs).
- **Titles.** New sessions are titled from the first prompt. `/title`
  renames them, [`/gen-title`](/docs/usage/commands) drafts one with the
  LLM, and `ui { title { auto-gen } }` drafts automatically — see
  [Interface](/docs/configuration/ui).
- **One knight per horse**: a session locks while it is open elsewhere, and
  the picker marks it *in use*.
- **Failures are resumed, not replayed.** A turn cut by an error keeps what
  it already produced — the partial reply and every tool call that returned —
  on the session's active path, and the [retry](/docs/configuration/agent)
  continues from there: the tool calls it still needs are re-issued, the
  prompt is not sent again as a new request, and the retried reply fills in
  the same turn. An interrupted turn (<kbd>Esc</kbd> <kbd>Esc</kbd>) keeps
  its partial reply and finished tool calls too, so resuming the session
  carries on with the work that was done rather than from the prompt. Quitting
  mid-turn is the same: the turn is cut and what it produced is persisted
  before the core shuts down.
- **History is a tree.** `/undo` forks before the last prompt, `/replay`
  forks and re-runs it, and `/tree` walks the whole tree — <kbd>Enter</kbd>
  forks from a node, `s` summarizes the forked-away prefix, `d` deletes the
  selected row's subtree (confirmed) and the selection stays on its parent, so
  deleting the row you are on rewinds the active path to where it branched
  from. Files on disk are never reverted.
- **Compaction.** When the input budget is exceeded, older history is
  summarized automatically; `/compact [instruction]` runs it on demand —
  see [Agent & context](/docs/configuration/agent).
- **Export / import.** `/export [path]` (or `shuvarie export [DEST]`)
  writes a self-contained JSON snapshot; `shuvarie import <FILE>` restores
  one. [Embeddings](/docs/configuration/providers) are regenerated on
  import.
- **Assisted-By.** `/assisted-by` shows the models that served the session
  as an `Assisted-By:` trailer — the catalog's `org/model` codes, or the
  configured id for a model the catalog does not know, in first-use order
  with the first non-default scene that used each one;
  <kbd>Enter</kbd> copies it.
