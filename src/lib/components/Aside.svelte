<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		/** `note` (gold), `tip` (jade) or `warn` (ember). */
		kind?: 'note' | 'tip' | 'warn';
		title?: string;
		children: Snippet;
	};

	let { kind = 'note', title, children }: Props = $props();

	const styles = {
		note: { bar: 'border-gold/60', label: 'text-gold', mark: '›', fallback: 'note' },
		tip: { bar: 'border-jade/60', label: 'text-jade', mark: '✓', fallback: 'tip' },
		warn: { bar: 'border-ember/60', label: 'text-ember', mark: '!', fallback: 'warning' }
	} as const;

	const style = $derived(styles[kind]);
	const heading = $derived(title ?? style.fallback);
</script>

<aside class="my-6 border border-line border-l-2 {style.bar} bg-panel/60 px-4 py-3">
	<p class="mb-1.5 flex items-center gap-2 font-mono text-2xs tracking-[0.16em] uppercase {style.label}">
		<span aria-hidden="true">{style.mark}</span>
		<span>{heading}</span>
	</p>
	<div class="text-[13.5px] leading-relaxed text-fog [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
		{@render children()}
	</div>
</aside>
