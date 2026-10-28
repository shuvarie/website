---
title: Workspace trust
description: "What Shuvarie may read out of your workspace, and how it remembers."
group: Usage
order: 5
---

On the first run in a workspace, Shuvarie scans it for things it could load
and asks what to trust:

| Category | What it covers |
| ---------- | ---------------- |
| **Contexts** | `AGENTS.override.md`, `AGENTS.md`, `CLAUDE.md` (in that precedence), plus `.shuvarie/context/*` |
| **Skills** | Skills in `.agents/skills` |
| **Configs** | `shuvarie.kdl`, `.shuvarie/config.kdl`, `scene.d/*.kdl`, `themes.d/*.kdl` |

The prompt shows checkboxes (all pre-checked). Keys: <kbd>↑</kbd>/<kbd>↓</kbd>
or `j`/`k` select, <kbd>Space</kbd> toggles, `a` trusts all, `n` trusts none,
<kbd>Enter</kbd> records the decision, <kbd>Esc</kbd> skips for this session
only, `q` quits.

Decisions persist in `~/.config/shuvarie/trusts.kdl`. A trusted workspace
loads silently on later runs, re-prompting only when *new* files show up in
a category you hadn't granted. `shuvarie --config <file>` sidesteps the
Configs category entirely.
