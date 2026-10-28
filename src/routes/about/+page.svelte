<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const Content = $derived(data.component);
</script>

<svelte:head>
	<title>About — Shuvarie</title>
	<meta
		name="description"
		content="Shuvarie (シュヴァリエ) — chevalier, French for knight. An open-source AI coding agent written in Rust, for chivalrous people."
	/>
</svelte:head>

<div class="relative overflow-hidden border-b border-line">
	<div class="pointer-events-none absolute inset-0 bg-grid opacity-40"></div>
	<div class="relative mx-auto w-full max-w-3xl px-5 pt-14 pb-10 sm:px-8">
		<p class="font-mono text-2xs tracking-[0.18em] text-gold/80 uppercase">// about</p>
		<h1 class="mt-3 font-mono text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
			⚔ シュヴァリエ
		</h1>
		<p class="mt-2 font-mono text-xs text-fog">
			chevalier, n. — a knight; one who rides by a code.
		</p>
	</div>
</div>

<div class="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
	<div class="prose">
		<Content />
	</div>
</div>
