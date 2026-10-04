---
layout: page
title: Providers & models
parent: Configuration
nav_order: 7
permalink: /docs/configuration/providers/
---

## connections.kdl

Providers, API keys and the active model live in
`~/.config/shuvarie/connections.kdl` (the file starts with a reminder that
it contains your API keys — treat it accordingly). It is written for you by
the add-provider wizard ([`/provider`](/docs/usage/commands/)) and edited
indirectly via [`/model`](/docs/usage/commands/) and <kbd>Ctrl+T</kbd>, but
you can edit it by hand:

```kdl
active {
    provider "67e55044-10b1-426f-9247-bb680e5fe0c8"  // required: id of the default provider
    model "gpt-4o"                                   // optional: default model
    variant "high"                                   // optional: default reasoning effort
}

providers {
    provider id="67e55044-10b1-426f-9247-bb680e5fe0c8" name="OpenAI" {
        kind "openai"           // transport, see below
        catalog "ollama-cloud"  // optional: catalog id for model metadata
        api-key "sk-..."        // required unless local or OAuth (chatgpt, copilot)
        base-url "https://..."  // optional: overrides the catalog endpoint
    }
}
```

Valid `kind` values: `openai`, `openai-compat`, `openrouter`, `vercel`,
`anthropic`, `google`, `azure`, `bedrock`, `google-vertex`, `ollama`,
`chatgpt`, `copilot`.
Notes:

- An API key is required unless the provider is local (`ollama` needs none;
  it defaults to `http://localhost:11434`) or its catalog entry is keyless.
- `chatgpt` and `copilot` use **OAuth device sign-in** instead of API keys:
  omit `api-key`, and submitting the add-provider wizard opens a popup with
  a verification URL and code (<kbd>o</kbd>/<kbd>Enter</kbd> opens the
  browser, <kbd>y</kbd> copies the URL, <kbd>c</kbd> copies the code;
  dismissing the popup doesn't cancel the sign-in). Tokens are cached on
  disk and refreshed automatically. Other kinds must configure an API key.
- `api-key` and `base-url` values expand `$VAR` / `${VAR}` from the
  environment.

## decision-providers

Decision models (see [Decisions](/docs/configuration/decisions/)) do **not**
ride the completion path: they use their own `decision-providers` block and
an active `decision` selection in the same `connections.kdl`. The only wire
protocol today is `systemone` (TypeSafe's System One API, which Ollama's Clef
models and Cloudflare also serve):

```kdl
decision-providers {
    provider "ollama" {          // name used to reference the connection
        type "systemone"
        base-url "http://localhost:11434"   // host root gains /v1/systemone; a full URL is used as-is
        api-key "…"              // optional: local servers ignore authentication
    }
}

decision {
    provider "ollama"            // both children are required
    model "clef"                 // free text — decision models are not enumerable
}
```

[`/decision-provider`](/docs/usage/commands/) opens the dialog that writes
both blocks (name, endpoint, optional key, free-text model).

## default-providers

When a prompt names a model as `<provider_kind>/<model>` (for example a
custom command's `model:` frontmatter), `default-providers` says which
connection to use for each connection type:

```kdl
default-providers {
    use id="67e55044-10b1-426f-9247-bb680e5fe0c8"
}
```

## registries

The built-in model/provider registry is `selune`. Popups fetch catalog data
on demand — press <kbd>Ctrl+O</kbd> to toggle between offline and hosted
sources — or refresh at startup with `remote-first #true` (5 s timeout):

```kdl
registries {
    selune {
        remote-first #false
        // disabled #true   // add #true to switch the registry off
    }
}
```

Add your own registry with a `registry` block — an offline snapshot
(`path`) and/or a remote source (`url`), plus optional request `headers`.
`name` is required and must not be `selune` (it is always defined):

```kdl
registries {
    registry {
        name "internal"
        url "https://registry.example.com/catalog.json"
        path "~/.cache/shuvarie/internal.json"   // optional offline snapshot
        headers { Authorization "Bearer $REGISTRY_TOKEN" }
        // disabled #true
        remote-first #false
    }
}
```

`registries` merges key-by-key across config layers.

## embedding

Embeddings power session search. Default per provider: `ollama` ⇒
`nomic-embed-text` with 768 dimensions, Google ⇒ `gemini-embedding-001`.

```kdl
embedding {
    provider "ollama"
    model "nomic-embed-text"
    dimensions 768
    // disabled #true   // add #true to switch embeddings off
}
```
