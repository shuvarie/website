---
layout: page
title: Configuration files
parent: Configuration
nav_order: 1
permalink: /docs/configuration/files/
---

## File locations

| File | Path | Notes |
| ------ | ------ | ------- |
| Global config | `~/.config/shuvarie/config.kdl` | Always loaded |
| Workspace config | `./shuvarie.kdl`, then `./.shuvarie/config.kdl` | Loaded only when the workspace trust grants the **Configs** category |
| Explicit config | `--config <FILE>` | Loads exactly this file; a missing file is an error |
| Connections | `~/.config/shuvarie/connections.kdl` | Providers, API keys and decision-model connections — keep it private |
| Trust records | `~/.config/shuvarie/trusts.kdl` | Written by the trust prompt |
| Global session store | `~/.local/share/shuvarie/data.db` (with `session-dir.kdl`) | Sessions for every workspace, with `db { global-store #true }` |
| Custom commands | `commands/<name>/command.md` in the workspace `.shuvarie/` dir or the global config dir | One directory per command; workspace copies win — see [Slash commands](/docs/usage/commands/) |
| Drop-in dirs | `scene.d/`, `themes.d/` next to each config level | Every sorted `*.kdl` file is loaded; broken files are skipped with a warning |

Debug builds keep a parallel hall — `~/.config/shuvarie-dev/`,
`./.shuvarie-dev/`, `shuvarie-dev.kdl` — that never shares with a release
build.

## Precedence

For each top-level section, the highest layer that defines it wins wholesale
(`./shuvarie.kdl` → `./.shuvarie/config.kdl` → global). Exceptions:
`lsp.servers` and `registries` merge key-by-key, `permissions` rule lists
stack (the built-in baseline sits deepest), and `scenes`/`themes` merge
field-wise per name. Defining the same scene or theme name twice within one
layer loads neither copy. Unknown sections are ignored; duplicate keys are
an error.

## Accepted sections

`ui`, `db`, `embedding`, `agent`, `attachments`, `lsp`, `skills`,
`default-providers`, `context`, `shell`, `registries`, `tools`, `codemode`,
`permissions`, `decisions`, `ranking`, `scenes`, `themes`, `retry` — each is
covered on a subsection page: [Interface](/docs/configuration/ui/),
[Agent & context](/docs/configuration/agent/),
[Skills](/docs/configuration/skills/),
[Tools & integrations](/docs/configuration/tools/),
[Codemode](/docs/configuration/codemode/),
[Attachments](/docs/configuration/attachments/),
[Providers & models](/docs/configuration/providers/),
[Scenes](/docs/configuration/scenes/),
[Permissions](/docs/configuration/permissions/) and
[Decisions](/docs/configuration/decisions/).

## Turning a section on or off

An `enabled`/`disabled` node is a toggle that takes an **optional boolean
argument**: `disabled #true` turns the feature off, `enabled #true` turns it
back on, and a bare `disabled`/`enabled` keeps the block's default (it is a
no-op). A few sections are off by default — `decisions` and `ranking` are the
notable ones — and opt in with `enabled #true`. The lone exception is the
title `auto-gen` node, a true bare switch: its presence alone turns it on.
