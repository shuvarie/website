---
title: Skills
description: "Reusable procedures in markdown, invoked as `/skill:<name>`."
group: Configuration
order: 4
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
[the prompt](/docs/usage/cli#the-prompt).

A few skills ship **inside the binary** rather than on disk — today
`codemode`, the Rhai reference its tool leans on. They are listed in the
sidebar dimmed with a `(builtin)` label, cannot be edited, and are only
offered while the feature they describe is on — switching
[`codemode`](/docs/configuration/codemode) off removes it. A skill
directory of your own with the same name replaces the built-in one.
