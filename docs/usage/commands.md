---
layout: page
title: Slash commands
parent: Usage
nav_order: 2
permalink: /docs/usage/commands/
---

| Command | Menu label | Description |
| --------- | ----------- | ------------- |
| `/model` | Select model | Pick the active model |
| `/provider` | Add provider | Add a new LLM provider |
| `/sessions` | Switch session | Resume or delete past sessions |
| `/new` | New session | Start a fresh conversation |
| `/tree` | Session tree | Walk the tree, fork from a node |
| `/scene` | Switch scene | Pick the scene the agent runs under (`/scene <name>`) |
| `/variant` | Select variant | Pick the model's reasoning effort (`/variant HIGH`) |
| `/title` | Edit title | Rename the current session (`/title My title`) |
| `/gen-title` | Generate title | Draft the session title with the LLM |
| `/export` | Export session | Write the session to a JSON file (optional path) |
| `/undo` | Undo last turn | Fork before the last prompt |
| `/replay` | Replay last turn | Fork and re-run the last turn |
| `/reload` | Reload skills | Re-discover skills and commands without a restart |
| `/mcp` | MCP servers | Show MCP server connection states |
| `/mcp-reconnect` | Reconnect MCP | Reconnect an MCP server (`/mcp-reconnect <server>`) |
| `/sidebar` | Toggle sidebar | Collapse or expand the sidebar |
| `/search` | Search chat | Highlight text in the chat live (`/search <text>`) |
| `/quit` | Quit | Exit the program |

Some commands only appear when they apply: `/undo`, `/replay` and `/tree`
need messages in the chat, `/scene` is hidden while a reply is streaming,
and `/title`, `/gen-title` and `/export` need an active session
(`/gen-title` also needs a first prompt).

<kbd>Ctrl+M</kbd> opens the same commands as a searchable menu.

## Custom commands

Commands are also plain files: a directory holding a `command.md` under
`commands/` in the workspace `.shuvarie/` directory (or in the global config
directory) becomes a slash command named after the directory. The optional
YAML frontmatter overrides the menu `title` and the `model`
(`<provider>/<model>`) used for the turn; the body is the prompt template,
and `{{arguments}}` is replaced by whatever was typed after the command
name (the raw arguments are appended after a blank line when the
placeholder is missing):

```markdown
---
title: Commit code
model: anthropic/claude-x
---

Commit {{arguments}} with conventional commits.
```

Workspace commands win over global ones with the same name, and a name that
collides with a built-in command is invoked as `custom:<name>` (the built-in
keeps the plain alias). Custom commands appear in the <kbd>Ctrl+M</kbd>
menu and are re-read by `/reload`.
