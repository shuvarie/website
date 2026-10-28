<script lang="ts">
	import type { Heading } from '#lib/docs';

	let { headings = [] }: { headings?: Heading[] } = $props();

	let active = $state('');

	$effect(() => {
		const elements = headings
			.map((heading) => document.getElementById(heading.id))
			.filter((element): element is HTMLElement => Boolean(element));

		if (!elements.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						active = entry.target.id;
						break;
					}
				}
			},
			{ rootMargin: '-72px 0px -70% 0px', threshold: 0 }
		);

		for (const element of elements) observer.observe(element);
		return () => observer.disconnect();
	});
</script>

{#if headings.length}
	<div class="font-mono text-[11px]">
		<p class="mb-3 text-2xs tracking-[0.16em] text-fog-dim uppercase">on this page</p>
		<ul class="space-y-1.5 border-l border-line">
			{#each headings as heading (heading.id)}
				<li>
					<a
						href="#{heading.id}"
						class="-ml-px block border-l py-0.5 leading-snug transition-colors {active === heading.id
							? 'border-gold text-gold-soft'
							: 'border-transparent text-fog-dim hover:text-chalk'} {heading.depth === 3
							? 'pl-5'
							: heading.depth === 4
								? 'pl-8'
								: 'pl-3'}"
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
