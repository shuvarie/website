<script lang="ts">
	import Toc from '#lib/components/Toc.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const Content = $derived(data.doc.component);
</script>

<svelte:head>
	<title>{data.doc.title} — Shuvarie docs</title>
	{#if data.doc.description}
		<meta name="description" content={data.doc.description} />
	{/if}
</svelte:head>

<div class="grid gap-10 py-8 lg:py-12 xl:grid-cols-[minmax(0,1fr)_190px]">
	<div class="min-w-0">
		<p class="font-mono text-2xs tracking-[0.14em] text-fog-dim uppercase">
			<a href="/docs" class="transition-colors hover:text-gold">docs</a>
			<span class="mx-1.5 text-line-bright">/</span>
			<span class="text-fog">{data.group}</span>
		</p>

		<h1 class="mt-3 font-mono text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
			{data.doc.title}
		</h1>

		{#if data.doc.description}
			<p class="mt-2 max-w-xl text-[13.5px] leading-relaxed text-fog">{data.doc.description}</p>
		{/if}

		<div class="prose mt-8">
			<Content />
		</div>

		<nav class="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label="Pagination">
			{#if data.prev}
				<a
					href={data.prev.href}
					class="group border border-line bg-ink/50 px-4 py-3 transition-colors hover:border-line-bright hover:bg-panel"
				>
					<span class="font-mono text-2xs tracking-[0.16em] text-fog-dim uppercase">← prev</span>
					<span class="mt-1 block font-mono text-xs text-chalk group-hover:text-gold-soft"
						>{data.prev.title}</span
					>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if data.next}
				<a
					href={data.next.href}
					class="group border border-line bg-ink/50 px-4 py-3 text-right transition-colors hover:border-line-bright hover:bg-panel sm:col-start-2"
				>
					<span class="font-mono text-2xs tracking-[0.16em] text-fog-dim uppercase">next →</span>
					<span class="mt-1 block font-mono text-xs text-chalk group-hover:text-gold-soft"
						>{data.next.title}</span
					>
				</a>
			{/if}
		</nav>
	</div>

	<aside class="hidden xl:block">
		<div class="sticky top-20">
			<Toc headings={data.doc.headings} />
		</div>
	</aside>
</div>
