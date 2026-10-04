---
layout: page
title: Skills
parent: Configuration
nav_order: 4
permalink: /docs/configuration/skills/
---

Skills are reusable prompts and procedures. This section toggles them and
adds extra search directories:

```kdl
skills {
    disabled #true      // presence + #true = skills off (bare form is a no-op)
    dirs "~/my-skills"  // extra skill directories
}
```

Built-in search order: workspace `.agents/skills` (trust-gated), the global
`skills/` directory, `~/.agents/skills`, then the extra `dirs`. Invoke a
skill from the prompt with `/skill:<name>` — see
[the prompt](/docs/usage/cli/#the-prompt).
