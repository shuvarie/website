---
layout: page
title: Interface & themes
parent: Configuration
nav_order: 2
permalink: /docs/configuration/ui/
---

## ui

| Key | Default | Meaning |
| ----- | --------- | --------- |
| `frame-rate` | `60` | TUI frame-rate cap; `0` uncapped |
| `sidebar` | `auto` | `auto` (expanded when the terminal is ≥ 80 cols), `expanded` or `collapsed` |
| `copy-on-select` | `#false` | Copy text automatically when selected with the mouse |
| `theme` | `Faerun` | Name of a built-in or configured theme |

## image

Inside `ui`. Controls how attached images and previews are painted:

```kdl
ui {
    image {
        protocol "kitty"    // halfblocks | kitty | sixel | iterm2 (default: auto-detect)
        cell-size 10 20     // two pixel sizes (width, height), for image scaling
    }
}
```

## title

Inside `ui`. A new session is titled from its first prompt, capped at
`max-chars` (default 30). The `auto-gen` switch drafts the title with an LLM
right after the first prompt instead; the optional `llm` block carries the
settings for those calls (`provider` defaults to the active connection,
`model` to the provider's default small model, `system-prompt` to a built-in
prompt). [`/gen-title`](/docs/usage/commands/) re-drafts on demand, and an
explicit [`/title`](/docs/usage/commands/) rename wins over a draft:

```kdl
ui {
    title max-chars=30 {
        auto-gen
        llm {
            provider "Openai"
            model "gpt-5.6-luna"
            system-prompt """
            You name sessions briefly.
            """
        }
    }
}
```

`auto-gen` is a bare switch: its presence alone turns it on.

## themes

Shuvarie ships with five theme families, each with a variant per terminal
mode. `ui { theme "Name" }` picks one; when the name has both a dark and a
light variant, the one matching the terminal's background is chosen.

| Family | Variants |
| -------- | ---------- |
| **Faerun** | base (dark, the default), `light` |
| **Tokyo Night** | `night` (base), `storm` (dark), `day` (light) |
| **Kanagawa** | `wave` (base), `dragon` (dark), `lotus` (light) |
| **Ayu** | `dark` (base), `light` |
| **One** | `dark` (base), `light` |

[`/theme`](/docs/usage/commands/) picks a theme live with a preview. Define
your own in `themes { … }` or drop files into `themes.d/`; unset roles keep
their Faerun values. A `theme` node takes a `name` property, an optional
`variant` (part of the definition's key) and a `mode` (`dark` or `light`,
default `dark`) that auto-detection reads:

```kdl
themes {
    theme name="Midnight" mode="dark" {
        bg "#121216"
        accent "#d4af5f"
    }
    theme name="Midnight" variant="light" mode="light" {
        bg "#fafafa"
        accent "#8a6d1f"
    }
}
```

Colors accept `#rgb`, `#rrggbb` or bare `rrggbb`. Available roles: `bg`,
`surface`, `surface-focused`, `overlay`, `accent`, `accent-bg`, `selection`,
`text`, `text-dim`, `text-muted`, `prompt-bg`, `running-bg`, `success-bg`,
`warning-bg`, `error-bg`, `diff-add-bg`, `diff-add-emph-bg`, `diff-del-bg`,
`diff-del-emph-bg`, `success`, `warning`, `error`, and the code-renderer
roles `code-keyword`, `code-string`, `code-type`, `code-function`.
