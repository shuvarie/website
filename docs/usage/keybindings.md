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
| <kbd>Ctrl+T</kbd> | Cycle the reasoning-effort variant (<kbd>Ctrl+Shift+T</kbd> too) |
| <kbd>Ctrl+W</kbd> | Toggle the sidebar |
| <kbd>Ctrl+Shift+V</kbd> | Paste an image off the system clipboard as an attachment (also <kbd>Alt+Shift+V</kbd>) |

## Editing

Standard Emacs keys in the input box: <kbd>Ctrl+B</kbd>/<kbd>F</kbd> move by
character, <kbd>Alt+B</kbd>/<kbd>F</kbd> by word, <kbd>Ctrl+A</kbd>/<kbd>E</kbd>
go to line start/end, <kbd>Ctrl+D</kbd>/<kbd>H</kbd>/<kbd>K</kbd>/<kbd>U</kbd>
delete or kill text. <kbd>Shift</kbd>+arrows/<kbd>Home</kbd>/<kbd>End</kbd>
select text for copy/cut.

<kbd>Up</kbd>/<kbd>Ctrl+P</kbd> recalls previously sent prompts and stashed
drafts (when the cursor is on the first row); <kbd>Down</kbd>/<kbd>Ctrl+N</kbd>
walks back down.

## Scrolling the chat

| Key | Action |
| ----- | -------- |
| <kbd>Up</kbd>/<kbd>Down</kbd> | Scroll one row (with a single-line input) |
| <kbd>Ctrl+N</kbd>/<kbd>Ctrl+P</kbd> | Scroll down / up |
| <kbd>Ctrl+V</kbd> | Half-page down (Emacs `C-v`) |
| <kbd>Alt+V</kbd> | Half-page up (Emacs `M-v`) |
| Wheel | Scroll three rows per tick |

`j`/`k` no longer scroll the chat; they still work inside list popups (the
scene, variant, theme and tree pickers, and the trust prompt).

## During a reply

- <kbd>Esc</kbd> <kbd>Esc</kbd> (twice, within half a second) interrupts a
  streaming reply.
- <kbd>Ctrl+O</kbd> expands or collapses the last tool call.
- <kbd>Alt</kbd>+<kbd>↑</kbd> recalls prompts you "steered" while the agent
  was busy; add <kbd>Shift</kbd> to walk the stacked history.

When several tool calls from one message share the concurrency slots (see
[`tool-concurrency`](/docs/configuration/scenes/#declaring-a-scene)), the
ones whose turn has not come yet are shown *queued*: the block holds a still
`◇` where a running one spins and its meta row reads `Queued 4.5s`, then
swaps to the spinner and `Elapsed …` when it starts.

## After a turn

Every finished reply closes with a dimmed footer — the wall-clock time the
turn took and the model code that served it, under the scene it ran under,
e.g. `Took 12.4s · anthropic/claude-sonnet-4-5 (plan)`. The footer is stored
with the session, so it is still there when you resume; a turn that knows
only one of the two shows just that one, and imported or older turns may
show none.

A turn's end is also announced if you asked for it: Shuvarie sends a desktop
notification through the terminal (OSC 9) by default, and can play a sound —
see [`ui.notify`](/docs/configuration/ui/#notify).

## Popups

| Popup | Keys |
| ------- | ------ |
| Permission ask | <kbd>Enter</kbd>/`y`/`a` allow, `s` allow for the session, `d` allow everything in the asked file's directory for the session (path asks only), <kbd>Esc</kbd>/`n` deny |
| Question | <kbd>↑</kbd>/<kbd>↓</kbd> move, <kbd>←</kbd>/<kbd>→</kbd>/<kbd>Tab</kbd> switch question, <kbd>Enter</kbd> toggle an option, `1`–`9` pick one, <kbd>Esc</kbd> dismiss — mid-stream it also interrupts the turn |
| Todo list | <kbd>↑</kbd>/<kbd>↓</kbd> or `j`/`k` move, <kbd>Home</kbd>/`g` and <kbd>End</kbd>/`G` jump to the ends, <kbd>Esc</kbd>/`q` close |
| Peak table | `t` switch the time columns between the schedule's zone, UTC and local time, <kbd>Esc</kbd>/`q` close |
| Codemode overlay | <kbd>↑</kbd>/<kbd>↓</kbd> (<kbd>Ctrl+P</kbd>/<kbd>Ctrl+N</kbd>) walk, <kbd>Enter</kbd>/<kbd>Space</kbd> change a switch, <kbd>Esc</kbd> close |
| Invalid slash command | <kbd>Enter</kbd> send the held text anyway, <kbd>Esc</kbd> hand it back to the composer |
| Command menu | <kbd>↑</kbd>/<kbd>↓</kbd> navigate, <kbd>Enter</kbd> run, <kbd>Esc</kbd> close |
| Slash-command menu | <kbd>Tab</kbd> complete, <kbd>↑</kbd>/<kbd>↓</kbd> select, <kbd>Enter</kbd> run, <kbd>Esc</kbd> dismiss |
| `@`-mention completion | <kbd>Tab</kbd>/<kbd>Enter</kbd> accept, <kbd>↑</kbd>/<kbd>↓</kbd> move, <kbd>Esc</kbd> dismiss |
| Image viewer | <kbd>←</kbd>/<kbd>h</kbd> and <kbd>→</kbd>/<kbd>l</kbd> step, <kbd>Esc</kbd>/<kbd>q</kbd> close |

## Mouse

Drag with the left button to select text in the input or chat. Enable
`copy-on-select` in the [`ui`](/docs/configuration/ui/) config to copy
automatically. Clicking an attached image opens the
[viewer](/docs/usage/commands/). Dropping a file onto the terminal pastes
its path into the composer, which picks it up as an attachment. The footer
row shows the keys that apply to whatever is on screen, and the sidebar and
collapsed footer show the workspace's current git branch (`⎇ …`), refreshed
at the start of every turn.
