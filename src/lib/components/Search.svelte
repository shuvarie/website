<script lang="ts">
	import { goto } from '$app/navigation';

	type Entry = { slug: string; title: string; group: string; text: string };

	let open = $state(false);
	let query = $state('');
	let entries = $state<Entry[]>([]);
	let loading = $state(false);
	let cursor = $state(0);
	let input: HTMLInputElement | undefined = $state();

	let results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return entries.slice(0, 8);
		const terms = q.split(/\s+/);
		return entries
			.map((entry) => {
				const haystack = `${entry.title} ${entry.group} ${entry.text}`.toLowerCase();
				let score = 0;
				for (const term of terms) {
					const at = haystack.indexOf(term);
					if (at === -1) return { entry, score: -1 };
					score += entry.title.toLowerCase().includes(term) ? 12 : 1;
					score += Math.max(0, 6 - at / 200);
				}
				return { entry, score };
			})
			.filter((hit) => hit.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 12)
			.map((hit) => hit.entry);
	});

	async function loadIndex() {
		if (entries.length || loading) return;
		loading = true;
		try {
			const response = await fetch('/search.json');
			if (response.ok) entries = await response.json();
		} finally {
			loading = false;
		}
	}

	async function show() {
		open = true;
		query = '';
		cursor = 0;
		await loadIndex();
		queueMicrotask(() => input?.focus());
	}

	function hide() {
		open = false;
	}

	function go(entry: Entry | undefined) {
		if (!entry) return;
		hide();
		goto(`/docs/${entry.slug}`);
	}

	function onkeydown(event: KeyboardEvent) {
		if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			if (open) hide();
			else show();
			return;
		}
		if (event.key === '/' && !open) {
			const target = event.target as HTMLElement | null;
			if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
			event.preventDefault();
			show();
			return;
		}
		if (!open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			hide();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			cursor = Math.min(cursor + 1, results.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			cursor = Math.max(cursor - 1, 0);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			go(results[cursor]);
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('keydown', onkeydown);
		return () => window.removeEventListener('keydown', onkeydown);
	});

	$effect(() => {
		query;
		cursor = 0;
	});
</script>

<button
	type="button"
	onclick={show}
	class="flex h-8 w-full items-center gap-2 border border-line bg-ink px-2.5 font-mono text-[11px] text-fog-dim transition-colors hover:border-line-bright hover:text-fog"
>
	<span class="text-gold/70">/</span>
	<span>search docs</span>
	<kbd class="ml-auto border border-line-bright px-1 py-px text-[10px] text-fog-dim">⌘K</kbd>
</button>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-start justify-center bg-void/80 px-4 pt-[12vh] backdrop-blur-sm"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && hide()}
	>
		<div
			class="panel w-full max-w-lg shadow-[0_30px_90px_-30px_rgba(0,0,0,0.95)]"
			role="dialog"
			aria-modal="true"
			aria-label="Search documentation"
		>
			<div class="flex items-center gap-2 border-b border-line px-3">
				<span class="text-gold">/</span>
				<input
					bind:this={input}
					bind:value={query}
					placeholder="search the manual…"
					class="h-11 flex-1 bg-transparent font-mono text-xs text-chalk outline-none placeholder:text-fog-dim"
				/>
				<kbd class="border border-line-bright px-1 py-px font-mono text-[10px] text-fog-dim">esc</kbd>
			</div>

			<ul class="max-h-80 overflow-y-auto p-1.5">
				{#if loading && !entries.length}
					<li class="px-2.5 py-2 font-mono text-[11px] text-fog-dim">loading index…</li>
				{:else if !results.length}
					<li class="px-2.5 py-2 font-mono text-[11px] text-fog-dim">no matches</li>
				{:else}
					{#each results as entry, i (entry.slug)}
						<li>
							<button
								type="button"
								onmouseenter={() => (cursor = i)}
								onclick={() => go(entry)}
								class="flex w-full items-baseline gap-3 px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors {i ===
								cursor
									? 'bg-gold/10 text-chalk'
									: 'text-fog hover:bg-panel-2'}"
							>
								<span class="truncate">{entry.title}</span>
								<span class="ml-auto shrink-0 text-2xs text-fog-dim">{entry.group}</span>
							</button>
						</li>
					{/each}
				{/if}
			</ul>

			<div class="flex items-center gap-4 border-t border-line px-3 py-1.5 font-mono text-2xs text-fog-dim">
				<span><kbd class="text-fog">↑↓</kbd> move</span>
				<span><kbd class="text-fog">↵</kbd> open</span>
				<span class="ml-auto">{entries.length} pages indexed</span>
			</div>
		</div>
	</div>
{/if}
