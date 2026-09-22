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
| Connections | `~/.config/shuvarie/connections.kdl` | Providers and API keys — keep it private |
| Trust records | `~/.config/shuvarie/trusts.kdl` | Written by the trust prompt |
| Custom commands | `commands/<name>/command.md` in the workspace `.shuvarie/` dir or the global config dir | One directory per command; workspace copies win — see [Slash commands](/docs/usage/commands/) |
| Drop-in dirs | `scene.d/`, `themes.d/` next to each config level | Every sorted `*.kdl` file is loaded; broken files are skipped with a warning |

## Precedence

For each top-level section, the highest layer that defines it wins wholesale
(`./shuvarie.kdl` → `./.shuvarie/config.kdl` → global). Exceptions:
`lsp.servers` and `registries` merge key-by-key, `permissions` rule lists
stack, and `scenes`/`themes` merge field-wise per name. Defining the same
scene or theme name twice within one layer loads neither copy. Unknown
sections are ignored; duplicate keys are an error.

## Accepted sections

`ui`, `embedding`, `agent`, `lsp`, `skills`, `context`, `shell`,
`registries`, `tools`, `permissions`, `scenes`, `themes`, `retry` — each is
covered on a subsection page: [Interface](/docs/configuration/ui/),
[Agent & context](/docs/configuration/agent/),
[Skills](/docs/configuration/skills/),
[Tools & integrations](/docs/configuration/tools/),
[Providers & models](/docs/configuration/providers/),
[Scenes](/docs/configuration/scenes/) and
[Permissions](/docs/configuration/permissions/).

`disabled` nodes are bare switches everywhere: they take no arguments, and
their presence alone turns the section off (the old `disabled #true` form is
an error).
