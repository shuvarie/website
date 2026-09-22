---
layout: page
title: Scenes
parent: Configuration
nav_order: 7
permalink: /docs/configuration/scenes/
---

A *scene* is the agent's mission profile: its system prompts, sub-agents and
tool gates. The built-in scene, **Default**, is plain coding behavior.

```kdl
scenes {
    default "Plan"  // scene used for new sessions
    scene name="Plan" {
        description "Read and plan before touching code"
        system-prompts { prelude "Think before you act." }
        tools {
            ask-all
            tool "edit_file" { disabled }
        }
    }
}
```

Scene fields: `description`, `subagents` (per-sub-agent overrides),
`system-prompts` (`prelude`, `interlude`, `before-each`/`after-each` turn
hooks) and `tools` (`enable-all`/`ask-all`/`disable-all` plus per-tool
`disabled`/`ask`). `thinking #true` is reserved for future use. Switch
scenes live with [`/scene`](/docs/usage/commands/).

**Mid-session switching.** [`/scene`](/docs/usage/commands/) can only
switch into a scene that defines a non-empty
`system-prompts { interlude """…""" }` — scenes without one are start-only
and dimmed in the picker. The interlude is a system prompt injected once, at
the top of the outgoing history of the first request after the switch,
marking the transition. The built-in **Default** scene always carries an
interlude, so it can be re-entered at any time.
