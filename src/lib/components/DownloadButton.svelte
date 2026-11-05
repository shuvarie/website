<script lang="ts">
	import { onMount } from 'svelte';
	import {
		LATEST_RELEASES_URL,
		RELEASES_URL,
		assetFor,
		detectTarget,
		fetchLatestRelease,
		groupAssets,
		type Release,
		type Target
	} from '#lib/downloads';

	type Props = { class?: string };

	let { class: className = '' }: Props = $props();

	let target = $state<Target | null>(null);
	let release = $state<Release | null>(null);
	let failed = $state(false);
	let open = $state(false);
	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLButtonElement>();

	/** The file this browser should get, once both detection and the API have landed. */
	let asset = $derived(release && target ? assetFor(release, target) : null);
	let groups = $derived(release ? groupAssets(release.assets) : []);
	let checksums = $derived(release?.assets.find((entry) => entry.os === 'other') ?? null);

	let href = $derived(asset?.url ?? LATEST_RELEASES_URL);
	/** Only the platform fits on the button; the file name lives in the tooltip. */
	let caption = $derived(target?.label ?? 'latest release');
	let detail = $derived(asset?.name ?? `${caption} — latest release`);

	onMount(() => {
		let live = true;

		// Detection is a microtask or two; the release manifest is a round trip.
		// Either can finish first, and the button fills in as each arrives.
		detectTarget()
			.then((found) => {
				if (live) target = found;
			})
			.catch(() => {});

		fetchLatestRelease()
			.then((latest) => {
				if (live) release = latest;
			})
			.catch(() => {
				if (live) failed = true;
			});

		const onPointerDown = (event: PointerEvent) => {
			if (open && root && !root.contains(event.target as Node)) open = false;
		};
		const onKeydown = (event: KeyboardEvent) => {
			if (open && event.key === 'Escape') {
				open = false;
				trigger?.focus();
			}
		};

		document.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('keydown', onKeydown);

		return () => {
			live = false;
			document.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<div class="relative inline-flex max-w-full {className}" bind:this={root}>
	<div class="flex h-11 w-full items-stretch border border-gold/70 bg-gold text-void">
		<a
			{href}
			target={asset ? undefined : '_blank'}
			rel="noreferrer"
			title="Download {detail}"
			aria-label="Download {detail}"
			class="group flex min-w-0 flex-1 flex-col justify-center px-4 font-mono transition-colors hover:bg-gold-soft"
		>
			<span class="flex items-center gap-1.5 text-xs leading-none font-medium">
				<span class="transition-transform group-hover:translate-y-0.5">↓</span>
				download
			</span>
			<span class="mt-1 text-2xs leading-none text-void/60">{caption}</span>
		</a>

		<span class="w-px shrink-0 bg-void/25"></span>

		<button
			type="button"
			bind:this={trigger}
			onclick={() => (open = !open)}
			aria-expanded={open}
			aria-controls="download-files"
			aria-label="Files for other systems and architectures"
			title="Files for other systems and architectures"
			class="flex w-8 items-center justify-center text-void/70 transition-colors hover:bg-gold-soft hover:text-void"
		>
			<svg
				viewBox="0 0 12 12"
				class="size-3 transition-transform {open ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				stroke-width="1.4"
				stroke-linecap="square"
				aria-hidden="true"
			>
				<path d="M2.5 4.5 6 8l3.5-3.5" />
			</svg>
		</button>
	</div>

	{#if open}
		<div
			id="download-files"
			class="absolute top-full right-0 z-50 mt-2 w-[20rem] max-w-[calc(100vw-2.5rem)] border border-line-bright bg-panel shadow-[0_24px_48px_-20px_#000]"
		>
			<div
				class="flex items-center justify-between gap-3 border-b border-line px-3 py-2 font-mono text-2xs tracking-[0.16em] uppercase"
			>
				<span class="text-gold/80">// downloads</span>
				<span class="text-fog-dim">
					{release ? release.tag : failed ? 'unavailable' : 'loading…'}
				</span>
			</div>

			{#if release}
				<div class="max-h-72 overflow-y-auto py-1">
					{#each groups as group (group.os)}
						<p
							class="px-3 pt-2 pb-1 font-mono text-2xs tracking-[0.14em] text-fog-dim uppercase"
						>
							{group.label}
						</p>
						{#each group.assets as row (row.name)}
							<a
								href={row.url}
								title={row.name}
								onclick={() => (open = false)}
								class="group flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] text-fog transition-colors hover:bg-panel-2 hover:text-chalk"
							>
								<span
									class="size-1 shrink-0 rounded-full {asset?.name === row.name
										? 'bg-gold'
										: 'bg-transparent'}"
								></span>
								<span class="truncate">{row.label}</span>
								<span
									class="ml-auto shrink-0 text-2xs tracking-[0.1em] text-fog-dim uppercase group-hover:text-gold"
								>
									{row.format}
								</span>
							</a>
						{/each}
					{/each}
				</div>
			{:else if failed}
				<p class="px-3 py-3 font-mono text-[11px] leading-relaxed text-fog">
					Could not read the release from GitHub. The files are still listed on the
					<a
						href={RELEASES_URL}
						target="_blank"
						rel="noreferrer"
						class="text-gold-soft underline decoration-gold/40 underline-offset-2 hover:text-gold"
						>releases page</a
					>.
				</p>
			{:else}
				<p class="px-3 py-3 font-mono text-[11px] text-fog-dim">reading release manifest…</p>
			{/if}

			<div
				class="flex items-center justify-between gap-3 border-t border-line px-3 py-2 font-mono text-2xs"
			>
				<a
					href={release?.page ?? LATEST_RELEASES_URL}
					target="_blank"
					rel="noreferrer"
					class="text-gold-soft transition-colors hover:text-gold"
				>
					all releases ↗
				</a>
				{#if checksums}
					<a
						href={checksums.url}
						class="text-fog-dim transition-colors hover:text-chalk"
						title={checksums.name}
					>
						checksums
					</a>
				{/if}
			</div>
		</div>
	{/if}
</div>
