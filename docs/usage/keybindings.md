---
layout: page
title: Keybindings
parent: Usage
nav_order: 3
permalink: /docs/usage/keybindings/
---

## Global

| Key | Action |
| ----- | -------- |
| <kbd>Ctrl+C</kbd> | Context-sensitive: copy the selection → clear the input draft → open the confirm-quit popup |
| <kbd>Ctrl+X</kbd> | Cut the selection |
| <kbd>Ctrl+M</kbd> | Open the command menu |
| <kbd>Ctrl+R</kbd> | Search your prompt history |
| <kbd>Ctrl+T</kbd> | Cycle the reasoning-effort variant |
| <kbd>Ctrl+W</kbd> | Toggle the sidebar |

## Editing

Standard Emacs keys in the input box: <kbd>Ctrl+B</kbd>/<kbd>F</kbd> move by
character, <kbd>Alt+B</kbd>/<kbd>F</kbd> by word, <kbd>Ctrl+A</kbd>/<kbd>E</kbd>
go to line start/end, <kbd>Ctrl+D</kbd>/<kbd>H</kbd>/<kbd>K</kbd>/<kbd>U</kbd>
delete or kill text. <kbd>Shift</kbd>+arrows/<kbd>Home</kbd>/<kbd>End</kbd>
select text for copy/cut.

<kbd>Up</kbd>/<kbd>Ctrl+P</kbd> recalls previously sent prompts and stashed
drafts (when the cursor is on the first row); <kbd>Down</kbd>/<kbd>Ctrl+N</kbd>
walks back down.

## During a reply

- <kbd>Esc</kbd> <kbd>Esc</kbd> (twice, within half a second) interrupts a
  streaming reply.
- <kbd>Ctrl+O</kbd> expands or collapses the last tool call.
- <kbd>Alt</kbd>+<kbd>↑</kbd> recalls prompts you "steered" while the agent
  was busy; add <kbd>Shift</kbd> to walk the stacked history.
- With a single-line input, <kbd>Up</kbd>/<kbd>Down</kbd> scroll the chat.

## Mouse

Drag with the left button to select text in the input or chat. Enable
`copy-on-select` in the [`ui`](/docs/configuration/ui/) config to copy
automatically. The footer row shows the keys that apply to whatever is on
screen, and the sidebar and collapsed footer show the workspace's current
git branch (⎇ …), refreshed at the start of every turn.
