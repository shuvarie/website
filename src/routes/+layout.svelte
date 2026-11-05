<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#07080a" />
</svelte:head>

<a
	href="#content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-gold focus:bg-panel focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-chalk"
>
	skip to content
</a>

<div class="flex min-h-dvh flex-col">
	<SiteHeader />
	<main id="content" tabindex="-1" class="flex-1 outline-none">
		{@render children()}
	</main>
	<SiteFooter />
</div>
