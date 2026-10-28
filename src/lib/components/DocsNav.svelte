<script lang="ts">
	import { navGroups } from '#lib/docs';

	let { current = '' }: { current?: string } = $props();
</script>

<nav class="font-mono text-xs" aria-label="Documentation">
	{#each navGroups as group (group.title)}
		<div class="mb-6">
			<p class="mb-2 flex items-center gap-2 text-2xs tracking-[0.16em] text-fog-dim uppercase">
				<span>{group.title}</span>
				<span class="h-px flex-1 bg-line"></span>
			</p>
			<ul class="space-y-px border-l border-line">
				{#each group.items as doc (doc.slug)}
					{@const active = doc.slug === current}
					<li>
						<a
							href={doc.href}
							aria-current={active ? 'page' : undefined}
							class="-ml-px flex items-center gap-2 border-l py-1.5 pl-3 transition-colors {active
								? 'border-gold bg-gold/[0.06] text-chalk'
								: 'border-transparent text-fog hover:border-line-bright hover:text-chalk'}"
						>
							<span class="truncate">{doc.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
