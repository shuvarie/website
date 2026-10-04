---
layout: page
title: Attachments
parent: Configuration
nav_order: 6
permalink: /docs/configuration/attachments/
---

Type `@path` in the composer to attach a file to the prompt. Shuvarie reads
it, sniffs its type and either converts it to markdown (documents) or sends
it as multimodal content (images). An `@`-mention popup completes paths as
you type.

## Supported formats

- **Documents** — `pdf`, `docx`, `pptx`, `odt`/`ods`/`odp`, the `xls`
  family, `rtf`, `epub`, `csv` (converted to GitHub-Flavored Markdown), and
  plain text/code (read line-windowed).
- **Images** — `png`, `jpeg`, `gif`, `webp`. Sent as multimodal parts when
  the model supports them, capped and downscaled to fit.
- **Legacy office** — `.doc`/`.ppt` need an external converter (below).

Attached images render right in the chat pane; the
[`/images`](/docs/usage/commands/) command (or a click on the image) opens
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
}
```

`office-converter` names a program (or an absolute path) invoked as
`--headless --convert-to <docx|pptx> --outdir <dir> <file>` — the
LibreOffice/`soffice` CLI. When it is unset, legacy `.doc`/`.ppt` files are
rejected with a conversion hint.

## ui.image

How images are painted (protocol and cell size) is configured under
[`ui`](/docs/configuration/ui/#image).
