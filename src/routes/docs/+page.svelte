<script lang="ts">
	import { docs, navGroups } from '#lib/docs';

	const start = docs.find((doc) => doc.slug === 'install');
	const total = docs.length;
</script>

<svelte:head>
	<title>The manual — Shuvarie docs</title>
	<meta
		name="description"
		content="Install Shuvarie, learn the prompt, and configure every KDL file: providers, scenes, codemode, permissions and themes."
	/>
</svelte:head>

<div class="py-10 lg:py-14">
	<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// manual</p>
	<h1 class="mt-2 font-mono text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
		The Shuvarie manual
	</h1>
	<p class="mt-3 max-w-xl text-[14px] leading-relaxed text-fog">
		{total} pages of reference for the agent, the prompt, the session tree and every KDL file it reads.
		Written in markdown and compiled with mdsvex — Svelte's MDX — so pages can embed components;
		code blocks are highlighted at build time and this whole page is static.
	</p>

	{#if start}
		<a
			href={start.href}
			class="corner group mt-8 flex items-center gap-4 border border-line bg-ink/60 px-5 py-4 transition-colors hover:bg-panel"
		>
			<span class="font-mono text-2xs text-gold/70">01</span>
			<div class="min-w-0">
				<p class="font-mono text-[13px] text-chalk">Start here → {start.title}</p>
				<p class="mt-0.5 truncate text-[12.5px] text-fog">{start.description}</p>
			</div>
			<span class="ml-auto font-mono text-xs text-fog-dim group-hover:text-gold">→</span>
		</a>
	{/if}

	<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each navGroups as group (group.title)}
			<section>
				<p class="mb-3 flex items-center gap-2 font-mono text-2xs tracking-[0.16em] text-fog-dim uppercase">
					<span>{group.title}</span>
					<span class="h-px flex-1 bg-line"></span>
					<span class="text-fog-dim/70">{group.items.length}</span>
				</p>
				<ul class="space-y-2.5">
					{#each group.items as doc (doc.slug)}
						<li>
							<a href={doc.href} class="group block">
								<span class="font-mono text-[12.5px] text-chalk transition-colors group-hover:text-gold-soft"
									>{doc.title}</span
								>
								{#if doc.description}
									<span class="mt-0.5 block text-[12px] leading-relaxed text-fog-dim"
										>{doc.description}</span
									>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>
