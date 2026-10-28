<script lang="ts">
	import CopyCommand from '#lib/components/CopyCommand.svelte';
	import Terminal from '#lib/components/Terminal.svelte';

	const features = [
		{
			title: 'Bring your own model',
			body: 'OpenAI-compatible, Anthropic, Google, Bedrock, Ollama and more, configured in one connections.kdl and switchable on the fly with /model.'
		},
		{
			title: 'Codemode',
			body: 'One tool that runs a Rhai script, and the script calls the others: dependent calls become one round trip, intermediate results never reach the context.'
		},
		{
			title: 'Sessions & forking',
			body: 'Every session is a tree. Inspect it with /tree, roll back with /undo, replay a turn, and export or import the whole thing as JSON.'
		},
		{
			title: 'Skills',
			body: 'Reusable prompts and procedures stored as markdown, discovered from .agents/skills and invoked straight from the prompt as /skill:<name>.'
		},
		{
			title: 'Scenes & themes',
			body: 'Built-in Advisor, Reviewer and Orchestrator scenes plus five theme families. Drop in scene.d and themes.d files, switch live with /scene.'
		},
		{
			title: 'Attachments',
			body: 'Type @path to attach PDFs, office documents, spreadsheets, EPUBs or images. The model reads them through read_file, images as multimodal parts.'
		},
		{
			title: 'Permissions & trust',
			body: 'A workspace trust prompt on first run, plus a granular allow / deny / ask policy for paths, shells and tools — optionally backed by decision models.'
		},
		{
			title: 'Keyboard-first',
			body: 'Every action has a keybinding, and Ctrl+M puts every command one keystroke away. Emacs editing keys work where you expect them.'
		},
		{
			title: 'Headless mode',
			body: 'shuvarie run "…" drives the agent without the TUI, streaming the reply to stdout and the tool log to stderr — same config, permissions and sessions.'
		}
	];

	const docs = [
		{
			href: '/docs/install',
			label: 'Install',
			body: 'Nix or Cargo, then the first-run flow: provider setup and workspace trust.'
		},
		{
			href: '/docs/usage',
			label: 'Usage',
			body: 'The prompt, slash commands, keybindings, sessions and workspace trust.'
		},
		{
			href: '/docs/configuration',
			label: 'Configuration',
			body: 'Every KDL file: providers, scenes, codemode, permissions and themes.'
		}
	];
</script>

<svelte:head>
	<title>Shuvarie — an AI coding agent for chivalrous people</title>
	<meta
		name="description"
		content="Shuvarie (シュヴァリエ) is a terminal-native AI coding agent: agentic edits, a forkable session tree, codemode, skills, scenes and granular permissions. Written in Rust."
	/>
</svelte:head>

<!-- ------------------------------------------------------------------ hero -->
<section class="relative overflow-hidden border-b border-line">
	<div class="pointer-events-none absolute inset-0 bg-grid opacity-60"></div>
	<div
		class="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[120px]"
	></div>

	<div class="relative mx-auto w-full max-w-6xl px-5 pt-14 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
		<div class="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
			<div class="fade-in">
				<p class="flex flex-wrap items-center gap-2 font-mono text-2xs tracking-[0.16em] uppercase">
					<span class="text-gold">⚔ シュヴァリエ</span>
					<span class="text-line-bright">|</span>
					<span class="text-fog-dim">open source · rust · mit</span>
				</p>

				<h1
					class="mt-5 font-mono text-[1.9rem] leading-[1.15] font-semibold tracking-tight text-balance text-chalk sm:text-[2.6rem]"
				>
					The AI coding agent<br />
					for <span class="text-gold">chivalrous people</span>.
				</h1>

				<p class="mt-5 max-w-md text-[15px] leading-relaxed text-fog">
					Shuvarie lives in your terminal. It reads your code, edits files, runs tools and keeps a
					forkable history of every decision — all under explicit, granular permissions you control.
				</p>

				<div class="mt-7 flex flex-wrap items-center gap-3">
					<a
						href="/docs/install"
						class="group inline-flex h-10 items-center gap-2 border border-gold/70 bg-gold px-4 font-mono text-xs font-medium text-void transition-colors hover:bg-gold-soft"
					>
						install
						<span class="transition-transform group-hover:translate-x-0.5">→</span>
					</a>
					<a
						href="/docs"
						class="inline-flex h-10 items-center gap-2 border border-line-bright bg-panel px-4 font-mono text-xs text-chalk transition-colors hover:border-gold/40 hover:bg-panel-2"
					>
						read the docs
					</a>
				</div>

				<div class="mt-6 max-w-md">
					<CopyCommand command="nix run github:shuvarie/shuvarie" />
				</div>
			</div>

			<div class="fade-in lg:-mr-6">
				<Terminal />
			</div>
		</div>
	</div>
</section>

<!-- -------------------------------------------------------------- features -->
<section class="border-b border-line">
	<div class="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// features</p>
				<h2 class="mt-2 font-mono text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
					A toolkit that keeps its oaths
				</h2>
			</div>
			<p class="max-w-sm text-[13px] leading-relaxed text-fog">
				Everything the agent touches passes a permission ward first. Nothing is reverted behind your
				back — only fate is re-chosen.
			</p>
		</div>

		<div class="mt-10 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature, i (feature.title)}
				<div
					class="group relative border-r border-b border-line bg-ink/40 p-5 transition-colors hover:bg-panel"
				>
					<div class="flex items-baseline gap-3">
						<span class="font-mono text-2xs text-gold/60">{String(i + 1).padStart(2, '0')}</span>
						<h3 class="font-mono text-[13px] font-medium tracking-tight text-chalk">
							{feature.title}
						</h3>
					</div>
					<p class="mt-2.5 pl-8 text-[13px] leading-relaxed text-fog">{feature.body}</p>
					<span
						class="absolute top-0 left-0 h-px w-0 bg-gold/60 transition-all duration-300 group-hover:w-full"
					></span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- -------------------------------------------------------------- codemode -->
