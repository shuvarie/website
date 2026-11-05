<script lang="ts">
	import { page } from '$app/state';
	import DocsNav from '#lib/components/DocsNav.svelte';
	import Search from '#lib/components/Search.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const slug = $derived(page.url.pathname.replace(/^\/docs\/?/, '').replace(/\/$/, ''));
	let mobileOpen = $state(false);

	$effect(() => {
		// close the mobile drawer whenever the page changes
		slug;
		mobileOpen = false;
	});
</script>

<svelte:head>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="mx-auto flex w-full max-w-6xl gap-10 px-5 sm:px-8">
	<aside
		class="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r border-line/70 py-8 pr-5 lg:flex xl:w-60"
	>
		<Search />
		<DocsNav current={slug} />
		<div class="mt-auto pt-4 font-mono text-2xs text-fog-dim">
			<a
				href="https://github.com/shuvarie/shuvarie"
				target="_blank"
				rel="noreferrer"
				class="text-fog-dim transition-colors hover:text-gold">github ↗</a
			>
		</div>
	</aside>

	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-3 border-b border-line py-3 lg:hidden">
			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				class="flex items-center gap-2 border border-line bg-ink px-2.5 py-1.5 font-mono text-[11px] text-fog"
			>
				<span class="text-gold">{mobileOpen ? '×' : '≡'}</span>
				{mobileOpen ? 'close' : 'sections'}
			</button>
			<a href="/docs" class="font-mono text-[11px] text-fog-dim hover:text-chalk">/docs</a>
			<a
				href="/docs"
				class="ml-auto font-mono text-2xs tracking-[0.14em] text-fog-dim uppercase hover:text-chalk"
				>manual</a
			>
		</div>

		{#if mobileOpen}
			<div class="border-b border-line py-6 lg:hidden">
				<div class="mb-6"><Search /></div>
				<DocsNav current={slug} />
			</div>
		{/if}

		{@render children()}
	</div>
</div>
