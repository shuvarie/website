---
title: Tools & integrations
description: "The tool roster, MCP servers, stdio commands and concurrency."
group: Configuration
order: 5
---

## tools

The `web-search` tool (exposed to the model as `web_search`) works out of
the box: the default backend is **DuckDuckGo Lite**, a JavaScript-free
results page read with the `to_markdown` response kind — no API key needed.
Point it at your own endpoint with the `url` + `type` pair (both or neither:
`url` alone is an error), or switch it off with `disabled #true`:

```kdl
tools {
    web-search {
        // disabled                               // add #true to remove the tool
        url "https://ollama.com/api/web_search"   // required together with type
        type "ollama"                             // or "to_markdown" (fetch page → markdown)
        headers { Authorization "Bearer $MY_TOKEN" }  // $VAR / ${VAR} expand from the environment
        params type="body-json" {         // or type="query" for GET parameters
            query as="query"              // tool argument → remote parameter name
        }
    }
}
```

Default `params` when omitted: `ollama` ⇒ POST body with `query as="query"`;
`to_markdown` ⇒ GET query with `query as="q"` (the DuckDuckGo default).

`read_file` reads documents and images too — see
[Attachments](/docs/configuration/attachments) for the formats and limits.

## todo

The `todo` tool is the agent's own scratchpad for a session: it adds,
updates, removes and lists items (`pending`, `in_progress`, `done`), and the
list is shown in the sidebar as a done/total tally (once the list is
non-empty) and in the [`/todo`](/docs/usage/commands) popup. The list is
*derived* state — it is never stored on its own, but replayed from the
session's `todo` tool calls, so undo, reload and resume all land on the
right list. Scenes can drop the tool with `tool "todo" { disabled #true }`
like any other.

## Custom stdio tools

`tool name="…"` defines your own tool: every call spawns a fresh process
running `cmd`, with `{{param}}` placeholders in the argv replaced by the
call's arguments. The `params` you declare form the tool's JSON input
schema; `input "json"` additionally pipes the resolved arguments to the
child's stdin; `envs` (values may expand `$VAR`) and `timeout` (seconds, at
least 1) round it off. Names starting with `mcp__` are reserved:

```kdl
tools {
    tool name="deploy" {
        description "Deploy the current branch"
        cmd "./scripts/deploy.sh" "{{target}}"
        params {
            param "target" type="string" required=#true description="Where to deploy"
        }
        envs { env "DEPLOY_TOKEN" "$DEPLOY_TOKEN" }  // inherit=#true by default
        timeout 120
    }
}
```

## MCP servers

`mcp` connects [Model Context Protocol](https://modelcontextprotocol.io)
servers over stdio (a spawned child process) or streamable HTTP. Server
names are unique across both transports, and every tool a server exposes
becomes an agent tool named `mcp__<server>__<tool>`:

```kdl
tools {
    mcp {
        stdio name="github" {
            command "npx"
            args "-y" "@modelcontextprotocol/server-github"
            envs { env "GITHUB_TOKEN" "$GITHUB_TOKEN" }  // inherit=#true by default
        }
        http name="remote" {
            url "https://mcp.example.com/mcp"
            headers { Authorization "Bearer $MCP_TOKEN" }  // values expand $VAR
        }
    }
}
```

Servers connect lazily, and their tools are gated like the stdio tools:
every call asks in the TUI by default (grantable by name for the session —
see [permissions](/docs/configuration/permissions)).
[`/mcp`](/docs/usage/commands) lists server states,
`/mcp-reconnect <server>` reconnects one, and the sidebar marks each server
✓ / ○ / ✗.

Every tool on this page is also reachable from a script: with
[codemode](/docs/configuration/codemode) on (the default) configured
`tool` entries and MCP tools leave the model's roster and are called from
Rhai instead (`mcp::<server>::<tool>`), which is what keeps a large MCP
roster out of the context window.

## shell

```kdl
shell {
    path "/usr/bin/zsh"  // executable for run_shell; absolute, relative, or PATH lookup
}
```

## lsp

```kdl
lsp {
    disabled #true      // add #true to switch the LSP tools off (bare form is a no-op)
    servers {
        rust {
            command "rust-analyzer" "..."   // language server command
            extensions "rs"                  // file extensions it serves
            no-auto-start #true              // opt-in only
            root-markers "Cargo.toml"        // files marking a project root
        }
    }
}
```

All fields are optional; the server name is the language it serves.
`lsp.servers` merges key-by-key across config layers.
