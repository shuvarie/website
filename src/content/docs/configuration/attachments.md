---
title: Attachments
description: "Attach documents and images with `@path`; conversion and limits."
group: Configuration
order: 7
---

Type `@path` in the composer to attach a file to the prompt. Shuvarie reads
it, sniffs its type and either converts it to markdown (documents) or sends
it as multimodal content (images). An `@`-mention popup completes paths as
you type, dragging a file onto the terminal drops its path into the
composer, and images can be pasted straight off the system clipboard with
<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> (or
<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>).

## Supported formats

- **Documents** — `pdf`, `docx`, `pptx`, `odt`/`ods`/`odp`, the `xls`
  family, `rtf`, `epub`, `csv` (converted to GitHub-Flavored Markdown), and
  plain text/code (read line-windowed).
- **Images** — `png`, `jpeg`, `gif`, `webp`. Sent as multimodal parts when
  the model supports them, capped and downscaled to fit.
- **Legacy office** — `.doc`/`.ppt` need an external converter (below).

Attached images render right in the chat pane; the
[`/images`](/docs/usage/commands) command (or a click on the image) opens
the fullscreen viewer. The model can also read documents and images through
the `read_file` tool (`read_file plan.pdf`, `read_file shot.png`): text files
get the line-windowed view, documents return converted markdown, and images
return image content to multimodal models.

## attachments

```kdl
attachments {
    max-images 8        // most images attached to one request (1..=128)
    image-budget 16     // total image budget in MiB (1..=4096)
    image-edge 1568     // long-edge cap in pixels (32..=8000)
    office-converter "soffice"   // external converter for legacy .doc/.ppt
    clipboard-command "wl-paste --type image/png"   // program printing the clipboard image to stdout
}
```

`office-converter` names a program (or an absolute path) invoked as
`--headless --convert-to <docx|pptx> --outdir <dir> <file>` — the
LibreOffice/`soffice` CLI. When it is unset, legacy `.doc`/`.ppt` files are
rejected with a conversion hint.

`clipboard-command` is the program (with optional arguments) that prints the
clipboard image — png, jpeg, gif or webp — to standard output; it is read
when you press the paste-image key. When it is unset a platform helper is
auto-detected: `wl-paste`, `xclip` or `pngpaste` (and PowerShell on
Windows). Pasted images are staged to a temp file under the same size and
edge limits as any other image, then enter the ordinary attachment pipeline.
Over SSH the clipboard lives on the client, so name a command that ferries
it in.

## ui.image

How images are painted (protocol and cell size) is configured under
[`ui`](/docs/configuration/ui#image).