<section class="border-b border-line bg-ink/30">
	<div class="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
		<div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
			<div>
				<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// spotlight</p>
				<h2 class="mt-2 font-mono text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
					Codemode: the tool that calls the tools
				</h2>
				<p class="mt-4 text-[14px] leading-relaxed text-fog">
					Most agents burn a round trip per tool call. Shuvarie hands the model one tool that runs a
					<span class="text-chalk">Rhai</span> script — and inside that script, every other tool is
					callable. Dependent calls collapse into one turn, and only what the script returns ever
					reaches the context window.
				</p>

				<ul class="mt-5 space-y-2.5 font-mono text-xs text-fog">
					<li class="flex gap-2.5">
						<span class="text-gold">▸</span><span>One round trip for a whole chain of lookups.</span>
					</li>
					<li class="flex gap-2.5">
						<span class="text-gold">▸</span
						><span>Intermediate output is filtered in the script, not the context.</span>
					</li>
					<li class="flex gap-2.5">
						<span class="text-gold">▸</span
						><span>On by default; timeouts, call caps and inline budgets in shuvarie.kdl.</span>
					</li>
					<li class="flex gap-2.5">
						<span class="text-gold">▸</span
						><span>/codemode switches the offer, the roster and state keeping mid-session.</span>
					</li>
				</ul>

				<a
					href="/docs/configuration/codemode"
					class="mt-7 inline-flex items-center gap-2 font-mono text-xs text-gold-soft hover:text-gold"
				>
					read the codemode docs <span>→</span>
				</a>
			</div>

			<div class="panel overflow-hidden">
				<div
					class="flex items-center gap-2 border-b border-line px-3 py-1.5 font-mono text-2xs text-fog-dim"
				>
					<span class="text-gold-soft">codemode</span>
					<span class="opacity-40">·</span>
					<span>script.rhai</span>
					<span class="ml-auto">run by the model, once</span>
				</div>
				<pre
					class="overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed"><code><span
							class="text-fog-dim">// one call, many tools — results stay in the script</span>
<span class="text-gold">let</span> hits = tools::grep(<span class="text-fog">&#123;#</span> pattern: <span class="text-jade">"fn export"</span>, path: <span class="text-jade">"src"</span> <span class="text-fog">&#125;</span>);

<span class="text-gold">let</span> sources = hits.map(<span class="text-fog">|h|</span> tools::read_file(<span class="text-fog">&#123;#</span> path: h.path <span class="text-fog">&#125;</span>));

<span class="text-gold">let</span> offenders = sources.filter(<span class="text-fog">|s|</span> !s.contains(<span class="text-jade">"dry_run"</span>));

<span class="text-gold">text</span>(<span class="text-jade">`$&#123;offenders.len&#125; call sites miss dry-run`</span>);</code></pre>
				<div
					class="flex items-center gap-3 border-t border-line px-4 py-2 font-mono text-2xs text-fog-dim"
				>
					<span class="text-jade">✓</span>
					<span>3 tools · 0 context tokens spent on the middle steps</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ------------------------------------------------------------------ docs -->
<section class="border-b border-line">
	<div class="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// manual</p>
				<h2 class="mt-2 font-mono text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
					Read it like a spec sheet
				</h2>
			</div>
			<a href="/docs" class="font-mono text-xs text-gold-soft hover:text-gold">/docs →</a>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-3">
			{#each docs as doc (doc.href)}
				<a
					href={doc.href}
					class="corner group border border-line bg-ink/50 p-5 transition-colors hover:bg-panel"
				>
					<div class="flex items-center justify-between font-mono text-[13px] text-chalk">
						<span>{doc.label}</span>
						<span
							class="text-fog-dim transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
							>→</span
						>
					</div>
					<p class="mt-2 text-[13px] leading-relaxed text-fog">{doc.body}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- --------------------------------------------------------------- install -->
<section>
	<div class="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">
		<div>
			<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// install</p>
			<h2 class="mt-2 font-mono text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
				Summon it in millis
			</h2>
			<p class="mt-4 max-w-md text-[14px] leading-relaxed text-fog">
				A single binary. Pick a provider on first launch — a local Ollama needs no key — and answer
				the workspace trust prompt. Then type.
			</p>
			<div
				class="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-2xs tracking-[0.14em] text-fog-dim uppercase"
			>
				<span>x86_64-linux</span>
				<span>aarch64-linux</span>
				<span>x86_64-darwin</span>
				<span>aarch64-darwin</span>
			</div>
		</div>

		<div class="space-y-2">
			<CopyCommand label="try" command="nix run github:shuvarie/shuvarie" />
			<CopyCommand label="keep" command="nix profile install github:shuvarie/shuvarie" />
			<CopyCommand label="cargo" command="cargo install --path ." />
			<a
				href="/docs/install"
				class="mt-4 inline-flex items-center gap-2 font-mono text-xs text-gold-soft hover:text-gold"
			>
				full install guide <span>→</span>
			</a>
		</div>
	</div>
</section>
