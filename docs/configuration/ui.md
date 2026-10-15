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

## notify

Inside `ui`. What Shuvarie does when an agent turn ends — a desktop
notification sent through the terminal (OSC 9) and, optionally, a sound:

```kdl
ui {
    notify {
        disabled #true            // #true turns the toast off (it is on by default)
        sound                     // opt into audio; the bare switch turns it on
        sound-file "/path/ding.oga"        // file for a completed turn
        error-sound-file "/path/err.oga"   // file for a failed turn
    }
}
```

The toast is **on** by default and switched off with `disabled #true`. It
announces a completed turn as `Shuvarie — agent completed: <session title>`
(or a failed one as `Shuvarie — agent error: …`) through the terminal's
OSC 9 notification — the form iTerm2 introduced and kitty, Ghostty, WezTerm,
foot, Konsole and Windows Terminal understand; a terminal without it simply
ignores the sequence. Only a turn that ends notifies: a retry that is still
being scheduled does not.

The sound is **off** by default and opted into with the `sound` switch;
`sound-file` and `error-sound-file` only pick the files — they do not turn
the sound on — so `sound` alone plays the platform's own defaults: the
desktop sound theme on Linux
(`/usr/share/sounds/freedesktop/stereo/complete.oga`, and KDE's
`ocean/stereo/dialog-error.oga` for failures), the `Glass` and `Basso`
system alerts on macOS, and the Windows `notify` / `Critical Stop` wavs.
Naming a file replaces its list rather than adding to it.

Playback is strictly best-effort: the file is handed to whichever audio
player the host has (`paplay`, `pw-play`, `ffplay` or `mpv` on Linux,
`afplay` on macOS, PowerShell's `SoundPlayer` on Windows) and a missing file
or player is simply silent — never a failed turn.

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
