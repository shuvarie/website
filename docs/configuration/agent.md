---
layout: page
title: Agent & context
parent: Configuration
nav_order: 3
permalink: /docs/configuration/agent/
---

## agent & retry

```kdl
agent {
    max-turns 0          // 0 = unlimited
    worker-max-turns 0  // 0 = unlimited; caps a subagent worker's own turns
}
retry {
    max-retries 10       // auto-retry on timeout/reset/HTTP 408/429/5xx; 0 disables
}
```

Retries back off on a ladder: 3 s, 5 s, 10 s, 20 s, 30 s, 60 s, …

A retry **resumes the turn** instead of replaying it. The failed attempt's
partial reply and the tool calls that already returned ride the retried
request, so the model carries on with the work it had done and re-issues only
what it still needs — the prompt is not sent again as a fresh request, and
the reply lands on the same turn rather than under a second, half-finished
one. See [Sessions](/docs/usage/sessions/).

## context

Context-window management (enabled by default; `disabled #true` turns it
off). One shared input-token budget drives trimming, the overflow guard and
compaction:

```kdl
context {
    reserved 20000                  // tokens kept for the model's reply; input budget = context_length − reserved
    keep-recent-tokens 20000        // tokens kept verbatim as the "tail" when older messages are trimmed
    tool-output-max-chars 16000     // cap on tool output sent to the model (truncated with a read hint); 0 disables
    tool-output-max-bytes 50000     // byte cap applied on top of the char cap; 0 disables
    fallback-context-length 128000  // used when the model catalog has no context length
}
```

When the input budget is exceeded, Shuvarie **compacts**: older messages are
summarized by the model (the recent tail within `keep-recent-tokens` stays
verbatim) and the summary is spliced in at the cut point, so the ride goes on
unbroken. Run it on demand with
[`/compact [instruction]`](/docs/usage/commands/); the optional instruction
focuses the summary.
